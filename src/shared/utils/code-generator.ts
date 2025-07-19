
import { GenerationConfig, TemplateData, TableSchema, ParsedSchema } from './types';
import { DATABASE_CONFIGS } from './constants';
import { TemplateGenerator } from './templates';
import JSZip from 'jszip';

export class CodeGenerator {
  private templateGenerator = new TemplateGenerator();
  private generatedTables: string[] = [];

  async generateProject(
    parsedSchema: ParsedSchema,
    config: GenerationConfig,
    projectName: string = 'generated-nestjs-app'
  ): Promise<Buffer> {
    const databaseConfig = DATABASE_CONFIGS.find(db => db.id === config.database_type)!;
    
    const templateData: TemplateData = {
      projectName,
      tables: parsedSchema.tables,
      config,
      databaseConfig,
      timestamp: new Date().toISOString(),
      userRoles: parsedSchema.userRoles || ['admin', 'user']
    };

    const zip = new JSZip();

    // Generate core files
    await this.generateCoreFiles(zip, templateData);

    // Generate entities and modules for each table
    for (const table of parsedSchema.tables) {
      await this.generateTableFiles(zip, table, templateData);
    }

    // Generate authentication module
    await this.generateAuthModule(zip, templateData);

    // Generate utility files
    await this.generateUtilityFiles(zip, templateData);

    // Generate configuration files
    await this.generateConfigFiles(zip, templateData);

    return await zip.generateAsync({ type: 'nodebuffer' });
  }

  private async generateCoreFiles(zip: JSZip, data: TemplateData): Promise<void> {
    // Package.json
    zip.file('package.json', this.templateGenerator.generatePackageJson(data));

    // Main.ts
    zip.file('src/main.ts', this.templateGenerator.generateMainTs(data));

    // App Module
    zip.file('src/app.module.ts', this.templateGenerator.generateAppModule(data));

    // NestJS CLI config
    zip.file('nest-cli.json', JSON.stringify({
      "$schema": "https://json.schemastore.org/nest-cli",
      "collection": "@nestjs/schematics",
      "sourceRoot": "src",
      "compilerOptions": {
        "deleteOutDir": true
      }
    }, null, 2));

    // TypeScript config
    zip.file('tsconfig.json', JSON.stringify({
      "compilerOptions": {
        "module": "commonjs",
        "declaration": true,
        "removeComments": true,
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "allowSyntheticDefaultImports": true,
        "target": "ES2017",
        "sourceMap": true,
        "outDir": "./dist",
        "baseUrl": "./",
        "incremental": true,
        "skipLibCheck": true,
        "strictNullChecks": false,
        "noImplicitAny": false,
        "strictBindCallApply": false,
        "forceConsistentCasingInFileNames": false,
        "noFallthroughCasesInSwitch": false
      }
    }, null, 2));

    // ESLint config
    zip.file('.eslintrc.js', `module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    '@typescript-eslint/recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};`);

    // Environment file
    zip.file('.env', this.generateEnvFile(data));

    // README
    zip.file('README.md', this.generateReadme(data));
  }

  private async generateTableFiles(zip: JSZip, table: TableSchema, data: TemplateData): Promise<void> {
    this.generatedTables.push(table.name);
    const modulePath = `src/modules/${table.name}`;

    // Entity
    zip.file(`${modulePath}/${table.name}.entity.ts`, 
      this.templateGenerator.generateEntity(table, data));

    // Controller
    zip.file(`${modulePath}/${table.name}.controller.ts`, 
      this.templateGenerator.generateController(table, data));

    // Service
    zip.file(`${modulePath}/${table.name}.service.ts`, 
      this.templateGenerator.generateService(table, data));

    // DTOs
    zip.file(`${modulePath}/dto/create-${table.name}.dto.ts`, 
      this.templateGenerator.generateCreateDto(table, data));
    
    zip.file(`${modulePath}/dto/update-${table.name}.dto.ts`, 
      this.templateGenerator.generateUpdateDto(table, data));

    // Module
    zip.file(`${modulePath}/${table.name}.module.ts`, 
      this.templateGenerator.generateModule(table, data));
  }

  private async generateAuthModule(zip: JSZip, data: TemplateData): Promise<void> {
    const authPath = 'src/modules/auth';
    const usersTable = this.generatedTables.filter((val) => val.toLowerCase().includes("user"));
    let usersSchemaName = "Users";
    let usersFilesName = "users";
    if (usersTable.length > 0) {
      usersSchemaName = usersTable[0].charAt(0).toUpperCase() + usersTable[0].slice(1);
      usersFilesName = usersTable[0].toLowerCase();
    }
    // Auth Service
    zip.file(`${authPath}/auth.service.ts`, `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ${usersSchemaName} } from '../${usersFilesName}/${usersFilesName}.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(${usersSchemaName})
    private userRepository: Repository<${usersSchemaName}>,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });
    
    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user || !await bcrypt.compare(loginDto.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async validateUser(payload: any) {
    return await this.userRepository.findOne({
      where: { id: payload.sub },
    });
  }
}`);

    // Auth Controller
    zip.file(`${authPath}/auth.controller.ts`, `import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
${data.config.with_swagger ? "import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';" : ''}

${data.config.with_swagger ? "@ApiTags('auth')" : ''}
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  ${data.config.with_swagger ? "@ApiOperation({ summary: 'Register a new user' })" : ''}
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  ${data.config.with_swagger ? "@ApiOperation({ summary: 'Login user' })" : ''}
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  ${data.config.with_swagger ? "@ApiOperation({ summary: 'Get current user profile' })" : ''}
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}`);

    // Auth Module
    zip.file(`${authPath}/auth.module.ts`, `import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ${usersSchemaName} } from '../${usersFilesName}/${usersFilesName}.entity';
import { JwtStrategy } from '../../strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([${usersSchemaName}]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}`);

    // DTOs
    zip.file(`${authPath}/dto/login.dto.ts`, `${data.config.full_validations ? "import { IsEmail, IsNotEmpty } from 'class-validator';" : ''}
${data.config.with_swagger ? "import { ApiProperty } from '@nestjs/swagger';" : ''}

export class LoginDto {
  ${data.config.with_swagger ? '@ApiProperty()' : ''}
  ${data.config.full_validations ? '@IsEmail()' : ''}
  ${data.config.full_validations ? '@IsNotEmpty()' : ''}
  email: string;

  ${data.config.with_swagger ? '@ApiProperty()' : ''}
  ${data.config.full_validations ? '@IsNotEmpty()' : ''}
  password: string;
}`);

    zip.file(`${authPath}/dto/register.dto.ts`, `${data.config.full_validations ? "import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';" : ''}
${data.config.with_swagger ? "import { ApiProperty } from '@nestjs/swagger';" : ''}

export class RegisterDto {
  ${data.config.with_swagger ? '@ApiProperty()' : ''}
  ${data.config.full_validations ? '@IsNotEmpty()' : ''}
  name: string;

  ${data.config.with_swagger ? '@ApiProperty()' : ''}
  ${data.config.full_validations ? '@IsEmail()' : ''}
  ${data.config.full_validations ? '@IsNotEmpty()' : ''}
  email: string;

  ${data.config.with_swagger ? '@ApiProperty()' : ''}
  ${data.config.full_validations ? '@IsNotEmpty()' : ''}
  ${data.config.full_validations ? '@MinLength(6)' : ''}
  password: string;

  ${data.config.with_swagger ? '@ApiProperty({ required: false, default: "user" })' : ''}
  role?: string = 'user';
}`);
  }

  private async generateUtilityFiles(zip: JSZip, data: TemplateData): Promise<void> {
    // JWT Strategy
    zip.file('src/strategies/jwt.strategy.ts', `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}`);

    // Guards
    zip.file('src/guards/jwt-auth.guard.ts', `import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}`);

    zip.file('src/guards/roles.guard.ts', `import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user?.role?.includes(role));
  }
}`);

    // Decorators
    zip.file('src/decorators/roles.decorator.ts', `import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);`);

    // Constants
    zip.file('src/constants/roles.ts', `export enum UserRole {
  ${data.userRoles.map(role => `${role.toUpperCase()} = '${role}'`).join(',\n  ')}
}`);

    // Utilities
    zip.file('src/utils/date.util.ts', `export class DateUtil {
  static toUTC(date: Date): Date {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  }

  static fromUTC(date: Date): Date {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }

  static formatForDatabase(date: Date): string {
    return this.toUTC(date).toISOString();
  }
}`);

    // FTP utilities if enabled
    if (data.config.with_ftp) {
      zip.file('src/utils/ftp.util.ts', `import * as ftp from 'ftp';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FtpUtil {
  private client: ftp;

  constructor(private configService: ConfigService) {
    this.client = new ftp();
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.connect({
        host: this.configService.get<string>('FTP_HOST'),
        user: this.configService.get<string>('FTP_USER'),
        password: this.configService.get<string>('FTP_PASSWORD'),
        port: this.configService.get<number>('FTP_PORT', 21),
      });

      this.client.on('ready', () => resolve());
      this.client.on('error', (err) => reject(err));
    });
  }

  async uploadFile(localPath: string, remotePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.put(localPath, remotePath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async downloadFile(remotePath: string, localPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.get(remotePath, (err, stream) => {
        if (err) {
          reject(err);
          return;
        }
        
        const fs = require('fs');
        const writeStream = fs.createWriteStream(localPath);
        stream.pipe(writeStream);
        stream.on('end', () => resolve());
        stream.on('error', (err) => reject(err));
      });
    });
  }

  disconnect(): void {
    this.client.end();
  }
}`);
    }

    // Google Auth if enabled
    if (data.config.with_google_auth) {
      zip.file('src/strategies/google.strategy.ts', `import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}`);
    }
  }

  private async generateConfigFiles(zip: JSZip, data: TemplateData): Promise<void> {
    // Database configuration
    zip.file('src/configs/database.config.ts', `import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: '${data.databaseConfig.typeorm}' as any,
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
    logging: configService.get<boolean>('DB_LOGGING', false),
    ${data.databaseConfig.name === 'postgresql' ? `ssl: configService.get<boolean>('DB_SSL', false) ? { rejectUnauthorized: false } : false,` : ''}
    ${data.databaseConfig.name === 'mysql' ? `charset: 'utf8mb4',` : ''}
  }),
  inject: [ConfigService],
};`);

    // App configuration
    zip.file('src/configs/app.config.ts', `export const appConfig = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  environment: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  ${data.config.with_ftp ? `
  ftp: {
    host: process.env.FTP_HOST || 'localhost',
    port: parseInt(process.env.FTP_PORT, 10) || 21,
    user: process.env.FTP_USER || 'anonymous',
    password: process.env.FTP_PASSWORD || '',
  },` : ''}
  ${data.config.with_google_auth ? `
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },` : ''}
});`);
  }

  private generateEnvFile(data: TemplateData): string {
    return `# Application
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=${data.databaseConfig.port}
DB_USERNAME=${data.databaseConfig.name}_user
DB_PASSWORD=your_password_here
DB_DATABASE=${data.projectName.replace(/[^a-zA-Z0-9]/g, '_')}_db
DB_SYNCHRONIZE=true
DB_LOGGING=false
${data.databaseConfig.name === 'postgresql' ? 'DB_SSL=false' : ''}

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

${data.config.with_ftp ? `
# FTP Configuration
FTP_HOST=localhost
FTP_PORT=21
FTP_USER=ftpuser
FTP_PASSWORD=ftppassword
` : ''}

${data.config.with_google_auth ? `
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
` : ''}

# API Configuration
API_PREFIX=api/v1
CORS_ENABLED=true
THROTTLE_TTL=60
THROTTLE_LIMIT=10`;
  }

  private generateReadme(data: TemplateData): string {
    return `# ${data.projectName}

A NestJS backend application generated from SQL schema on ${data.timestamp}

## Features

- 🏗️ **Complete CRUD Operations** for all database tables
- 🔐 **JWT Authentication** with role-based access control
- 📊 **Database Integration** with TypeORM (${data.databaseConfig.label})
${data.config.full_validations ? '- ✅ **Full Field Validations** with class-validator' : ''}
${data.config.with_swagger ? '- 📚 **Swagger Documentation** available at /api/docs' : ''}
${data.config.with_ftp ? '- 📁 **FTP File Handling** utilities' : ''}
${data.config.with_google_auth ? '- 🔑 **Google OAuth 2.0** integration' : ''}
- 🕐 **UTC Timezone Handling** for consistent data storage
- 🛡️ **Security Best Practices** implemented

## Database Schema

This application was generated from a SQL schema containing ${data.tables.length} tables:

${data.tables.map(table => `- **${table.name}** (${table.columns.length} columns)`).join('\n')}

## User Roles

The following user roles are configured:
${data.userRoles.map(role => `- ${role}`).join('\n')}

## Installation

\`\`\`bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations (if using a real database)
npm run migration:run

# Start the application
npm run start:dev
\`\`\`

## API Endpoints

### Authentication
- \`POST /auth/register\` - Register a new user
- \`POST /auth/login\` - Login user
- \`GET /auth/profile\` - Get current user profile

### Generated Endpoints
${data.tables.map(table => `
#### ${table.name.charAt(0).toUpperCase() + table.name.slice(1)}
- \`GET /${table.name}\` - Get all ${table.name}s (paginated)
- \`GET /${table.name}/:id\` - Get ${table.name} by ID
- \`POST /${table.name}\` - Create new ${table.name}
- \`PATCH /${table.name}/:id\` - Update ${table.name}
- \`DELETE /${table.name}/:id\` - Delete ${table.name}`).join('\n')}

${data.config.with_swagger ? `
## API Documentation

Swagger documentation is available at: \`http://localhost:3000/api/docs\`
` : ''}

## Environment Variables

Make sure to configure the following environment variables in your \`.env\` file:

\`\`\`env
# Database
DB_HOST=localhost
DB_PORT=${data.databaseConfig.port}
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database

# JWT
JWT_SECRET=your-super-secret-key

${data.config.with_ftp ? `
# FTP (Optional)
FTP_HOST=your-ftp-host
FTP_USER=your-ftp-user
FTP_PASSWORD=your-ftp-password
` : ''}

${data.config.with_google_auth ? `
# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
` : ''}
\`\`\`

## Database Setup

### ${data.databaseConfig.label}

1. Create a new database
2. Update the connection details in \`.env\`
3. Run the application - tables will be created automatically

## Development

\`\`\`bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod

# Run tests
npm run test

# Format code
npm run format
\`\`\`

## File Structure

\`\`\`
src/
├── configs/          # Configuration files
├── decorators/       # Custom decorators
├── guards/          # Authentication guards
├── modules/         # Feature modules
│   ├── auth/        # Authentication module
${data.tables.map(table => `│   ├── ${table.name}/      # ${table.name.charAt(0).toUpperCase() + table.name.slice(1)} module`).join('\n')}
├── strategies/      # Passport strategies
└── utils/           # Utility functions
\`\`\`

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- Rate limiting ready

## Generated by NestJS Schema Generator

This project was automatically generated from your SQL schema. You can customize and extend it according to your needs.

For more information about NestJS, visit: https://nestjs.com/
`;
  }
}

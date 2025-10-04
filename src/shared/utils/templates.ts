
import { TemplateData, TableSchema, TableColumn } from './types';
import { DATABASE_CONFIGS } from './constants';

export class TemplateGenerator {
  generatePackageJson(data: TemplateData): string {
    return `{
  "name": "${data.projectName}",
  "version": "0.0.1",
  "description": "Generated NestJS application from SQL schema",
  "author": "NestJS Schema Generator",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \\"src/**/*.ts\\" \\"test/**/*.ts\\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \\"{src,apps,libs,test}/**/*.ts\\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/mapped-types": "^2.1.0",
    "@nestjs/config": "^3.0.0",
    "typeorm": "^0.3.17",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "passport": "^0.6.0",
    "passport-local": "^1.0.0",
    "moment": "^2.29.4",
    "reflect-metadata": "^0.1.13",
    ${data.config.with_jwt_auth ? '"@nestjs/jwt": "^10.1.0",' : ''}
    ${data.config.with_jwt_auth ? '"@nestjs/passport": "^10.0.0",' : ''}
    ${data.config.with_jwt_auth ? '"passport-jwt": "^4.0.1",' : ''}
    ${data.config.with_swagger ? '"@nestjs/swagger": "^7.1.0",' : ''}
    "${data.databaseConfig.driver}": "${this.getDatabaseVersion(data.databaseConfig.typeorm)}",
    ${data.config.with_google_auth ? '"passport-google-oauth20": "^2.0.0",' : ''}
    ${data.config.with_ftp ? '"ftp": "^0.3.10",' : ''}
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.3.1",
    "@types/passport-jwt": "^3.0.9",
    "@types/passport-local": "^1.0.35",
    "@types/bcryptjs": "^2.4.2",
    ${data.config.with_google_auth ? '"@types/passport-google-oauth20": "^2.0.11",' : ''}
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.42.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.5.0",
    "prettier": "^3.0.0",
    "source-map-support": "^0.5.21",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.1.3"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\\\.spec\\\\.ts$",
    "transform": {
      "^.+\\\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}`;
  }

  generateMainTs(data: TemplateData): string {
    return `import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
${data.config.with_swagger ? "import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';" : ''}
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  ${data.config.with_swagger ? `
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('${data.projectName} API')
    .setDescription('Generated API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  ` : ''}
  let port = Number(process.env.PORT) || 3000;
  async function startServer() {
    while (true) {
      try {
        await app.listen(port);
        console.log(\`🚀 Server running on http://localhost:\${port}\`);
        ${data.config.with_swagger ? `console.log(\`Swagger docs available at: http://localhost:\${port}/api/docs\`);` : ''}
        break; // success, exit loop
      } catch (err) {
        if (err.code === 'EADDRINUSE') {
          console.warn(\`⚠️ Port \${port} in use, trying \${port + 1}...\`);
          port++;
        } else {
          console.error('Unexpected error:', err);
          process.exit(1);
        }
      }
    }
  }

  startServer();
}
bootstrap();`;
  }

  generateAppModule(data: TemplateData): string {
    return `import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
${data.config.with_jwt_auth ? `import { AuthModule } from './modules/auth/auth.module';` : ''}
${data.tables.map(table => `import { ${this.capitalize(table.name)}Module } from './modules/${table.name}/${table.name}.module';`).join('\n')}
import { databaseConfig } from './configs/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    ${data.config.with_jwt_auth ? 'AuthModule,' : ''}
    ${data.tables.map(table => `${this.capitalize(table.name)}Module`).join(',\n    ')}
  ],
})
export class AppModule {}`;
  }

  generateEntity(table: TableSchema, data: TemplateData): string {
    return `import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
${data.config.full_validations ? "import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsDate } from 'class-validator';" : ''}
${data.config.with_swagger ? "import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';" : ''}
${table.foreignKeys.map(fk => `import { ${this.capitalize(fk.referencesTable)} } from 'src/entities/${fk.referencesTable}.entity';`).join('\n')}

@Entity('${table.name}')
export class ${this.capitalize(table.name)} {
${table.columns.map(col => this.generateEntityColumn(col, data)).join('\n\n')}

${table.foreignKeys.map(fk => this.generateRelationshipProperty(fk, data)).join('\n\n')}

${data.config.date_fields ? `
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  ${data.config.with_swagger ? '@ApiProperty()' : ''}
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  ${data.config.with_swagger ? '@ApiProperty()' : ''}
  updatedAt: Date;
` : ''}
}`;
  }

  generateEntityColumn(column: TableColumn, data: TemplateData): string {
    const decorators = [];

    // TypeORM decorators
    if (column.primary) {
      if (column.autoIncrement) {
        decorators.push("@PrimaryGeneratedColumn()");
      } else {
        decorators.push("@Column({ primary: true })");
      }
    } else {
      const columnOptions = [];
      if (column.length) columnOptions.push(`length: ${column.length}`);
      if (!column.nullable) columnOptions.push('nullable: false'); else columnOptions.push('nullable: true');
      if (column.unique) columnOptions.push('unique: true');
      if ((column.defaultValue ?? "").toLowerCase().includes("time")) columnOptions.push("type: 'timestamp'");
      if (column.defaultValue) columnOptions.push(`default: ${column.defaultValue.toLowerCase().includes("time") ? '() => ' : ''}'${column.defaultValue}'`);
      //! Change this and make it dynamic
      if (column.type === "object" && (data.databaseConfig.driver.includes("postgre") || data.databaseConfig.driver === "pg")) columnOptions.push(`type: 'jsonb'`);

      const optionsStr = columnOptions.length > 0 ? `{ ${columnOptions.join(', ')} }` : '';
      decorators.push(`@Column(${optionsStr})`);
    }

    // Validation decorators
    if (data.config.full_validations) {
      if (!column.nullable) {
        decorators.push('@IsNotEmpty()');
      } else {
        decorators.push('@IsOptional()');
      }

      if (column.name.toLowerCase().includes('email')) {
        decorators.push('@IsEmail()');
      }

      switch (column.type) {
        case 'string':
          decorators.push('@IsString()');
          break;
        case 'number':
          decorators.push('@IsNumber()');
          break;
        case 'boolean':
          decorators.push('@IsBoolean()');
          break;
        case 'Date':
          decorators.push('@IsDate()');
          break;
      }
    }

    // Swagger decorators
    if (data.config.with_swagger) {
      const swaggerDecorator = column.nullable ? '@ApiPropertyOptional()' : '@ApiProperty()';
      decorators.push(swaggerDecorator);
    }

    const typeAnnotation = column.type === 'Date' ? 'Date' : column.type;

    return `  ${decorators.join('\n  ')}
  ${column.name}: ${typeAnnotation};`;
  }

  generateRelationshipProperty(fk: any, data: TemplateData): string {
    const decorators = [];
    decorators.push(`@ManyToOne(() => ${this.capitalize(fk.referencesTable)})`);
    decorators.push(`@JoinColumn({ name: '${fk.column}' })`);

    if (data.config.with_swagger) {
      decorators.push('@ApiPropertyOptional()');
    }

    return `  ${decorators.join('\n  ')}
  ${fk.referencesTable}: ${this.capitalize(fk.referencesTable)};`;
  }

  generateController(table: TableSchema, data: TemplateData): string {
    const entityName = this.capitalize(table.name);

    return `import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
${data.config.with_swagger ? `import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';` : ''}
${data.config.with_jwt_auth ? `import { JwtAuthGuard } from '../../guards/jwt-auth.guard';` : ''}
${data.config.with_jwt_auth ? `import { RolesGuard } from '../../guards/roles.guard';` : ''}
${data.config.with_jwt_auth ? `import { Roles } from '../../decorators/roles.decorator';` : ''}
import { ${entityName}Service } from './${table.name}.service';
import { Create${entityName}Dto } from './dto/create-${table.name}.dto';
import { Update${entityName}Dto } from './dto/update-${table.name}.dto';
import { ${entityName} } from 'src/entities/${table.name}.entity';

${data.config.with_swagger ? `@ApiTags('${table.name}')` : ''}
${data.config.with_swagger ? '@ApiBearerAuth()' : ''}
@Controller('${table.name}')
${data.config.with_jwt_auth ? `@UseGuards(JwtAuthGuard, RolesGuard)` : ''}
export class ${entityName}Controller {
  constructor(private readonly ${table.name}Service: ${entityName}Service) {}

  ${data.config.with_swagger ? `@ApiOperation({ summary: 'Create a new ${table.name}' })` : ''}
  ${data.config.with_swagger ? `@ApiResponse({ status: 201, description: 'Created successfully', type: ${entityName} })` : ''}
  @Post()
  ${data.config.with_jwt_auth ? `@Roles('admin', 'user')` : ''}
  async create(@Body() create${entityName}Dto: Create${entityName}Dto): Promise<${entityName}> {
    try {
      return await this.${table.name}Service.create(create${entityName}Dto);
    } catch (error) {
      throw new HttpException(
        \`Failed to create ${table.name}: \${error.message}\`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  ${data.config.with_swagger ? `@ApiOperation({ summary: 'Get all ${table.name}s' })` : ''}
  ${data.config.with_swagger ? `@ApiResponse({ status: 200, description: 'Retrieved successfully', type: [${entityName}] })` : ''}
  @Get()
  ${data.config.with_jwt_auth ? `@Roles('admin', 'user')` : ''}
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: ${entityName}[]; total: number; page: number; totalPages: number }> {
    try {
      return await this.${table.name}Service.findAll(page, limit);
    } catch (error) {
      throw new HttpException(
        \`Failed to retrieve ${table.name}s: \${error.message}\`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  ${data.config.with_swagger ? `@ApiOperation({ summary: 'Get ${table.name} by ID' })` : ''}
  ${data.config.with_swagger ? `@ApiResponse({ status: 200, description: 'Retrieved successfully', type: ${entityName} })` : ''}
  @Get(':id')
  ${data.config.with_jwt_auth ? `@Roles('admin', 'user')` : ''}
  async findOne(@Param('id') id: string): Promise<${entityName}> {
    try {
      const result = await this.${table.name}Service.findOne(+id);
      if (!result) {
        throw new HttpException(\`${entityName} with ID \${id} not found\`, HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        \`Failed to retrieve ${table.name}: \${error.message}\`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  ${data.config.with_swagger ? `@ApiOperation({ summary: 'Update ${table.name}' })` : ''}
  ${data.config.with_swagger ? `@ApiResponse({ status: 200, description: 'Updated successfully', type: ${entityName} })` : ''}
  @Patch(':id')
  ${data.config.with_jwt_auth ? `@Roles('admin')` : ''}
  async update(
    @Param('id') id: string,
    @Body() update${entityName}Dto: Update${entityName}Dto,
  ): Promise<${entityName}> {
    try {
      return await this.${table.name}Service.update(+id, update${entityName}Dto);
    } catch (error) {
      throw new HttpException(
        \`Failed to update ${table.name}: \${error.message}\`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  ${data.config.with_swagger ? `@ApiOperation({ summary: 'Delete ${table.name}' })` : ''}
  ${data.config.with_swagger ? `@ApiResponse({ status: 200, description: 'Deleted successfully' })` : ''}
  @Delete(':id')
  ${data.config.with_jwt_auth ? `@Roles('admin')` : ''}
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.${table.name}Service.remove(+id);
      return { message: \`${entityName} with ID \${id} deleted successfully\` };
    } catch (error) {
      throw new HttpException(
        \`Failed to delete ${table.name}: \${error.message}\`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}`;
  }

  generateService(table: TableSchema, data: TemplateData): string {
    const entityName = this.capitalize(table.name);

    return `import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${entityName} } from 'src/entities/${table.name}.entity';
import { Create${entityName}Dto } from './dto/create-${table.name}.dto';
import { Update${entityName}Dto } from './dto/update-${table.name}.dto';

@Injectable()
export class ${entityName}Service {
  constructor(
    @InjectRepository(${entityName})
    private readonly ${table.name}Repository: Repository<${entityName}>,
  ) {}

  async create(create${entityName}Dto: Create${entityName}Dto): Promise<${entityName}> {
    const ${table.name} = this.${table.name}Repository.create(create${entityName}Dto);
    return await this.${table.name}Repository.save(${table.name});
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: ${entityName}[]; total: number; page: number; totalPages: number }> {
    const [data, total] = await this.${table.name}Repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      ${data.config.date_fields ? "order: { createdAt: 'DESC' }," : ''}
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id): Promise<${entityName}> {
    const ${table.name} = await this.${table.name}Repository.findOne({
      where: { id },
      relations: [${table.foreignKeys.map(fk => `'${fk.referencesTable}'`).join(', ')}],
    });

    if (!${table.name}) {
      throw new NotFoundException(\`${entityName} with ID \${id} not found\`);
    }

    return ${table.name};
  }

  async update(id, update${entityName}Dto: Update${entityName}Dto): Promise<${entityName}> {
    const ${table.name} = await this.findOne(id);
    Object.assign(${table.name}, update${entityName}Dto);
    return await this.${table.name}Repository.save(${table.name});
  }

  async remove(id): Promise<void> {
    const ${table.name} = await this.findOne(id);
    await this.${table.name}Repository.remove(${table.name});
  }

  async findBy(criteria: Partial<${entityName}>): Promise<${entityName}[]> {
    return await this.${table.name}Repository.find({
      where: criteria,
      relations: [${table.foreignKeys.map(fk => `'${fk.referencesTable}'`).join(', ')}],
    });
  }
}`;
  }

  generateCreateDto(table: TableSchema, data: TemplateData): string {
    const entityName = this.capitalize(table.name);
    const editableColumns = table.columns.filter(col => !col.primary && !col.autoIncrement);

    return `${data.config.full_validations ? "import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsDate } from 'class-validator';" : ''}
${data.config.with_swagger ? "import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';" : ''}

export class Create${entityName}Dto {
${editableColumns.map(col => this.generateDtoProperty(col, data, false)).join('\n\n')}
}`;
  }

  generateUpdateDto(table: TableSchema, data: TemplateData): string {
    const entityName = this.capitalize(table.name);

    return `import { PartialType } from '${data.config.with_swagger ? '@nestjs/swagger' : '@nestjs/mapped-types'}';
import { Create${entityName}Dto } from './create-${table.name}.dto';

export class Update${entityName}Dto extends PartialType(Create${entityName}Dto) {}`;
  }

  generateDtoProperty(column: TableColumn, data: TemplateData, isUpdate: boolean): string {
    const decorators = [];

    // Validation decorators
    if (data.config.full_validations) {
      if (!column.nullable && !isUpdate) {
        decorators.push('@IsNotEmpty()');
      } else {
        decorators.push('@IsOptional()');
      }

      if (column.name.toLowerCase().includes('email')) {
        decorators.push('@IsEmail()');
      }

      switch (column.type) {
        case 'string':
          decorators.push('@IsString()');
          break;
        case 'number':
          decorators.push('@IsNumber()');
          break;
        case 'boolean':
          decorators.push('@IsBoolean()');
          break;
        case 'Date':
          decorators.push('@IsDate()');
          break;
      }
    }

    // Swagger decorators
    if (data.config.with_swagger) {
      const swaggerDecorator = (column.nullable || isUpdate) ? '@ApiPropertyOptional()' : '@ApiProperty()';
      decorators.push(swaggerDecorator);
    }

    const typeAnnotation = column.type === 'Date' ? 'Date' : column.type;
    const optional = column.nullable || isUpdate ? '?' : '';

    return `  ${decorators.join('\n  ')}
  ${column.name}${optional}: ${typeAnnotation};`;
  }

  generateModule(table: TableSchema, data: TemplateData): string {
    const entityName = this.capitalize(table.name);

    return `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${entityName}Service } from './${table.name}.service';
import { ${entityName}Controller } from './${table.name}.controller';
import { ${entityName} } from 'src/entities/${table.name}.entity';

@Module({
  imports: [TypeOrmModule.forFeature([${entityName}])],
  controllers: [${entityName}Controller],
  providers: [${entityName}Service],
  exports: [${entityName}Service],
})
export class ${entityName}Module {}`;
  }

  private getDatabaseVersion(dbName: string): string {
    const versions = {
      postgres: '^8.11.3',
      mysql: '^3.6.0',
      mssql: '^9.1.1',
      oracle: '^1.4.2',
      mongodb: '^5.7.0'
    };
    console.log(`Database name: ${dbName}`);
    console.log(`Using database version for ${dbName}: ${versions[dbName as keyof typeof versions]}`);
    return versions[dbName as keyof typeof versions] || '^1.0.0';
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

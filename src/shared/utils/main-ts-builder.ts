export class MainTsBuilder {
  private imports: string[] = [];
  private setupCode: string[] = [];
  private swaggerConfig: {
    title: string;
    description: string;
    version: string;
    path: string;
  } | null = null;
  private port: number = 3000;

  constructor() {
    // Ajout des imports de base
    this.addImport("NestFactory", "@nestjs/core");
    this.addImport("ValidationPipe", "@nestjs/common");
    this.addImport("AppModule", "./app.module");
  }

  addImport(item: string, from: string): this {
    this.imports.push(`import { ${item} } from '${from}';`);
    return this;
  }

  addSetupCode(code: string): this {
    this.setupCode.push(code);
    return this;
  }

  enableSwagger(config: {
    title: string;
    description?: string;
    version?: string;
    path?: string;
  }): this {
    this.addImport("SwaggerModule, DocumentBuilder", "@nestjs/swagger");
    this.swaggerConfig = {
      title: config.title,
      description: config.description || "Generated API documentation",
      version: config.version || "1.0",
      path: config.path || "api/docs",
    };
    return this;
  }

  setPort(port: number): this {
    this.port = port;
    return this;
  }

  private generateSwaggerSetup(): string {
    if (!this.swaggerConfig) return "";

    return `
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('${this.swaggerConfig.title}')
    .setDescription('${this.swaggerConfig.description}')
    .setVersion('${this.swaggerConfig.version}')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('${this.swaggerConfig.path}', app, document);`;
  }

  private generateServerStartup(): string {
    return `
  let port = Number(process.env.PORT) || ${this.port};
  async function startServer() {
    while (true) {
      try {
        await app.listen(port);
        console.log(\`🚀 Server running on http://localhost:\${port}\`);
        ${this.swaggerConfig ? `console.log(\`Swagger docs available at: http://localhost:\${port}/${this.swaggerConfig.path}\`);` : ""}
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

  startServer();`;
  }

  build(): string {
    const setupCodeStr = this.setupCode.join("\n  ");
    const swaggerSetup = this.generateSwaggerSetup();
    const serverStartup = this.generateServerStartup();

    return `${this.imports.join("\n")}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  ${setupCodeStr}${swaggerSetup}
  ${serverStartup}
}
bootstrap();`;
  }

  reset(): this {
    this.imports = [];
    this.setupCode = [];
    this.swaggerConfig = null;
    this.port = 3000;
    return this;
  }
}
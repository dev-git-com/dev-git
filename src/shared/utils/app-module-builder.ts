export class AppModuleBuilder {
  private imports: string[] = [];
  private importStatements: string[] = [];
  private features: {
    isGlobal?: boolean;
    envFilePath?: string;
    databaseConfig?: boolean;
    authModule?: boolean;
  } = {};
  private moduleImports: string[] = [];

  constructor() {
    this.addImport("Module", "@nestjs/common");
    this.addImport("ConfigModule", "@nestjs/config");
    this.addImport("TypeOrmModule", "@nestjs/typeorm");
  }

  addImport(item: string, from: string): this {
    const importStatement = `import { ${item} } from '${from}';`;
    if (!this.importStatements.includes(importStatement)) {
      this.importStatements.push(importStatement);
      this.imports.push(item);
    }
    return this;
  }

  addFeatureModuleImport(moduleName: string, path: string): this {
    this.addImport(`${moduleName}Module`, path);
    this.moduleImports.push(`${moduleName}Module`);
    return this;
  }

  enableGlobalConfig(envFilePath: string = ".env"): this {
    this.features.isGlobal = true;
    this.features.envFilePath = envFilePath;
    return this;
  }

  enableDatabaseConfig(): this {
    this.features.databaseConfig = true;
    this.addImport("databaseConfig", "./configs/database.config");
    return this;
  }

  enableAuthModule(): this {
    this.features.authModule = true;
    this.addImport("AuthModule", "./modules/auth/auth.module");
    return this;
  }

  private generateConfigModule(): string {
    if (!this.features.isGlobal) return "";

    return `
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '${this.features.envFilePath}',
    })`;
  }

  private generateDatabaseModule(): string {
    if (!this.features.databaseConfig) return "";

    return `
    TypeOrmModule.forRootAsync(databaseConfig)`;
  }

  build(): string {
    const configModule = this.generateConfigModule();
    const databaseModule = this.generateDatabaseModule();

    // Build the list of module imports
    const moduleImportsArray = [
      configModule,
      databaseModule,
      this.features.authModule ? "    AuthModule," : "",
      ...this.moduleImports.map((module) => `    ${module}`),
    ].filter(Boolean);

    return `${this.importStatements.join("\n")}

@Module({
  imports: [${moduleImportsArray.join(",\n")}
  ],
})
export class AppModule {}`;
  }

  reset(): this {
    this.imports = [];
    this.importStatements = [];
    this.features = {};
    this.moduleImports = [];
    return this;
  }
}

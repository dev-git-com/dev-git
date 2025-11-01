import { TableSchema } from "./types";

export class ServiceBuilder {
  private entityName: string = "";
  private tableName: string = "";
  private foreignKeys: any[] = [];
  private withDateFields: boolean = false;

  setBasicInfo(tableName: string, entityName: string): this {
    this.tableName = tableName;
    this.entityName = entityName;
    return this;
  }

  setForeignKeys(foreignKeys: any[]): this {
    this.foreignKeys = foreignKeys;
    return this;
  }

  enableDateFields(enable: boolean = true): this {
    this.withDateFields = enable;
    return this;
  }

  private generateImports(): string {
    return `import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${this.entityName} } from 'src/entities/${this.tableName}.entity';
import { Create${this.entityName}Dto } from './dto/create-${this.tableName}.dto';
import { Update${this.entityName}Dto } from './dto/update-${this.tableName}.dto';`;
  }

  private generateConstructor(): string {
    return `  constructor(
    @InjectRepository(${this.entityName})
    private readonly ${this.tableName}Repository: Repository<${this.entityName}>,
  ) {}`;
  }

  private generateCreateMethod(): string {
    return `  async create(create${this.entityName}Dto: Create${this.entityName}Dto): Promise<${this.entityName}> {
    const ${this.tableName} = this.${this.tableName}Repository.create(create${this.entityName}Dto);
    return await this.${this.tableName}Repository.save(${this.tableName});
  }`;
  }

  private generateFindAllMethod(): string {
    const orderClause = this.withDateFields
      ? "order: { createdAt: 'DESC' },"
      : "";
    return `  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: ${this.entityName}[]; total: number; page: number; totalPages: number }> {
    const [data, total] = await this.${this.tableName}Repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      ${orderClause}
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }`;
  }

  private generateFindOneMethod(): string {
    const relations =
      this.foreignKeys.length > 0
        ? `relations: [${this.foreignKeys
            .map((fk) => `'${fk.referencesTable}'`)
            .join(", ")}],`
        : "";

    return `  async findOne(id): Promise<${this.entityName}> {
    const ${this.tableName} = await this.${this.tableName}Repository.findOne({
      where: { id },
      ${relations}
    });

    if (!${this.tableName}) {
      throw new NotFoundException(\`${this.entityName} with ID \${id} not found\`);
    }

    return ${this.tableName};
  }`;
  }

  private generateUpdateMethod(): string {
    return `  async update(id, update${this.entityName}Dto: Update${this.entityName}Dto): Promise<${this.entityName}> {
    const ${this.tableName} = await this.findOne(id);
    Object.assign(${this.tableName}, update${this.entityName}Dto);
    return await this.${this.tableName}Repository.save(${this.tableName});
  }`;
  }

  private generateRemoveMethod(): string {
    return `  async remove(id): Promise<void> {
    const ${this.tableName} = await this.findOne(id);
    await this.${this.tableName}Repository.remove(${this.tableName});
  }`;
  }

  private generateFindByMethod(): string {
    const relations =
      this.foreignKeys.length > 0
        ? `relations: [${this.foreignKeys
            .map((fk) => `'${fk.referencesTable}'`)
            .join(", ")}],`
        : "";

    return `  async findBy(criteria: Partial<${this.entityName}>): Promise<${this.entityName}[]> {
    return await this.${this.tableName}Repository.find({
      where: criteria,
      ${relations}
    });
  }`;
  }

  build(): string {
    const parts: string[] = [];

    // Imports
    parts.push(this.generateImports());
    parts.push("");

    // Service class
    parts.push("@Injectable()");
    parts.push(`export class ${this.entityName}Service {`);

    // Constructor
    parts.push(this.generateConstructor());
    parts.push("");

    // Methods
    parts.push(this.generateCreateMethod());
    parts.push("");
    parts.push(this.generateFindAllMethod());
    parts.push("");
    parts.push(this.generateFindOneMethod());
    parts.push("");
    parts.push(this.generateUpdateMethod());
    parts.push("");
    parts.push(this.generateRemoveMethod());
    parts.push("");
    parts.push(this.generateFindByMethod());

    // Close class
    parts.push("}");

    return parts.join("\n");
  }
}

import { TableSchema, TableColumn, TemplateData } from "./types";
import { EntityColumnBuilder } from "./entity-column-builder";
import { RelationshipPropertyBuilder } from "./relationship-property-builder";

export class EntityBuilder {
  private entityImports: Set<string>;
  private validationImports: Set<string>;
  private swaggerImports: Set<string>;
  private entityName: string = "";
  private tableName: string = "";
  private columns: TableColumn[];
  private foreignKeys: any[];
  private withValidations: boolean;
  private withSwagger: boolean;
  private withDateFields: boolean;

  constructor() {
    this.entityImports = new Set([
      "Entity",
      "Column",
      "PrimaryGeneratedColumn",
    ]);
    this.validationImports = new Set();
    this.swaggerImports = new Set();
    this.columns = [];
    this.foreignKeys = [];
    this.withValidations = false;
    this.withSwagger = false;
    this.withDateFields = false;
  }

  // Basic entity configuration
  setBasicInfo(tableName: string, entityName: string): EntityBuilder {
    this.tableName = tableName;
    this.entityName = entityName;
    return this;
  }

  // Enable validations
  enableValidations(): EntityBuilder {
    this.withValidations = true;
    return this;
  }

  // Enable Swagger
  enableSwagger(): EntityBuilder {
    this.withSwagger = true;
    return this;
  }

  // Enable date fields
  enableDateFields(): EntityBuilder {
    this.withDateFields = true;
    if (this.withDateFields) {
      this.entityImports.add("CreateDateColumn");
      this.entityImports.add("UpdateDateColumn");
    }
    return this;
  }

  // Add a column
  addColumn(column: TableColumn): EntityBuilder {
    this.columns.push(column);
    if (column.primary && column.autoIncrement) {
      this.entityImports.add("PrimaryGeneratedColumn");
    }

    if (this.withValidations) {
      if (!column.nullable) {
        this.validationImports.add("IsNotEmpty");
      } else {
        this.validationImports.add("IsOptional");
      }

      if (column.name.toLowerCase().includes("email")) {
        this.validationImports.add("IsEmail");
      }

      switch (column.type) {
        case "string":
          this.validationImports.add("IsString");
          break;
        case "number":
          this.validationImports.add("IsNumber");
          break;
        case "boolean":
          this.validationImports.add("IsBoolean");
          break;
        case "Date":
          this.validationImports.add("IsDate");
          break;
      }
    }

    return this;
  }

  // Add a foreign key
  addForeignKey(foreignKey: any): EntityBuilder {
    this.foreignKeys.push(foreignKey);
    this.entityImports.add("ManyToOne");
    this.entityImports.add("JoinColumn");
    return this;
  }

  private generateImports(): string {
    const imports: string[] = [];

    // Import TypeORM
    imports.push(
      `import { ${Array.from(this.entityImports).join(", ")} } from 'typeorm';`
    );

    // Import validations
    if (this.withValidations && this.validationImports.size > 0) {
      imports.push(
        `import { ${Array.from(this.validationImports).join(
          ", "
        )} } from 'class-validator';`
      );
    }

    // Import Swagger
    if (this.withSwagger) {
      imports.push(
        `import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';`
      );
    }

    // Import referenced entities
    this.foreignKeys.forEach((fk) => {
      const referencedEntity = this.capitalize(fk.referencesTable);
      imports.push(
        `import { ${referencedEntity} } from 'src/entities/${fk.referencesTable}.entity';`
      );
    });

    return imports.join("\n");
  }

  private generateEntityColumn(column: TableColumn): string {
    const decorators: string[] = [];

    // TypeORM decorators
    if (column.primary) {
      if (column.autoIncrement) {
        decorators.push("@PrimaryGeneratedColumn()");
      } else {
        decorators.push("@Column({ primary: true })");
      }
    } else {
      const columnOptions: string[] = [];
      if (column.length) columnOptions.push(`length: ${column.length}`);
      if (!column.nullable) columnOptions.push("nullable: false");
      else columnOptions.push("nullable: true");
      if (column.unique) columnOptions.push("unique: true");
      if (column.defaultValue?.toLowerCase().includes("time"))
        columnOptions.push("type: 'timestamp'");
      if (column.defaultValue)
        columnOptions.push(
          `default: ${
            column.defaultValue.toLowerCase().includes("time") ? "() => " : ""
          }'${column.defaultValue}'`
        );

      const optionsStr =
        columnOptions.length > 0 ? `{ ${columnOptions.join(", ")} }` : "";
      decorators.push(`@Column(${optionsStr})`);
    }

    // Validation decorators
    if (this.withValidations) {
      if (!column.nullable) {
        decorators.push("@IsNotEmpty()");
      } else {
        decorators.push("@IsOptional()");
      }

      if (column.name.toLowerCase().includes("email")) {
        decorators.push("@IsEmail()");
      }

      switch (column.type) {
        case "string":
          decorators.push("@IsString()");
          break;
        case "number":
          decorators.push("@IsNumber()");
          break;
        case "boolean":
          decorators.push("@IsBoolean()");
          break;
        case "Date":
          decorators.push("@IsDate()");
          break;
      }
    }

    // Swagger decorators
    if (this.withSwagger) {
      decorators.push(
        column.nullable ? "@ApiPropertyOptional()" : "@ApiProperty()"
      );
    }

    const typeAnnotation = column.type === "Date" ? "Date" : column.type;
    return `  ${decorators.join("\n  ")}\n  ${column.name}: ${typeAnnotation};`;
  }

  private generateRelationshipProperty(fk: any): string {
    const decorators: string[] = [];
    decorators.push(`@ManyToOne(() => ${this.capitalize(fk.referencesTable)})`);
    decorators.push(`@JoinColumn({ name: '${fk.column}' })`);

    if (this.withSwagger) {
      decorators.push("@ApiPropertyOptional()");
    }

    return `  ${decorators.join("\n  ")}\n  ${
      fk.referencesTable
    }: ${this.capitalize(fk.referencesTable)};`;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  build(): string {
    const entityParts: string[] = [];

    // Imports
    entityParts.push(this.generateImports());
    entityParts.push("");

    // Entity decorator and class declaration
    entityParts.push(`@Entity('${this.tableName}')`);
    entityParts.push(`export class ${this.entityName} {`);

    // Columns
    entityParts.push(
      this.columns.map((col) => this.generateEntityColumn(col)).join("\n\n")
    );

    // Relations
    if (this.foreignKeys.length > 0) {
      entityParts.push("");
      entityParts.push(
        this.foreignKeys
          .map((fk) => this.generateRelationshipProperty(fk))
          .join("\n\n")
      );
    }

    // Date fields
    if (this.withDateFields) {
      entityParts.push("");
      entityParts.push(
        `  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })`
      );
      if (this.withSwagger) entityParts.push("  @ApiProperty()");
      entityParts.push("  createdAt: Date;");
      entityParts.push("");
      entityParts.push(
        `  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })`
      );
      if (this.withSwagger) entityParts.push("  @ApiProperty()");
      entityParts.push("  updatedAt: Date;");
    }

    // Close class
    entityParts.push("}");

    return entityParts.join("\n");
  }
}

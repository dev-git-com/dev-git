import { TableColumn } from "./types";

export class DtoBuilder {
  private entityName: string = "";
  private tableName: string = "";
  private columns: TableColumn[] = [];
  private withValidations: boolean = false;
  private withSwagger: boolean = false;
  private isUpdateDto: boolean = false;

  setBasicInfo(tableName: string, entityName: string): this {
    this.tableName = tableName;
    this.entityName = entityName;
    return this;
  }

  setColumns(columns: TableColumn[]): this {
    this.columns = columns;
    return this;
  }

  enableValidations(enable: boolean = true): this {
    this.withValidations = enable;
    return this;
  }

  enableSwagger(enable: boolean = true): this {
    this.withSwagger = enable;
    return this;
  }

  setAsUpdateDto(isUpdate: boolean = true): this {
    this.isUpdateDto = isUpdate;
    return this;
  }

  private generateImports(): string {
    const imports: string[] = [];

    // Validation imports
    if (this.withValidations) {
      imports.push(
        "import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsDate } from 'class-validator';"
      );
    }

    // Swagger imports
    if (this.withSwagger) {
      imports.push(
        "import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';"
      );
    }

    return imports.join("\n");
  }

  private generateUpdateDtoImports(): string {
    const imports: string[] = [];

    const partialTypeImport = `import { PartialType } from '${
      this.withSwagger ? "@nestjs/swagger" : "@nestjs/mapped-types"
    }';`;
    imports.push(partialTypeImport);
    imports.push(
      `import { Create${this.entityName}Dto } from './create-${this.tableName}.dto';`
    );

    return imports.join("\n");
  }

  private generateDtoProperty(column: TableColumn): string {
    const decorators: string[] = [];

    // Validation decorators
    if (this.withValidations) {
      if (!column.nullable && !this.isUpdateDto) {
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
      const swaggerDecorator =
        column.nullable || this.isUpdateDto
          ? "@ApiPropertyOptional()"
          : "@ApiProperty()";
      decorators.push(swaggerDecorator);
    }

    const typeAnnotation =
      column.type === "Date"
        ? "Date"
        : column.type === "object"
        ? "Record<string, any>"
        : column.type;
    const optional = column.nullable || this.isUpdateDto ? "?" : "";

    return `  ${decorators.join("\n  ")}
  ${column.name}${optional}: ${typeAnnotation};`;
  }

  buildCreateDto(): string {
    const parts: string[] = [];

    // Imports
    const imports = this.generateImports();
    if (imports) {
      parts.push(imports);
      parts.push("");
    }

    // Class declaration
    parts.push(`export class Create${this.entityName}Dto {`);

    // Properties
    const properties = this.columns
      .map((col) => this.generateDtoProperty(col))
      .join("\n\n");
    parts.push(properties);

    // Close class
    parts.push("}");

    return parts.join("\n");
  }

  buildUpdateDto(): string {
    const parts: string[] = [];

    // Imports
    parts.push(this.generateUpdateDtoImports());
    parts.push("");

    // Class declaration
    parts.push(
      `export class Update${this.entityName}Dto extends PartialType(Create${this.entityName}Dto) {}`
    );

    return parts.join("\n");
  }
}

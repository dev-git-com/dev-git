import { TableColumn } from "./types";

export class EntityColumnBuilder {
  private decorators: string[] = [];
  private column!: TableColumn;
  private withValidations: boolean = false;
  private withSwagger: boolean = false;
  private databaseType: string = "";

  constructor() {}

  setColumn(column: TableColumn): EntityColumnBuilder {
    this.column = column;
    return this;
  }

  enableValidations(): EntityColumnBuilder {
    this.withValidations = true;
    return this;
  }

  enableSwagger(): EntityColumnBuilder {
    this.withSwagger = true;
    return this;
  }

  setDatabaseType(dbType: string): EntityColumnBuilder {
    this.databaseType = dbType;
    return this;
  }

  private buildTypeOrmDecorator(): void {
    if (this.column.primary) {
      if (this.column.autoIncrement) {
        this.decorators.push("@PrimaryGeneratedColumn()");
      } else {
        this.decorators.push("@Column({ primary: true })");
      }
    } else {
      const columnOptions: string[] = [];

      if (this.column.length)
        columnOptions.push(`length: ${this.column.length}`);
      if (!this.column.nullable) columnOptions.push("nullable: false");
      else columnOptions.push("nullable: true");
      if (this.column.unique) columnOptions.push("unique: true");

      if ((this.column.defaultValue ?? "").toLowerCase().includes("time")) {
        columnOptions.push("type: 'timestamp'");
      }

      if (this.column.defaultValue) {
        columnOptions.push(
          `default: ${
            this.column.defaultValue.toLowerCase().includes("time")
              ? "() => "
              : ""
          }'${this.column.defaultValue}'`
        );
      }

      // Special handling for PostgreSQL JSON columns
      if (this.column.type === "object") {
        if (
          this.databaseType.includes("postgre") ||
          this.databaseType === "pg"
        ) {
          columnOptions.push(`type: 'jsonb'`);
        } else {
          columnOptions.push(`type: 'json'`);
        }
      }

      const optionsStr =
        columnOptions.length > 0 ? `{ ${columnOptions.join(", ")} }` : "";
      this.decorators.push(`@Column(${optionsStr})`);
    }
  }

  private buildValidationDecorators(): void {
    if (!this.withValidations) return;

    if (!this.column.nullable) {
      this.decorators.push("@IsNotEmpty()");
    } else {
      this.decorators.push("@IsOptional()");
    }

    if (this.column.name.toLowerCase().includes("email")) {
      this.decorators.push("@IsEmail()");
    }

    switch (this.column.type) {
      case "string":
        this.decorators.push("@IsString()");
        break;
      case "number":
        this.decorators.push("@IsNumber()");
        break;
      case "boolean":
        this.decorators.push("@IsBoolean()");
        break;
      case "Date":
        this.decorators.push("@IsDate()");
        break;
      case "object":
        this.decorators.push("@IsObject()");
        break;
    }
  }

  private buildSwaggerDecorators(): void {
    if (!this.withSwagger) return;

    const swaggerDecorator = this.column.nullable
      ? "@ApiPropertyOptional()"
      : "@ApiProperty()";
    this.decorators.push(swaggerDecorator);
  }

  build(): string {
    this.decorators = [];

    // Build decorators in order
    this.buildTypeOrmDecorator();
    this.buildValidationDecorators();
    this.buildSwaggerDecorators();

    // Handle TypeScript type annotation
    let typeAnnotation: string;
    if (this.column.type === "Date") {
      typeAnnotation = "Date";
    } else if (this.column.type === "object") {
      typeAnnotation = "Record<string, any>";
    } else {
      typeAnnotation = this.column.type;
    }

    return `  ${this.decorators.join("\n  ")}
  ${this.column.name}: ${typeAnnotation};`;
  }
}

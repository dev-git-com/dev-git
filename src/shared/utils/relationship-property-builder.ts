interface ForeignKeyInfo {
  referencesTable: string;
  column: string;
}

export class RelationshipPropertyBuilder {
  private decorators: string[] = [];
  private foreignKey!: ForeignKeyInfo;
  private withSwagger: boolean = false;

  setForeignKey(foreignKey: ForeignKeyInfo): RelationshipPropertyBuilder {
    this.foreignKey = foreignKey;
    return this;
  }

  enableSwagger(): RelationshipPropertyBuilder {
    this.withSwagger = true;
    return this;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  build(): string {
    // TypeORM decorators
    this.decorators.push(
      `@ManyToOne(() => ${this.capitalize(this.foreignKey.referencesTable)})`
    );
    this.decorators.push(`@JoinColumn({ name: '${this.foreignKey.column}' })`);

    // Swagger decorator
    if (this.withSwagger) {
      this.decorators.push("@ApiPropertyOptional()");
    }

    return `  ${this.decorators.join("\n  ")}
  ${this.foreignKey.referencesTable}: ${this.capitalize(
      this.foreignKey.referencesTable
    )};`;
  }
}

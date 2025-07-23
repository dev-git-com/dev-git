
export interface GenerationConfig {
  database_type: number; // 1=PostgreSQL, 2=MySQL, 3=SQL Server, 4=Oracle, 5=MongoDB
  with_crud: boolean;
  full_validations: boolean;
  date_logs: boolean;
  with_ftp: boolean;
  with_swagger: boolean;
  with_google_auth: boolean;
}

export interface DatabaseConfig {
  id: number;
  name: string;
  label: string;
  icon: string;
  driver: string;
  typeorm: string;
  port: number;
}

export interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  primary?: boolean;
  unique?: boolean;
  autoIncrement?: boolean;
  length?: number;
  defaultValue?: string;
  foreignKey?: {
    table: string;
    column: string;
  };
}

export interface TableSchema {
  name: string;
  columns: TableColumn[];
  indexes: string[];
  foreignKeys: {
    column: string;
    referencesTable: string;
    referencesColumn: string;
  }[];
}

export interface ParsedSchema {
  tables: TableSchema[];
  relationships: {
    from: string;
    to: string;
    type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  }[];
  userRoles?: string[];
}

export interface GenerationResult {
  success: boolean;
  message: string;
  zipBuffer?: Buffer;
  error?: string;
}

export interface TemplateData {
  projectName: string;
  tables: TableSchema[];
  config: GenerationConfig;
  databaseConfig: DatabaseConfig;
  timestamp: string;
  userRoles: string[];
}

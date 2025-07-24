
import { DatabaseConfig } from './types';

export const DATABASE_CONFIGS: DatabaseConfig[] = [
  {
    id: 1,
    name: 'postgresql',
    label: 'PostgreSQL',
    icon: '🐘',
    driver: 'pg',
    typeorm: 'postgres',
    port: 5432,
    soon: false
  },
  {
    id: 2,
    name: 'mysql',
    label: 'MySQL',
    icon: '🐬',
    driver: 'mysql',
    typeorm: 'mysql',
    port: 3306,
    soon: true
  },
  {
    id: 3,
    name: 'mssql',
    label: 'SQL Server',
    icon: '🏢',
    driver: 'mssql',
    typeorm: 'mssql',
    port: 1433,
    soon: true
  },
  {
    id: 4,
    name: 'oracle',
    label: 'Oracle',
    icon: '🔶',
    driver: 'oracle',
    typeorm: 'oracle',
    port: 1521,
    soon: true
  },
  {
    id: 5,
    name: 'mongodb',
    label: 'MongoDB',
    icon: '🍃',
    driver: 'mongodb',
    typeorm: 'mongodb',
    port: 27017,
    soon: true
  }
];

export const FEATURES = [
  { key: "with_crud" as const, label: "CRUD Operations", desc: 'Generate complete CRUD operations for all tables', icon: "🔧", status: "✅" },
  {
    key: "full_validations" as const,
    label: "Field Validations",
    desc: 'Add comprehensive field validations (email, unique, required, etc.)',
    icon: "🔍",
    status: "✅"
  },
  { key: "date_fields" as const, label: "Date Fields-Columns", desc: 'Add "createdAt" & "updatedAt" fields or columns for all the tables', icon: "📆", status: "✅" },
  { key: "with_swagger" as const, label: "Swagger Docs", desc: 'Generate Swagger documentation', icon: "📚", status: "✅" },
  { key: "with_ftp" as const, label: "FTP Support", desc: 'Include FTP configuration and file handling utilities', icon: "📁", status: "Fixes" },
  { key: "with_google_auth" as const, label: "Google OAuth", desc: 'Add Google OAuth 2.0 authentication setup', icon: "🔑", status: "Fixes" },
  { key: "with_jwt_auth" as const, label: "JWT Auth", desc: 'Add JWT auth strategy', icon: "🔐", status: "Fixes" },
];

export const SQL_DIALECTS = {
  POSTGRESQL: 'postgresql',
  MYSQL: 'mysql',
  MSSQL: 'mssql',
  ORACLE: 'oracle'
};

export const TYPE_MAPPINGS = {
  postgresql: {
    'VARCHAR': 'string',
    'TEXT': 'string',
    'INTEGER': 'number',
    'BIGINT': 'number',
    'SERIAL': 'number',
    'BOOLEAN': 'boolean',
    'TIMESTAMP': 'Date',
    'DATE': 'Date',
    'UUID': 'string',
    'JSONB': 'object',
    'JSON': 'object'
  },
  mysql: {
    'VARCHAR': 'string',
    'TEXT': 'string',
    'INT': 'number',
    'BIGINT': 'number',
    'TINYINT': 'boolean',
    'DATETIME': 'Date',
    'DATE': 'Date',
    'JSON': 'object'
  },
  mssql: {
    'NVARCHAR': 'string',
    'VARCHAR': 'string',
    'TEXT': 'string',
    'INT': 'number',
    'BIGINT': 'number',
    'BIT': 'boolean',
    'DATETIME': 'Date',
    'DATE': 'Date'
  },
  oracle: {
    'VARCHAR2': 'string',
    'CLOB': 'string',
    'NUMBER': 'number',
    'DATE': 'Date',
    'TIMESTAMP': 'Date'
  }
};

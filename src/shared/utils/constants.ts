
import { DatabaseConfig } from './types';

export const DATABASE_CONFIGS: DatabaseConfig[] = [
  {
    id: 1,
    name: 'postgresql',
    label: 'PostgreSQL',
    icon: '🐘',
    driver: 'pg',
    typeorm: 'postgres',
    port: 5432
  },
  {
    id: 2,
    name: 'mysql',
    label: 'MySQL',
    icon: '🐬',
    driver: 'mysql',
    typeorm: 'mysql',
    port: 3306
  },
  {
    id: 3,
    name: 'mssql',
    label: 'SQL Server',
    icon: '🏢',
    driver: 'mssql',
    typeorm: 'mssql',
    port: 1433
  },
  {
    id: 4,
    name: 'oracle',
    label: 'Oracle',
    icon: '🔶',
    driver: 'oracle',
    typeorm: 'oracle',
    port: 1521
  },
  {
    id: 5,
    name: 'mongodb',
    label: 'MongoDB',
    icon: '🍃',
    driver: 'mongodb',
    typeorm: 'mongodb',
    port: 27017
  }
];

export const FEATURE_DESCRIPTIONS = {
  with_crud: 'Generate complete CRUD operations for all tables',
  full_validations: 'Add comprehensive field validations (email, unique, required)',
  with_ftp: 'Include FTP configuration and file handling utilities',
  with_swagger: 'Generate Swagger/OpenAPI documentation',
  with_google_auth: 'Add Google OAuth 2.0 authentication setup'
};

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


import { ParsedSchema, TableSchema, TableColumn } from './types';
import { TYPE_MAPPINGS } from './constants';

export class SQLParser {
  private dialectType: string = 'postgresql';

  detectDialect(sqlContent: string): string {
    // Detect SQL dialect based on syntax patterns
    const upperSql = sqlContent.toUpperCase();
    
    if (upperSql.includes('NVARCHAR') || upperSql.includes('DATETIME2')) {
      return 'mssql';
    } else if (upperSql.includes('AUTO_INCREMENT') || upperSql.includes('TINYINT')) {
      return 'mysql';
    } else if (upperSql.includes('VARCHAR2') || upperSql.includes('CLOB')) {
      return 'oracle';
    } else {
      return 'postgresql';
    }
  }

  parseSQLSchema(sqlContent: string): ParsedSchema {
    this.dialectType = this.detectDialect(sqlContent);
    
    const tables = this.extractTables(sqlContent);
    const relationships = this.extractRelationships(tables);
    const userRoles = this.detectUserRoles(tables);

    return {
      tables,
      relationships,
      userRoles
    };
  }

  private extractTables(sqlContent: string): TableSchema[] {
    const tables: TableSchema[] = [];
    
    // Enhanced regex to match CREATE TABLE statements across different SQL dialects
    const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:`)?(\w+)(?:`)?[^(]*\(([\s\S]*?)(?=\)(?:\s*ENGINE|\s*;|\s*$))/gi;
    
    let match;
    while ((match = tableRegex.exec(sqlContent)) !== null) {
      const tableName = match[1];
      const columnDefinitions = match[2];
      
      const columns = this.parseColumns(columnDefinitions);
      const foreignKeys = this.extractForeignKeys(columnDefinitions);
      const indexes = this.extractIndexes(sqlContent, tableName);

      tables.push({
        name: tableName,
        columns,
        indexes,
        foreignKeys
      });
    }

    return tables;
  }

  private parseColumns(columnDefinitions: string): TableColumn[] {
    const columns: TableColumn[] = [];
    
    // Split by commas, but handle nested parentheses
    const columnLines = this.splitColumnDefinitions(columnDefinitions);
    
    for (const line of columnLines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('CONSTRAINT') || trimmed.startsWith('KEY') || 
          trimmed.startsWith('INDEX') || trimmed.startsWith('PRIMARY') || 
          trimmed.startsWith('FOREIGN') || trimmed.startsWith('UNIQUE')) {
        continue;
      }

      const column = this.parseColumnDefinition(trimmed);
      if (column) {
        columns.push(column);
      }
    }

    return columns;
  }

  private splitColumnDefinitions(definitions: string): string[] {
    const lines: string[] = [];
    let current = '';
    let parenDepth = 0;
    
    for (let i = 0; i < definitions.length; i++) {
      const char = definitions[i];
      
      if (char === '(') parenDepth++;
      if (char === ')') parenDepth--;
      
      if (char === ',' && parenDepth === 0) {
        lines.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    if (current.trim()) {
      lines.push(current.trim());
    }
    
    return lines;
  }

  private parseColumnDefinition(definition: string): TableColumn | null {
    // Enhanced regex to handle various column definition formats
    const columnRegex = /^(?:`)?(\w+)(?:`)?[\s]+([\w()]+)(?:\s+(.*?))?$/i;
    const match = columnRegex.exec(definition.trim());
    
    if (!match) return null;

    const name = match[1];
    const rawType = match[2];
    const constraints = match[3] || '';

    // Extract length from type (e.g., VARCHAR(255))
    const lengthMatch = rawType.match(/\((\d+)\)/);
    const length = lengthMatch ? parseInt(lengthMatch[1]) : undefined;
    
    // Clean type name
    const baseType = rawType.replace(/\(.*?\)/, '').toUpperCase();
    
    // Map to TypeScript type
    const typeMapping = TYPE_MAPPINGS[this.dialectType as keyof typeof TYPE_MAPPINGS] || TYPE_MAPPINGS.postgresql;
    const tsType = typeMapping[baseType as keyof typeof typeMapping] || 'string';

    const column: TableColumn = {
      name,
      type: tsType,
      nullable: !constraints.toUpperCase().includes('NOT NULL'),
      primary: constraints.toUpperCase().includes('PRIMARY KEY'),
      unique: constraints.toUpperCase().includes('UNIQUE'),
      autoIncrement: constraints.toUpperCase().includes('AUTO_INCREMENT') || 
                     constraints.toUpperCase().includes('AUTOINCREMENT') ||
                     baseType === 'SERIAL',
      length
    };

    // Extract default value
    const defaultMatch = constraints.match(/DEFAULT\s+([^,\s]+)/i);
    if (defaultMatch) {
      column.defaultValue = defaultMatch[1].replace(/['"]/g, '');
    }

    return column;
  }

  private extractForeignKeys(columnDefinitions: string): any[] {
    const foreignKeys: any[] = [];
    
    // Match FOREIGN KEY constraints
    const fkRegex = /FOREIGN\s+KEY\s*\((?:`)?(\w+)(?:`)?\)\s+REFERENCES\s+(?:`)?(\w+)(?:`)?\s*\((?:`)?(\w+)(?:`)?\)/gi;
    
    let match;
    while ((match = fkRegex.exec(columnDefinitions)) !== null) {
      foreignKeys.push({
        column: match[1],
        referencesTable: match[2],
        referencesColumn: match[3]
      });
    }

    return foreignKeys;
  }

  private extractIndexes(sqlContent: string, tableName: string): string[] {
    const indexes: string[] = [];
    
    // Match CREATE INDEX statements
    const indexRegex = new RegExp(`CREATE\\s+(?:UNIQUE\\s+)?INDEX\\s+\\w+\\s+ON\\s+(?:\`)?${tableName}(?:\`)?\\s*\\(([^)]+)\\)`, 'gi');
    
    let match;
    while ((match = indexRegex.exec(sqlContent)) !== null) {
      indexes.push(match[1].replace(/`/g, '').trim());
    }

    return indexes;
  }

  private extractRelationships(tables: TableSchema[]): any[] {
    const relationships: any[] = [];
    
    for (const table of tables) {
      for (const fk of table.foreignKeys) {
        relationships.push({
          from: table.name,
          to: fk.referencesTable,
          type: 'many-to-one' as const
        });
      }
    }

    return relationships;
  }

  private detectUserRoles(tables: TableSchema[]): string[] {
    const roles: string[] = [];
    
    for (const table of tables) {
      // Look for role-related columns
      const roleColumns = table.columns.filter(col => 
        col.name.toLowerCase().includes('role') || 
        col.name.toLowerCase().includes('permission') ||
        col.name.toLowerCase() === 'type'
      );

      for (const roleCol of roleColumns) {
        if (roleCol.type === 'string') {
          // Extract enum values if present in constraints or comments
          roles.push('admin', 'user', 'moderator'); // Default roles
        }
      }
    }

    return roles.length > 0 ? [...new Set(roles)] : ['admin', 'user'];
  }
}

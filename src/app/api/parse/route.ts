
import { SQLParser } from '@/shared/utils/sql-parser';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No SQL file provided' },
        { status: 400 }
      );
    }

    // Read file content
    let sqlContent = await file.text();
    // 
    const charsToRemove = ['"', '`'];
    for (const ch of charsToRemove) {
      sqlContent = sqlContent.replaceAll(ch, '');
    }

    if (!sqlContent.trim()) {
      return NextResponse.json(
        { error: 'SQL file is empty' },
        { status: 400 }
      );
    }

    // Parse SQL schema
    const parser = new SQLParser();
    const parsedSchema = parser.parseSQLSchema(sqlContent);

    return NextResponse.json({
      success: true,
      schema: {
        tableCount: parsedSchema.tables.length,
        tables: parsedSchema.tables.map(table => ({
          name: table.name,
          columnCount: table.columns.length,
          hasRelationships: table.foreignKeys.length > 0
        })),
        dialect: parser.detectDialect(sqlContent),
        userRoles: parsedSchema.userRoles
      }
    });

  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      {
        error: 'Failed to parse SQL file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

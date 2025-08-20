
import { CodeGenerator } from '@/shared/utils/code-generator';
import { SQLParser } from '@/shared/utils/sql-parser';
import { GenerationConfig } from '@/shared/utils/types';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const config = JSON.parse(formData.get('config') as string) as GenerationConfig;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No SQL file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.sql')) {
      return NextResponse.json(
        { error: 'Please upload a .sql file' },
        { status: 400 }
      );
    }

    // Read file content
    const sqlContent = await file.text();
    
    if (!sqlContent.trim()) {
      return NextResponse.json(
        { error: 'SQL file is empty' },
        { status: 400 }
      );
    }

    // Parse SQL schema
    const parser = new SQLParser();
    const parsedSchema = parser.parseSQLSchema(sqlContent);

    if (parsedSchema.tables.length === 0) {
      return NextResponse.json(
        { error: 'No valid tables found in SQL file. Please ensure your SQL contains CREATE TABLE statements.' },
        { status: 400 }
      );
    }

    // Generate project name from file name
    const projectName = file.name.replace(/\.sql$/, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

    // Generate NestJS project
    const generator = new CodeGenerator();
    const zipBuffer = await generator.generateProject(parsedSchema, config, projectName);

    // Return zip file
    return new NextResponse(zipBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${projectName}-nestjs-app.zip"`,
        'Content-Length': zipBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate project', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

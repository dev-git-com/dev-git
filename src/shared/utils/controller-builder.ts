import { TableSchema, TemplateData } from "./types";

export class ControllerBuilder {
  private entityName: string = "";
  private tableName: string = "";
  private enableSwagger: boolean = false;
  private enableJwtAuth: boolean = false;

  setBasicInfo(tableName: string, entityName: string): this {
    this.tableName = tableName;
    this.entityName = entityName;
    return this;
  }

  withSwagger(enable: boolean = true): this {
    this.enableSwagger = enable;
    return this;
  }

  withJwtAuth(enable: boolean = true): this {
    this.enableJwtAuth = enable;
    return this;
  }

  private getImports(): string {
    const imports = [
      `import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';`,
    ];

    if (this.enableSwagger) {
      imports.push(
        `import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';`
      );
    }

    if (this.enableJwtAuth) {
      imports.push(
        `import { JwtAuthGuard } from '../../guards/jwt-auth.guard';`
      );
      imports.push(`import { RolesGuard } from '../../guards/roles.guard';`);
      imports.push(`import { Roles } from '../../decorators/roles.decorator';`);
    }

    imports.push(
      `import { ${this.entityName}Service } from './${this.tableName}.service';`,
      `import { Create${this.entityName}Dto } from './dto/create-${this.tableName}.dto';`,
      `import { Update${this.entityName}Dto } from './dto/update-${this.tableName}.dto';`,
      `import { ${this.entityName} } from 'src/entities/${this.tableName}.entity';`
    );

    return imports.join("\n");
  }

  private getClassDecorators(): string {
    const decorators = [];

    if (this.enableSwagger) {
      decorators.push(`@ApiTags('${this.tableName}')`);
      decorators.push("@ApiBearerAuth()");
    }

    decorators.push(`@Controller('${this.tableName}')`);

    if (this.enableJwtAuth) {
      decorators.push("@UseGuards(JwtAuthGuard, RolesGuard)");
    }

    return decorators.join("\n");
  }

  private generateCreateMethod(): string {
    const decorators = [];

    if (this.enableSwagger) {
      decorators.push(
        `@ApiOperation({ summary: 'Create a new ${this.tableName}' })`
      );
      decorators.push(
        `@ApiResponse({ status: 201, description: 'Created successfully', type: ${this.entityName} })`
      );
    }

    decorators.push("@Post()");

    if (this.enableJwtAuth) {
      decorators.push(`@Roles('admin', 'user')`);
    }

    return `
  ${decorators.join("\n  ")}
  async create(@Body() create${this.entityName}Dto: Create${
      this.entityName
    }Dto): Promise<${this.entityName}> {
    try {
      return await this.${this.tableName}Service.create(create${
      this.entityName
    }Dto);
    } catch (error) {
      throw new HttpException(
        \`Failed to create ${this.tableName}: \${error.message}\`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }`;
  }

  private generateFindAllMethod(): string {
    const decorators = [];

    if (this.enableSwagger) {
      decorators.push(
        `@ApiOperation({ summary: 'Get all ${this.tableName}s' })`
      );
      decorators.push(
        `@ApiResponse({ status: 200, description: 'Retrieved successfully', type: [${this.entityName}] })`
      );
    }

    decorators.push("@Get()");

    if (this.enableJwtAuth) {
      decorators.push(`@Roles('admin', 'user')`);
    }

    return `
  ${decorators.join("\n  ")}
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: ${
    this.entityName
  }[]; total: number; page: number; totalPages: number }> {
    try {
      return await this.${this.tableName}Service.findAll(page, limit);
    } catch (error) {
      throw new HttpException(
        \`Failed to retrieve ${this.tableName}s: \${error.message}\`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }`;
  }

  private generateFindOneMethod(): string {
    const decorators = [];

    if (this.enableSwagger) {
      decorators.push(
        `@ApiOperation({ summary: 'Get ${this.tableName} by ID' })`
      );
      decorators.push(
        `@ApiResponse({ status: 200, description: 'Retrieved successfully', type: ${this.entityName} })`
      );
    }

    decorators.push("@Get(':id')");

    if (this.enableJwtAuth) {
      decorators.push(`@Roles('admin', 'user')`);
    }

    return `
  ${decorators.join("\n  ")}
  async findOne(@Param('id') id: string): Promise<${this.entityName}> {
    try {
      const result = await this.${this.tableName}Service.findOne(+id);
      if (!result) {
        throw new HttpException(\`${
          this.entityName
        } with ID \${id} not found\`, HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        \`Failed to retrieve ${this.tableName}: \${error.message}\`,
        HttpStatus.NOT_FOUND,
      );
    }
  }`;
  }

  private generateUpdateMethod(): string {
    const decorators = [];

    if (this.enableSwagger) {
      decorators.push(`@ApiOperation({ summary: 'Update ${this.tableName}' })`);
      decorators.push(
        `@ApiResponse({ status: 200, description: 'Updated successfully', type: ${this.entityName} })`
      );
    }

    decorators.push("@Patch(':id')");

    if (this.enableJwtAuth) {
      decorators.push(`@Roles('admin')`);
    }

    return `
  ${decorators.join("\n  ")}
  async update(
    @Param('id') id: string,
    @Body() update${this.entityName}Dto: Update${this.entityName}Dto,
  ): Promise<${this.entityName}> {
    try {
      return await this.${this.tableName}Service.update(+id, update${
      this.entityName
    }Dto);
    } catch (error) {
      throw new HttpException(
        \`Failed to update ${this.tableName}: \${error.message}\`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }`;
  }

  private generateRemoveMethod(): string {
    const decorators = [];

    if (this.enableSwagger) {
      decorators.push(`@ApiOperation({ summary: 'Delete ${this.tableName}' })`);
      decorators.push(
        `@ApiResponse({ status: 200, description: 'Deleted successfully' })`
      );
    }

    decorators.push("@Delete(':id')");

    if (this.enableJwtAuth) {
      decorators.push(`@Roles('admin')`);
    }

    return `
  ${decorators.join("\n  ")}
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.${this.tableName}Service.remove(+id);
      return { message: \`${
        this.entityName
      } with ID \${id} deleted successfully\` };
    } catch (error) {
      throw new HttpException(
        \`Failed to delete ${this.tableName}: \${error.message}\`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }`;
  }

  build(): string {
    return `${this.getImports()}

${this.getClassDecorators()}
export class ${this.entityName}Controller {
  constructor(private readonly ${this.tableName}Service: ${
      this.entityName
    }Service) {}
${this.generateCreateMethod()}
${this.generateFindAllMethod()}
${this.generateFindOneMethod()}
${this.generateUpdateMethod()}
${this.generateRemoveMethod()}
}`;
  }
}

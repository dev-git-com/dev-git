export class PackageJsonBuilder {
  private packageJson: any;

  constructor() {
    this.packageJson = {
      scripts: {},
      dependencies: {},
      devDependencies: {},
      jest: {},
    };
  }

  setBasicInfo(
    name: string,
    version: string = "0.0.1",
    description: string = "",
    author: string = "",
    license: string = "UNLICENSED",
    isPrivate: boolean = true
  ): this {
    this.packageJson.name = name;
    this.packageJson.version = version;
    this.packageJson.description = description;
    this.packageJson.author = author;
    this.packageJson.private = isPrivate;
    this.packageJson.license = license;
    return this;
  }

  addScript(key: string, value: string): this {
    this.packageJson.scripts[key] = value;
    return this;
  }

  addScripts(scripts: Record<string, string>): this {
    Object.assign(this.packageJson.scripts, scripts);
    return this;
  }

  addDependency(packageName: string, version: string): this {
    this.packageJson.dependencies[packageName] = version;
    return this;
  }

  addDependencies(dependencies: Record<string, string>): this {
    Object.assign(this.packageJson.dependencies, dependencies);
    return this;
  }

  addDevDependency(packageName: string, version: string): this {
    this.packageJson.devDependencies[packageName] = version;
    return this;
  }

  addDevDependencies(devDependencies: Record<string, string>): this {
    Object.assign(this.packageJson.devDependencies, devDependencies);
    return this;
  }

  addConditionalDependency(
    condition: boolean,
    packageName: string,
    version: string
  ): this {
    if (condition) {
      this.addDependency(packageName, version);
    }
    return this;
  }

  addConditionalDevDependency(
    condition: boolean,
    packageName: string,
    version: string
  ): this {
    if (condition) {
      this.addDevDependency(packageName, version);
    }
    return this;
  }

  setJestConfig(config: Record<string, any>): this {
    this.packageJson.jest = config;
    return this;
  }

  setCustomField(key: string, value: any): this {
    this.packageJson[key] = value;
    return this;
  }

  removeEmptySections(): this {
    if (Object.keys(this.packageJson.scripts).length === 0) {
      delete this.packageJson.scripts;
    }
    if (Object.keys(this.packageJson.dependencies).length === 0) {
      delete this.packageJson.dependencies;
    }
    if (Object.keys(this.packageJson.devDependencies).length === 0) {
      delete this.packageJson.devDependencies;
    }
    if (Object.keys(this.packageJson.jest).length === 0) {
      delete this.packageJson.jest;
    }
    return this;
  }

  build(): string {
    return JSON.stringify(this.packageJson, null, 2);
  }

  toObject(): any {
    return { ...this.packageJson };
  }

  reset(): this {
    this.packageJson = {
      scripts: {},
      dependencies: {},
      devDependencies: {},
      jest: {},
    };
    return this;
  }
}

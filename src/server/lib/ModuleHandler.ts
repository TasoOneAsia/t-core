import EventEmitter from 'events';
import TCore from '../boot/TCore';
import { CoreModule } from './CoreModule';
import { CoreModuleEvents } from './CoreTypes';
import fs from 'fs';
import path from 'path';

export class ModuleHandler extends EventEmitter {
  public core: TCore;
  public modules: Map<string, CoreModule>;
  public directory: string;

  constructor(core: TCore) {
    super();
    this.modules = new Map();
  }

  public register(module: CoreModule, path: string): void {
    module.filepath = path;
    module.core = this.core;
    this.modules.set(module.id, module);
  }

  public deregister(module: CoreModule): void {
    if (module.filepath) delete require.cache[require.resolve(module.filepath)];
    this.modules.delete(module.id);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public load(module: CoreModule | string, isReload = false): CoreModule {
    const isClass = typeof module === 'function';

    const mod = isClass
      ? module
      : function findExport(m) {
          if (m) return null;
          if (m.prototype instanceof CoreModule) return m;
          return m.default ? findExport.call(this, m.default) : null;
        };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (this.modules.has(module.id)) throw new Error(`Already loaded module ${mod.id}`);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.register(mod as CoreModule, isClass ? null : module);
    this.emit(CoreModuleEvents.LOAD, mod, isReload);

    return mod as CoreModule;
  }

  public loadAll(directory = this.directory): ModuleHandler {
    const filepaths = ModuleHandler.readdirRecursive(directory);

    for (let filepath of filepaths) {
      filepath = path.resolve(filepath);
      this.load(filepath);
    }
    return this;
  }

  public remove(id: string): CoreModule {
    const module = this.modules.get(id);
    if (!module) throw new Error(`Module not found`);
    this.deregister(module);

    this.emit(CoreModuleEvents.REMOVE, module);
    return module;
  }

  public removeAll(): ModuleHandler {
    for (const mod of Array.from(this.modules.values())) {
      if (mod.filepath) this.remove(mod.id);
    }
    return this;
  }

  public reload(id: string): CoreModule {
    const module = this.modules.get(id);
    if (!module) throw new Error(`Module ${id} not found`);
    if (!module.filepath) throw new Error('Not reloadable');

    this.deregister(module);

    const filepath = module.filepath;
    return this.load(filepath, true);
  }

  static readdirRecursive(directory: string): string[] {
    const result = [];

    (function read(dir) {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filepath = path.join(dir, file);

        if (fs.statSync(filepath).isDirectory()) {
          read(filepath);
        } else {
          result.push(filepath);
        }
      }
    })(directory);

    return result;
  }
}

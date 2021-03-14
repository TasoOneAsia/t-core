import TCore from '../boot/TCore';
import { ModuleHandler } from './ModuleHandler';

export class CoreModule {
  public id: string;
  public core: TCore | null;
  public filepath: string | null;
  public handler: ModuleHandler | null;

  constructor(id: string) {
    this.id = id;
    this.core = null;
    this.filepath = null;
    this.handler = null;
  }

  public reload(): void {
    this.handler.reload(this.id);
  }

  public remove(): void {
    this.handler.remove(this.id);
  }
}

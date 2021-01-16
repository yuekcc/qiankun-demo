import {
  AppMetadata,
  FrameworkConfiguration,
  LoadableApp,
  loadMicroApp,
  MicroApp,
  start,
} from 'qiankun';
import Vue from 'vue';

export interface AppManifest extends AppMetadata {
  propKeys?: string[];
}

export interface PropDataSet {
  [field: string]: any;
}

export class MicroAppLoader {
  private _started = false;
  private _appList: AppManifest[] = [];

  /**
   * 启动
   */
  start(qiankunStartOptions: FrameworkConfiguration | null = null) {
    if (this._started) {
      return;
    }

    if (qiankunStartOptions) {
      start(qiankunStartOptions);
    } else {
      start();
    }
    this._started = true;
  }

  private _addApp(manifest: AppManifest): void {
    const name = manifest.name;
    const idx = this._appList.findIndex((it) => it.name === name);
    if (idx === -1) {
      this._appList.push(manifest);
      return;
    }

    this._appList.splice(idx, 1, manifest);
    console.warn(`[QianKunHelper] updated app manifest, name is '${name}'`);
  }

  /**
   * 注册一个应用
   * @param manifests 应用注册数据
   */
  addApp(...manifests: AppManifest[]): void {
    manifests.forEach((it) => this._addApp(it));
  }

  private _findAppByName(name: string): AppManifest | null {
    return this._appList.find((it) => it.name === name);
  }

  private getProps(keys: string[], db: Record<string, any>): Record<string, any> {
    return keys.reduce((data, key) => {
      data[key] = db[key];
      return data;
    }, {} as Record<string, any>);
  }

  /**
   * 按名称查找一个应用
   * @param name 应用名称
   */
  findApp(name: string): AppManifest | null {
    return this._findAppByName(name);
  }

  /**
   * 加载应用到指定容器
   * @param manifest 应用注册信息
   * @param containerId 容器 ID（如 #app）
   * @param propDb 应用启动参数
   */
  loadApp(manifest: AppManifest, containerId: string, propDb: PropDataSet): MicroApp {
    const config = {
      ...manifest,
      container: containerId,
      props: this.getProps(manifest.propKeys || [], propDb),
    };

    return loadMicroApp((config as any) as LoadableApp<PropDataSet>);
  }
}

export const microAppLoader = new MicroAppLoader();

/**
 * 创建一个 App 容器组件（Vue 组件）
 *
 * 该组件会自动在 mounted 后自动挂载应用
 *
 * @param loader QianKunHelper 实例
 * @param getPropDataSet 应用启动参数数据仓库 getter
 */
export const makeAppComponentCreator = (
  loader: MicroAppLoader,
  getPropDataSet: () => PropDataSet,
) => (name: string, opt = { autoRemove: true }) => {
  const containerId = `app-container-${name}`;
  return Vue.extend({
    data() {
      return {
        manifest: null as AppManifest | null,
        appInstance: null as MicroApp | null,
        errorMessage: '',
      };
    },
    computed: {
      appName() {
        return (this.manifest && this.manifest.name) || 'unname';
      },
    },
    mounted() {
      console.log('MicroAppComponent mounted. containerId =', containerId);
      const app = loader.findApp(name);
      if (app) {
        const propDb = getPropDataSet();
        this.appInstance = loader.loadApp(app, `#${containerId}`, propDb);
      } else {
        this.errorMessage = 'app not found, name = ' + name;
      }
    },
    beforeDestroy() {
      const autoRemove = opt.autoRemove ?? true;

      if (autoRemove && this.appInstance && typeof this.appInstance.unmount === 'function') {
        this.appInstance.unmount();
      }
    },
    render(h) {
      if (this.errorMessage !== '') {
        return h('div', this.errorMessage);
      }

      return h('div', {
        attrs: { id: containerId, 'data-app-name': this.appName },
      });
    },
  });
};

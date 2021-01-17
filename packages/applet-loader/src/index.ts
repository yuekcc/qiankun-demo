import {
  AppMetadata,
  FrameworkConfiguration,
  LoadableApp,
  loadMicroApp,
  MicroApp,
  start,
} from 'qiankun';
import Vue from 'vue';
import { VueConstructor } from 'vue/types/umd';

export interface AppletManifest extends AppMetadata {
  propKeys?: string[];
}

export interface StartOptions extends FrameworkConfiguration {}

export interface PropsData {
  [field: string]: any;
}

export type PropsDataGetter = (vueComponentInstance: VueConstructor<Vue>) => PropsData;

export class AppletLoader {
  private _started = false;
  private _appletList: AppletManifest[] = [];

  private _addApplet(manifest: AppletManifest): void {
    const name = manifest.name;
    const idx = this._appletList.findIndex((it) => it.name === name);
    if (idx === -1) {
      this._appletList.push(manifest);
      return;
    }

    this._appletList.splice(idx, 1, manifest);
    console.warn(`[QianKunHelper] updated app manifest, name is '${name}'`);
  }

  private _findAppByName(name: string): AppletManifest | null {
    return this._appletList.find((it) => it.name === name);
  }

  private getProps(keys: string[], db: PropsData): PropsData {
    return keys.reduce((data, key) => {
      data[key] = db[key];
      return data;
    }, {} as PropsData);
  }

  addApplet(...manifests: AppletManifest[]): void {
    manifests.forEach((it) => this._addApplet(it));
  }

  findApplet(name: string): AppletManifest | null {
    return this._findAppByName(name);
  }

  loadApplet(manifest: AppletManifest, containerId: string, props: PropsData): MicroApp {
    const config = {
      ...manifest,
      container: containerId,
      props: this.getProps(manifest.propKeys || [], props),
    };

    return loadMicroApp((config as any) as LoadableApp<PropsData>);
  }

  start(options?: StartOptions) {
    if (this._started) {
      return;
    }

    if (options) {
      start(options);
    } else {
      start();
    }
    this._started = true;
  }
}

export const appletLoader = new AppletLoader();

const id = (function () {
  let _i = 0;
  return () => _i++;
})();

export const makeAppletComponentCreator = (loader: AppletLoader, getPropsData: PropsDataGetter) => (
  name: string,
  options = { autoRemove: true, propsData: {} as PropsData },
) => {
  const containerId = `applet-container-${name}-${id()}`;
  return Vue.extend({
    data() {
      return {
        manifest: null as AppletManifest | null,
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
      console.log('AppletComponent mounted. containerId =', containerId);

      const vm = this;
      const manifest = loader.findApplet(name);
      if (manifest) {
        let propsData = getPropsData(vm);
        if (options && options.propsData && Object.keys(options.propsData).length > 0) {
          propsData = {
            ...propsData,
            ...options.propsData,
          };
        }

        this.appInstance = loader.loadApplet(manifest, `#${containerId}`, propsData);
      } else {
        this.errorMessage = `applet not found. lookup with name '${name}'`;
      }
    },
    beforeDestroy() {
      const autoRemove = options.autoRemove ?? true;

      if (autoRemove && this.appInstance && typeof this.appInstance.unmount === 'function') {
        console.log('AppletComponent unmounted. containerId =', containerId);
        this.appInstance.unmount();
      }
    },
    render(h) {
      if (this.errorMessage !== '') {
        return h('div', this.errorMessage);
      }

      return h('div', {
        attrs: { id: containerId },
        class: 'applet-container',
      });
    },
  });
};

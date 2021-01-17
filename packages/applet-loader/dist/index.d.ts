import { AppMetadata, FrameworkConfiguration, MicroApp } from 'qiankun';
import Vue from 'vue';
import { VueConstructor } from 'vue/types/umd';
export interface AppletManifest extends AppMetadata {
    propKeys?: string[];
}
export interface StartOptions extends FrameworkConfiguration {
}
export interface PropsData {
    [field: string]: any;
}
export declare type PropsDataGetter = (vueComponentInstance: VueConstructor<Vue>) => PropsData;
export declare class AppletLoader {
    private _started;
    private _appletList;
    private _addApplet;
    private _findAppByName;
    private getProps;
    addApplet(...manifests: AppletManifest[]): void;
    findApplet(name: string): AppletManifest | null;
    loadApplet(manifest: AppletManifest, containerId: string, props: PropsData): MicroApp;
    start(options?: StartOptions): void;
}
export declare const appletLoader: AppletLoader;
export declare const makeAppletComponentCreator: (loader: AppletLoader, getPropsData: PropsDataGetter) => (name: string, options?: {
    autoRemove: boolean;
    propsData: PropsData;
}) => import("vue/types/vue").ExtendedVue<Vue, {
    manifest: AppletManifest;
    appInstance: any;
    errorMessage: string;
}, unknown, {
    appName: any;
}, Record<never, any>>;

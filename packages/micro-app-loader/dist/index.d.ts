import { AppMetadata, FrameworkConfiguration, MicroApp } from 'qiankun';
import Vue from 'vue';
export interface AppManifest extends AppMetadata {
    propKeys?: string[];
}
export interface PropDataSet {
    [field: string]: any;
}
export declare class MicroAppLoader {
    private _started;
    private _appList;
    /**
     * 启动
     */
    start(qiankunStartOptions?: FrameworkConfiguration | null): void;
    private _addApp;
    /**
     * 注册一个应用
     * @param manifests 应用注册数据
     */
    addApp(...manifests: AppManifest[]): void;
    private _findAppByName;
    private getProps;
    /**
     * 按名称查找一个应用
     * @param name 应用名称
     */
    findApp(name: string): AppManifest | null;
    /**
     * 加载应用到指定容器
     * @param manifest 应用注册信息
     * @param containerId 容器 ID（如 #app）
     * @param propDb 应用启动参数
     */
    loadApp(manifest: AppManifest, containerId: string, propDb: PropDataSet): MicroApp;
}
export declare const microAppLoader: MicroAppLoader;
/**
 * 创建一个 App 容器组件（Vue 组件）
 *
 * 该组件会自动在 mounted 后自动挂载应用
 *
 * @param loader QianKunHelper 实例
 * @param getPropDataSet 应用启动参数数据仓库 getter
 */
export declare const makeAppComponentCreator: (loader: MicroAppLoader, getPropDataSet: () => PropDataSet) => (name: string, opt?: {
    autoRemove: boolean;
}) => import("vue/types/vue").ExtendedVue<Vue, {
    manifest: AppManifest;
    appInstance: any;
    errorMessage: string;
}, unknown, {
    appName: any;
}, Record<never, any>>;

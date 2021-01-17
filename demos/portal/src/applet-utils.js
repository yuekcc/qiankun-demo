import { appletLoader, makeAppletComponentCreator } from '@demos/applet-loader';
import appletList from '@/applet-list';

appletLoader.addApplet(...appletList);

export function systemStart() {
  appletLoader.start();
}

const propsDataGetter = vm => {
  const route = vm.$route;

  return {
    baseUrl: route.meta.baseUrl,
  };
};

export const makeAppletComponent = makeAppletComponentCreator(appletLoader, propsDataGetter);

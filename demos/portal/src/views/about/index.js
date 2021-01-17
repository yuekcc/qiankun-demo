import { makeAppletComponent } from '@/applet-utils';

export default {
  data() {
    return {
      appletComponent: null,
    };
  },
  beforeMount() {
    this.appletComponent = makeAppletComponent('ModuleAboutMe', {
      propsData: {
        baseUrl: '/applets/about-me/',
      },
    });
    console.log(this.appletComponent);
  },
  render(h) {
    if (this.appletComponent) {
      return h(this.appletComponent);
    }

    return h('div', 'failed to load applet');
  },
};

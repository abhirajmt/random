import componentFetcher from "./component";

const LayoutFetcher = {
  getLayout: async layout => {
    const { component, ...extra } = layout;
    // const componentRef = await componentFetcher.getComponent(component);
    return {
      // component: componentRef,
      component: () => 'componentRef',
      type: layout.component.type,
      ...extra,
    };
  },
};

export default LayoutFetcher;

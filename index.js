import {Navigation} from 'react-native-navigation';
import * as layoutGenerator from './layoutConverter';
import * as optionsConverter from './optionsConverter';
import {printFuncExecution} from './utils';

function ScreenVisibilityListener({willAppear = () => {}, didAppear = () => {}, willDisappear = () => {}, didDisappear = () => {}}) {
  this.register = function () {
    Navigation.events().componentDidAppear((componentId, componentName) => {
      willAppear({screen: componentName});
      didAppear({screen: componentName});
    });
    Navigation.events().componentDidDisappear((componentId, componentName) => {
      willDisappear({screen: componentName});
      didDisappear({screen: componentName});
    });
  };

  this.unregister = function () {};
}

var navigationMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(Navigation));

navigationMethods.forEach(methodName => {
  if (Navigation[`_${methodName}`]) {
    return;
  }
  const oldPrototype = Navigation[methodName];

  Navigation[methodName] = function () {
    printFuncExecution(methodName, Array.from(arguments));
    return oldPrototype.apply(this, arguments);
  };
});

Navigation.startTabBasedApp = ({tabs, tabsStyle, appStyle, drawer}) => {

  Navigation.events().onAppLaunched(() => {
    Navigation.setDefaultOptions(optionsConverter.convertDefaultOptions(tabsStyle, appStyle));
    Navigation.setRoot(layoutGenerator.convertBottomTabs(tabs, drawer));
  });
};

Navigation.startSingleScreenApp = ({screen, tabsStyle, appStyle, drawer, components}) => {
  Navigation.events().onAppLaunched(() => {
    Navigation.setDefaultOptions(optionsConverter.convertDefaultOptions(tabsStyle, appStyle));
    Navigation.setRoot(layoutGenerator.convertSingleScreen(screen, drawer, components));
  });
};

Navigation._registerComponent = Navigation.registerComponent;
Navigation.registerComponent = (name, generator, store, provider) => {
  const component = generator();
  component.prototype.onNavigationButtonPressed = (id) => {
    component.prototype.onNavigatorEvent({id});
  };

  Navigation._registerComponent(name, () => component, store, provider);
};

module.exports = {
  Navigation,
  ScreenVisibilityListener
};

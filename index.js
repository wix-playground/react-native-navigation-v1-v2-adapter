import {Navigation} from 'react-native-navigation';
import * as layoutGenerator from './layoutGenerator';
import * as optionsConverter from './optionsConverter';

function ScreenVisibilityListener({willAppear = () => {}, didAppear = () => {}, willDisappear, didDisappear}) {
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

  this.unregister = function () {

  };
}

Navigation.startTabBasedApp = ({tabs, tabsStyle, appStyle, drawer}) => {
  Navigation.events().onAppLaunched(() => {
    Navigation.setDefaultOptions(optionsConverter.generateDefaultOptions(tabsStyle, appStyle));
    Navigation.setRoot(layoutGenerator.generateBottomTabs(tabs, drawer));
  });
};

Navigation.startSingleScreenApp = ({screen, tabsStyle, appStyle, drawer, components}) => {
  Navigation.events().onAppLaunched(() => {
    Navigation.setDefaultOptions(optionsConverter.generateDefaultOptions(tabsStyle, appStyle));
    Navigation.setRoot(layoutGenerator.generateSingleScreen(screen, drawer, components));
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
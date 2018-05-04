import {Navigation} from 'react-native-navigation';
import * as layoutGenerator from './layoutGenerator';

const ScreenVisibilityListener = {}

Navigation.startTabBasedApp = ({tabs, tabsStyle, appStyle, drawer}) => {
  Navigation.events().onAppLaunched(() => {
    Navigation.setDefaultOptions(layoutGenerator.generateDefaultOptions(tabsStyle, appStyle));
    Navigation.setRoot(layoutGenerator.generateBottomTabs(tabs, drawer));
  });
}

Navigation.startSingleScreenApp = ({screen, tabsStyle, appStyle, drawer, }) => {
  Navigation.events().onAppLaunched(() => {
    Navigation.setDefaultOptions(layoutGenerator.generateDefaultOptions(tabsStyle, appStyle));
    console.log()
    Navigation.setRoot(layoutGenerator.generateSingleScreen(screen, drawer));
  });
}

Navigation._registerComponent = Navigation.registerComponent;
Navigation.registerComponent = (name, generator, store, provider) => {
  const component = generator();
  component.prototype.onNavigationButtonPressed = (id) => {
    component.prototype.onNavigatorEvent({id});
  }

  Navigation._registerComponent(name, () => component, store, provider);
}


module.exports = {
  Navigation,
  ScreenVisibilityListener
}
import {Navigation} from 'react-native-navigation';
import * as layoutGenerator from './layoutConverter';
import * as optionsConverter from './optionsConverter';
import {wrapReduxComponent} from './utils';
import ScreenVisibilityListener from './ScreenVisibilityListener';

const appLaunched = false;

Navigation.startTabBasedApp = ({tabs, tabsStyle, appStyle, drawer}) => {
  const onAppLaunched = () => {
    appLaunched = true;
    Navigation.setDefaultOptions(optionsConverter.convertDefaultOptions(tabsStyle, appStyle));
    Navigation.setRoot(layoutGenerator.convertBottomTabs(tabs, drawer));
  }
  
  appLaunched ? onAppLaunched() : Navigation.events().registerAppLaunchedListener(onAppLaunched);
};

Navigation.startSingleScreenApp = ({screen, tabsStyle, appStyle, drawer, components}) => {
  const onAppLaunched = () => {
    appLaunched = true;
    Navigation.setDefaultOptions(optionsConverter.convertDefaultOptions(tabsStyle, appStyle));
    Navigation.setRoot(layoutGenerator.convertSingleScreen(screen, drawer, components));
  }

  appLaunched ? onAppLaunched() :Navigation.events().registerAppLaunchedListener(onAppLaunched);
};


Navigation._registerComponent = Navigation.registerComponent;
Navigation.registerComponent = (name, generator, store, provider) => {
  const component = store ? wrapReduxComponent(generator, store, provider) : generator();
  const navigatorStyle = component.navigatorStyle;
  const navigatorButtons = component.navigatorButtons;

  if (navigatorStyle || navigatorButtons) {
    component.__defineGetter__('options', () => {
      const s = optionsConverter.convertStyle(navigatorStyle, navigatorButtons);
      return s;
    });
  }


  component.prototype.onNavigationButtonPressed = function(id) {
    if (this.onNavigatorEvent) {
      this.onNavigatorEvent({id});
    }
  };
  
  component.prototype.componentDidAppear = function () {
    if (this.props) {
      this.props.navigator.isVisible = true;
    }
    if (this.onNavigatorEvent) {
      this.onNavigatorEvent({id: 'willAppear'});
      this.onNavigatorEvent({id: 'didAppear'});
    }
  };

  component.prototype.componentDidDisappear = () => {
    if (this.props) {
      this.props.navigator.isVisible = false;
    }
    if (this.onNavigatorEvent) {
      this.onNavigatorEvent({id: 'willDisappear'});
      this.onNavigatorEvent({id: 'didDisappear'});
    }
  };

  Navigation._registerComponent(name, () => component, store, provider);
};


module.exports = {
  Navigation,
  ScreenVisibilityListener
};

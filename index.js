import {Navigation} from 'react-native-navigation';
import * as layoutGenerator from './layoutConverter';
import * as optionsConverter from './optionsConverter';
import {wrapReduxComponent} from './utils';
import ScreenVisibilityListener from './ScreenVisibilityListener';


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
  const component = store ? wrapReduxComponent(generator, store, provider) : generator();

  component.prototype.onNavigationButtonPressed = (id) => {
    if (component.prototype.onNavigatorEvent) {
      component.prototype.onNavigatorEvent({id});
    }
  };
  component.prototype.componentDidAppear = () => {
    if (this.props) {
      this.props.navigator.isVisible = true;
    }
    if (component.prototype.onNavigatorEvent) {
      component.prototype.onNavigatorEvent({id: 'willAppear'});
      component.prototype.onNavigatorEvent({id: 'didAppear'});
    }
  };
  component.prototype.componentDidDisappear = () => {
    if (this.props) {
      this.props.navigator.isVisible = false;
    }
    if (component.prototype.onNavigatorEvent) {
      component.prototype.onNavigatorEvent({id: 'willDisappear'});
      component.prototype.onNavigatorEvent({id: 'didDisappear'});
    }
  };

  Navigation._registerComponent(name, () => component, store, provider);
};


module.exports = {
  Navigation,
  ScreenVisibilityListener
};

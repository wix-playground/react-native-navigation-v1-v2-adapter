import * as React from 'react';
import * as navigationModule from 'react-native-navigation';
import * as layoutGenerator from './layoutConverter';
import * as optionsConverter from './optionsConverter';
import { wrapReduxComponent, logExecution } from './utils';
import ScreenVisibilityListener from './ScreenVisibilityListener';

navigationModule.ScreenVisibilityListener = ScreenVisibilityListener;
const Navigation = navigationModule.Navigation;
let appLaunched = false;
const originalRegisterComponent = Navigation.registerComponent.bind(Navigation);
const originalBindComponent = Navigation.events().bindComponent.bind(Navigation);

Navigation.events().bindComponent = (component) => {
  if (!component.props.componentId && component.props.navigator) {
    component.props = {componentId: component.props.navigator.id, ...component.props};
  }
  return originalBindComponent(component);
}

Navigation.events().registerAppLaunchedListener(() => {
  appLaunched = true;
});

Navigation.startTabBasedApp = ({ tabs, tabsStyle, appStyle, drawer }) => {
  const onAppLaunched = () => {
    appLaunched = true;
    Navigation.setDefaultOptions(optionsConverter.convertStyle({ ...tabsStyle, ...appStyle }));
    Navigation.setRoot({ root: layoutGenerator.convertBottomTabs(tabs, drawer) });
  }

  appLaunched ? onAppLaunched() : Navigation.events().registerAppLaunchedListener(onAppLaunched);
};

Navigation.startSingleScreenApp = ({ screen, tabsStyle, appStyle, drawer, components, passProps }) => {
  const onAppLaunched = () => {
    appLaunched = true;
    Navigation.setDefaultOptions(optionsConverter.convertStyle({ ...tabsStyle, ...appStyle }));
    screen.passProps = passProps;
    Navigation.setRoot({ root: layoutGenerator.convertSingleScreen(screen, drawer, components) });
  }

  appLaunched ? onAppLaunched() : Navigation.events().registerAppLaunchedListener(onAppLaunched);
};

Navigation.registerComponent = (name, generator, store, provider) => {
  const Wrapped = class extends React.Component {
    static get options() {
      const Component = generator();
      if (Component.options) {
        return Component.options;
      }
      const navigatorStyle = Component.navigatorStyle;
      const navigatorButtons = Component.navigatorButtons;
      if (navigatorStyle || navigatorButtons) {
        return optionsConverter.convertStyle(navigatorStyle, navigatorButtons);
      } else {
        return undefined;
      }
    }

    constructor(props) {
      super(props);
      Navigation.events().bindComponent(this);
    }

    componentDidAppear() {
      Navigation.events().registerBottomTabSelectedListener(({selectedTabIndex, unselectedTabIndex}) => {
        if (this._isRegisteredToNavigatorEvents()) {
          const eventType = selectedTabIndex === unselectedTabIndex ? 'bottomTabReselected' : 'bottomTabSelected';
          this.props.navigator.eventFunc({ id: eventType, type: eventType });
        }
      });

      if (this.props && this.props.navigator) {
        this.props.navigator.isVisible = true;
      }
      
      if (this._isRegisteredToNavigatorEvents()) {
        this.props.navigator.eventFunc({ id: 'willAppear' });
        this.props.navigator.eventFunc({ id: 'didAppear' });
      }
    }

    componentDidDisappear() {
      if (this.props && this.props.navigator) {
        this.props.navigator.isVisible = false;
      }

      if (this._isRegisteredToNavigatorEvents()) {
        this.props.navigator.eventFunc({ id: 'willDisappear' });
        this.props.navigator.eventFunc({ id: 'didDisappear' });
      }
    }

    navigationButtonPressed({buttonId}) {
      if (this._isRegisteredToNavigatorEvents()) {
        this.props.navigator.eventFunc(
          {
            id: buttonId,
            type: 'NavBarButtonPress'
          }
        );
      }
    }

    _isRegisteredToNavigatorEvents() {
      return this.props && this.props.navigator && this.props.navigator.eventListeners.length > 0;
    }

    render() {
      const Component = store ? wrapReduxComponent(generator, store, provider) : generator();
      return (
        <Component ref={(r) => this.ref = r} {...this.props} />
      );
    }
  }

  originalRegisterComponent(name, () => Wrapped);
};

Navigation.logExecution = () => {
  logExecution(Navigation);
};

module.exports = {
  Navigation,
  ScreenVisibilityListener
};

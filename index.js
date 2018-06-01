import * as React from 'react';
import {Navigation} from 'react-native-navigation';
import * as layoutGenerator from './layoutConverter';
import * as optionsConverter from './optionsConverter';
import {wrapReduxComponent} from './utils';
import ScreenVisibilityListener from './ScreenVisibilityListener';

const appLaunched = false;
const originalRegisterComponent = Navigation.registerComponent.bind(Navigation);

Navigation.events().registerAppLaunchedListener(() => {
  appLaunched = true;
});

Navigation.startTabBasedApp = ({tabs, tabsStyle, appStyle, drawer}) => {
  const onAppLaunched = () => {
    appLaunched = true;
    Navigation.setDefaultOptions(optionsConverter.convertDefaultOptions(tabsStyle, appStyle));
    Navigation.setRoot({root: layoutGenerator.convertBottomTabs(tabs, drawer)});
  }

  appLaunched ? onAppLaunched() : Navigation.events().registerAppLaunchedListener(onAppLaunched);
};

Navigation.startSingleScreenApp = ({screen, tabsStyle, appStyle, drawer, components}) => {
  const onAppLaunched = () => {
    appLaunched = true;
    Navigation.setDefaultOptions(optionsConverter.convertDefaultOptions(tabsStyle, appStyle));
    Navigation.setRoot({root: layoutGenerator.convertSingleScreen(screen, drawer, components)});
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

    componentWillUnmount() {
      this.originalRef = undefined;
    }

    componentDidAppear() {
      if (this.originalRef.componentDidAppear)
        this.originalRef.componentDidAppear();

      if (this.originalRef && this.originalRef.props) {
        this.originalRef.props.navigator.isVisible = true;
      }
      if (this._isRegisteredToNavigatorEvents()) {
        this.originalRef.props.navigator.eventFunc({id: 'willAppear'});
        this.originalRef.props.navigator.eventFunc({id: 'didAppear'});
      }
    }

    componentDidDisappear() {
      if (this.originalRef.componentDidDisappear)
        this.originalRef.componentDidDisappear();

      if (this.originalRef && this.originalRef.props) {
        this.originalRef.props.navigator.isVisible = false;
      }

      if (this._isRegisteredToNavigatorEvents()) {
        this.originalRef.props.navigator.eventFunc({id: 'willDisappear'});
        this.originalRef.props.navigator.eventFunc({id: 'didDisappear'});
      }
    }

    onNavigationButtonPressed(id) {
      if (this._isRegisteredToNavigatorEvents()) {
        this.originalRef.props.navigator.eventFunc({id});
      }
    }

    _isRegisteredToNavigatorEvents() {
      return this.originalRef && this.originalRef.props && this.originalRef.props.navigator.eventFunc;
    }

    render() {
      const Component = store ? wrapReduxComponent(generator, store, provider) : generator();
      return (
        <Component ref={(r) => this.originalRef = r} {...this.props} />
      );
    }
  }

  originalRegisterComponent(name, () => Wrapped);
};


module.exports = {
  Navigation,
  ScreenVisibilityListener
};

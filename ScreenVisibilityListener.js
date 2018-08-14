import {Navigation} from 'react-native-navigation';

const listeners = [];

export default function ScreenVisibilityListener({willAppear = () => {}, didAppear = () => {}, willDisappear = () => {}, didDisappear = () => {}}) {
  this.register = function () {
    listeners.push(Navigation.events().registerComponentDidAppearListener(({componentId, componentName}) => {
      willAppear({screen: componentName});
      didAppear({screen: componentName});
    }));
    listeners.push(Navigation.events().registerComponentDidDisappearListener(({componentId, componentName}) => {
      willDisappear({screen: componentName});
      didDisappear({screen: componentName});
    }));
  };

  this.unregister = function () {
    listeners.forEach(listener => listener.remove && listener.remove());
    listeners = [];
  };
}
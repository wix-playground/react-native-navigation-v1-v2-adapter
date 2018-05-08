import {Navigation} from 'react-native-navigation';

export default function ScreenVisibilityListener({willAppear = () => {}, didAppear = () => {}, willDisappear = () => {}, didDisappear = () => {}}) {
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
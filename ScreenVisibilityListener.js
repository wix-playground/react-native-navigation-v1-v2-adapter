import {Navigation} from 'react-native-navigation';

export default function ScreenVisibilityListener({willAppear = () => {}, didAppear = () => {}, willDisappear = () => {}, didDisappear = () => {}}) {
  this.register = function () {
    Navigation.events().registerComponentDidAppearListener(({componentId, componentName}) => {
      willAppear({screen: componentName});
      didAppear({screen: componentName});
    });
    Navigation.events().registerComponentDidDisappearListener(({componentId, componentName}) => {
      willDisappear({screen: componentName});
      didDisappear({screen: componentName});
    });
  };

  this.unregister = function () {
    Navigation.events().registerComponentDidAppearListener((componentId, componentName) => {});
    Navigation.events().registerComponentDidDisappearListener((componentId, componentName) => {});
  };
}
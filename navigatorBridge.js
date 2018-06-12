import {Navigation} from 'react-native-navigation';
import * as layoutConverter from './layoutConverter';
import * as optionsConverter from './optionsConverter';
import {generateGuid} from './utils';
import {BackHandler} from 'react-native';

const modalsPresented = [];
const originalShowModal = Navigation.showModal.bind(Navigation);
Navigation.showModal = (params) => {
  setPropsCommandType(params, "ShowModal");
  const layout = layoutConverter.convertComponentStack(params);
  originalShowModal(layout);
  modalsPresented.push(layout.stack.children[0].component.id);
};

export function generateNavigator(component) {
  const navigator = {
    id: generateGuid(),
    isVisible: false,
    eventFunc: undefined,
    push(params) {
      setPropsCommandType(params, "Push");
      appendBackHandlerIfNeeded(this, params);
      appendAnimationType('push', params);
      Navigation.push(this.id, layoutConverter.convertComponent(params));
    },
    pop(params) {
      appendAnimationType('pop', params);
      Navigation.pop(this.id);
    },
    popToRoot() {
      Navigation.popToRoot(this.id);
    },
    resetTo(params) {
      Navigation.setStackRoot(this.id, layoutConverter.convertComponent(params));
    },
    showModal(params) {
      appendBackHandlerIfNeeded(this, params);
      appendAnimationType('showModal', params);
      Navigation.showModal(params);
    },
    dismissModal(params) {
      const topModalComponentId = modalsPresented.pop();
      appendAnimationType('dismissModal', params);
      if (topModalComponentId) {
        Navigation.dismissModal(topModalComponentId);
      }
    },
    dismissAllModals() {
      Navigation.dismissAllModals();
    },
    setButtons(buttons) {
      if (buttons.rightButtons || buttons.leftButtons) {
        Navigation.mergeOptions(this.id, {
          topBar: {
            ...optionsConverter.convertButtons(buttons)
          }
        });
      }
    },
    setTitle({title}) {
      Navigation.mergeOptions(this.id, {
        topBar: {
          title: {
            text: title
          }
        }
      });
    },
    setSubTitle({subtitle}) {
      Navigation.mergeOptions(this.id, {
        topBar: {
          subtitle: {
            text: subtitle
          }
        }
      });
    },
    toggleTabs({to, animated}) {
      Navigation.mergeOptions(this.id, {
        bottomTabs: {
          visible: to === 'shown',
          animated
        }
      });
    },
    toggleDrawer({side, animated}) {
      Navigation.mergeOptions(this.id, {
        sideMenu: {
          [side]: {
            visible: true
          }
        }
      });
    },
    setTabBadge({badge}) {
      Navigation.mergeOptions(this.id, {
        bottomTab: {
          badge
        }
      });
    },
    switchToTab(tabIndex) {
      const options = tabIndex ? {
        currentTabIndex: tabIndex
      } : {
          currentTabId: this.id
        };

      Navigation.mergeOptions(this.id, {
        bottomTabs: options
      });
    },
    toggleNavBar({to, animated}) {
      Navigation.mergeOptions(this.id, {
        topBar: {
          visible: to === 'shown',
          animate: animated
        }
      });
    },
    setStyle(style) {
      Navigation.mergeOptions(this.id, optionsConverter.convertStyle(style));
    },
    screenIsCurrentlyVisible() {
      return this.isVisible;
    },
    addOnNavigatorEvent(func) {
      this.eventFunc = func;
    },
    setOnNavigatorEvent(func) {
      this.eventFunc = func;
    }
  };

  return navigator;
}

function appendAnimationType(method, params) {
  params.animations = {
    [method]: {
      enable: params.animationType === 'none' ? false : true
    }
  }
}

function appendBackHandlerIfNeeded(navigator, params) {
  if (params.overrideBackPress) {
    BackHandler.addEventListener('hardwareBackPress', function () {
      navigator.eventFunc({
        id: 'backPress',
        type: 'NavBarButtonPress'
      });
    });
  }
}

function setPropsCommandType(params, commandType) {
  if (params && params.passProps) {
    params.passProps.commandType = commandType;
  } else {
    params.passProps = {commandType}
  }
}

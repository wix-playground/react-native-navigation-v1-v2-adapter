import {Navigation} from 'react-native-navigation';
import * as layoutConverter from './layoutConverter';
import * as optionsConverter from './optionsConverter';
import {generateGuid} from './utils';
import {BackHandler} from 'react-native';

const modalsPresented = [];
const originalShowModal = Navigation.showModal.bind(Navigation);
const originalDismissModal = Navigation.dismissModal.bind(Navigation);

Navigation.showModal = async (params) => {
  setPropsCommandType(params, "ShowModal");
  mergeAnimationType('showModal', params);
  const layout = layoutConverter.convertComponentStack(params);
  modalsPresented.push(layout.stack.children[0].component.id);
  return await originalShowModal(layout);
};

Navigation.dismissModal = async (params) => {
  const topModalComponentId = modalsPresented.pop();
  if (params) {
    mergeAnimationType('dismissModal', params);
    Navigation.mergeOptions(topModalComponentId, params);
  }

  if (topModalComponentId) {
    return await originalDismissModal(topModalComponentId);
  } else {
    return;
  }
};

export function generateNavigator(component) {
  const navigator = {
    id: generateGuid(),
    isVisible: false,
    eventFunc: undefined,
    push(params) {
      setPropsCommandType(params, "Push");
      appendBackHandlerIfNeeded(this, params);
      mergeAnimationType('push', params);
      Navigation.push(this.id, layoutConverter.convertComponent(params));
    },
    pop(params) {
      mergeAnimationType('pop', params);
      Navigation.pop(this.id);
    },
    popToRoot() {
      Navigation.popToRoot(this.id);
    },
    resetTo(params) {
      Navigation.setStackRoot(this.id, layoutConverter.convertComponent(params));
    },
    async showModal(params) {
      appendBackHandlerIfNeeded(this, params);
      return await Navigation.showModal(params);
    },
    async dismissModal(params) {
      return await Navigation.dismissModal(params);
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
          visible: (to === 'shown' || to === 'show'),
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

function mergeAnimationType(method, params) {
  if (params) {
    const animations = {
      [method]: {
        enable: params.animationType === 'none' ? false : true
      }
    };
    params.animations = {...params.animations, ...animations};
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

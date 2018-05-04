import {Navigation} from 'react-native-navigation';
import * as layoutGenerator from './layoutGenerator';
import * as optionsGenerator from './optionsGenerator';

export function generateNavigator(guid, component) {
  const navigator = {
    id: guid,
    setOnNavigatorEvent() {},
    push(params) {
      Navigation.push(this.id, layoutGenerator.generateComponent(params))
    },
    pop() {
      Navigation.pop(this.id);
    },
    popToRoot() {
      Navigation.popToRoot(this.id);
    },
    resetTo(params) {
      Navigation.setStackRoot(this.id, layoutGenerator.generateComponent(params));
    },
    showModal(params) {
      Navigation.showModal(layoutGenerator.generateComponentStack(params));
    },
    setButtons(buttons) {
      Navigation.mergeOptions(this.id, {
        topBar: {
          ...buttons
        }
      })
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
          visible: to === 'shown' ? true : false,
          animated: animated
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
          badge: badge.toString()
        }
      });
    },
    switchToTab({tabIndex}) {
      Navigation.mergeOptions(this.id, {
        bottomTabs: {
          currentTabIndex: tabIndex
        }
      });
    },
    toggleNavBar({to, animated}) {
      Navigation.mergeOptions(this.id, {
        topBar: {
          visible: to === 'shown' ? true : false,
          animate: animated
        }
      });
    },
    setStyle(style) {
      Navigation.mergeOptions(this.id, optionsGenerator.generateOptionsFromStyle(style));
    },
  }

  return navigator;
}

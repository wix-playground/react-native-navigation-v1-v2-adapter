import {Navigation} from 'react-native-navigation';
import * as layoutGenerator from './layoutGenerator';
import * as optionsConverter from './optionsConverter';

export function generateNavigator(guid, component) {
  const navigator = {
    id: guid,
    setOnNavigatorEvent() {},
    push(params) {
      Navigation.push(this.id, layoutGenerator.generateComponent(params));
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
      });
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
          visible: to === 'shown',
          animate: animated
        }
      });
    },
    setStyle(style) {
      Navigation.mergeOptions(this.id, optionsConverter.convertStyle(style));
    },
  };

  return navigator;
}

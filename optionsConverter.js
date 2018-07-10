import { generateGuid } from './utils';
import { Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';

export function convertStyle(style = {}, buttons = {}) {
  style = { ...style, ...style.navigatorStyle }
  if (style.navigatorButtons) {
    buttons = convertButtons(style.navigatorButtons);
  }
  return {
    screenBackgroundColor: style.screenBackgroundColor,
    orientation: style.orientation,
    statusBar: {
      blur: style.statusBarBlur,
      hideWithTopBar: style.statusBarHideWithNavBar,
      style: style.statusBarTextColorScheme,
      visible: style.statusBarHidden ? !style.statusBarHidden : undefined,
    },
    animations: style.animations,
    popGesture: style.disabledBackGesture ? !style.disabledBackGesture : undefined,
    backgroundImage: style.screenBackgroundImageName,
    rootBackgroundImage: style.rootBackgroundImageName,
    modalPresentationStyle: style.modalPresentationStyle,
    topBar: {
      visible: style.navBarHidden ? !style.navBarHidden : undefined,
      hideOnScroll: style.navBarHideOnScroll,
      buttonColor: style.navBarButtonColor,
      translucent: style.navBarTranslucent,
      transparent: style.navBarTransparent,
      drawBehind: style.drawUnderNavBar,
      noBorder: style.navBarNoBorder,
      blur: style.navBarBlur,
      largeTitle: {
        visible: style.largeTitle
      },
      backButton: {
        image: style.backButtonImage,
        hideTitle: style.hideBackButtonTitle
      },
      backButtonImage: style.backButtonImage,
      hideBackButtonTitle: style.hideBackButtonTitle,
      ...buttons,
      title: {
        text: style.title,
        fontSize: style.navBarTextFontSize,
        color: style.navBarTextColor,
        fontFamily: style.navBarTextFontFamily,
        component: {
          name: style.navBarCustomView,
          alignment: style.navBarComponentAlignment,
          passProps: style.navBarCustomViewInitialProps
        }
      },
      subtitle: {
        text: style.subtitle,
        fontSize: style.navBarSubtitleFontSize,
        color: style.navBarSubtitleColor,
        fontFamily: style.navBarSubtitleFontFamily,
        // alignment: style.?
      },
      background: {
        color: style.navBarBackgroundColor,
        // component: {
        //   // name: style.?
        // }
      }
    },
    bottomTab: {
      text: style.label,
      // badge: style.badge,
      testID: style.testID,
      icon: style.icon,
      selectedIcon: style.selectedIcon,
      iconInsets: style.iconInsets,
      iconColor: style.tabBarButtonColor,
      selectedIconColor: style.tabBarSelectedButtonColor,
      tabBarTextColor: style.tabBarTextColor,
      selectedTextColor: style.tabBarSelectedTextColor
    },
    bottomTabs: {
      visible: style.tabBarHidden ? !style.tabBarHidden : undefined
    },
    // sideMenu: {
    //   left: {
    //     visible: false,
    //     enabled: true
    //   },
    //   right: {
    //     visible: false,
    //     enabled: true
    //   }
    // },
    // overlay: {
    //   interceptTouchOutside: true
    // }
  };
}

export function convertButtons(buttons) {
  const converted = {};
  if (buttons.leftButtons) {
    converted.leftButtons = processButtonsArray(buttons.leftButtons, 'leftButtons');
  }
  if (buttons.rightButtons) {
    converted.rightButtons = processButtonsArray(buttons.rightButtons, 'rightButtons');
  }
  return converted;
}

function processButtonsArray(buttons, type) {
  return buttons.map((button) => {
    if (typeof button.component === 'string') {
      button.component = {
        name: button.component,
        passProps: button.passProps
      };
      button.id = button.id ? button.id : generateGuid();
    }
    if (type === 'leftButtons' && button.id === 'back' && Platform.OS === 'android') {
      button.id = Navigation.constants().backButtonId;
    }
    button.enabled = !button.disabled;
    button.text = button.title;

    return button;
  });
}

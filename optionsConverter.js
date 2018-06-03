import {generateGuid} from './utils';

export function convertStyle(style = {}, buttons = {}) {
  return {
    statusBarHidden: style.statusBarHidden,
    screenBackgroundColor: style.screenBackgroundColor,
    orientation: style.orientation,
    statusBarBlur: style.statusBarBlur,
    statusBarHideWithTopBar: style.statusBarHideWithNavBar,
    statusBarStyle: style.statusBarTextColorSchemeSingleScreen,
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
      largeTitle: style.largeTitle,
      // backButtonImage: style.?,
      // backButtonHidden: style.?,
      // backButtonTitle: style.?,
      // hideBackButtonTitle: style.?,
      // component: ,
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
        // text: style.?,
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
      title: style.label,
      // badge: style.badge,
      testID: style.testID,
      icon: style.icon,
      selectedIcon: style.selectedIcon,
      iconInsets: style.iconInsets
    }
    // bottomTabs: {
    //   visible: !style.tabBarHidden,
    //   // animate: style.?,
    //   // currentTabIndex: style.?,
    //   testID: style.testID,
    //   drawBehind: style.drawUnderTabBar,
    //   // currentTabId: style.?,
    //   // translucent: style.?,
    //   hideShadow: !style.topBarElevationShadowEnabled,
    //   backgroundColor: style.,
    //   tabColor: style.,
    //   selectedTabColor: style.,
    //   fontFamily: style.,
    //   fontSize: style.
    // },
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
  return {
    leftButtons: buttons.leftButtons ? processButtonsArray(buttons.leftButtons) : [],
    rightButtons: buttons.rightButtons ? processButtonsArray(buttons.rightButtons) : []
  };
}

function processButtonsArray(buttons) {
  return buttons.map((button) => {
    if (typeof button.component === 'string') {
      button.component = {
        name: button.component,
        passProps: button.passProps
      };
      button.id = button.id ? button.id : generateGuid();
    }

    return button;
  });
}


export function convertStyle(style) {
  return {
    statusBarHidden: style.statusBarHidden,
    screenBackgroundColor: style.screenBackgroundColor,
    orientation: style.orientation,
    statusBarBlur: style.statusBarBlur,
    statusBarHideWithTopBar: style.statusBarHideWithNavBar,
    statusBarStyle: style.statusBarTextColorSchemeSingleScreen,
    popGesture: !style.disabledBackGesture,
    backgroundImage: style.screenBackgroundImageName,
    rootBackgroundImage: style.rootBackgroundImageName,
    modalPresentationStyle: style.modalPresentationStyle,
    topBar: {
      hideOnScroll: style.navBarHideOnScroll,
      buttonColor: style.navBarButtonColor,
      translucent: style.navBarTranslucent,
      transparent: style.navBarTransparent,
      drawBehind: style.drawUnderNavBar,
      noBorder: style.navBarNoBorder,
      blur: style.navBarBlur,
      largeTitle: style.largeTitle,
      testID: style.testID,
      // backButtonImage: style.?,
      // backButtonHidden: style.?,
      // backButtonTitle: style.?,
      // hideBackButtonTitle: style.?,
      component: {
        // name: style.?
      },
      title: {
        // text: style.?,
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
        component: {
          // name: style.?
        }
      }
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

export function generateDefaultOptions(options = {}) {
  return {
    bottomTabs: {
      // visible: true,
      // animate: false,
      // currentTabIndex: 0,
      // testID: 'bottomTabsTestID',
      // drawBehind: false,
      // currentTabId: 'currentTabId',
      // translucent: true,
      // hideShadow: false,
      backgroundColor: options.tabBarBackgroundColor,
      tabColor: options.tabBarButtonColor,
      selectedTabColor: options.tabBarSelectedButtonColor,
      fontFamily: options.tabFontFamily,
      // fontSize: 10
    }
  };
}

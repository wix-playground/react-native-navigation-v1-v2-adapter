import { generateNavigator } from "./navigator";

export function generateGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4();
}

function generateDrawer(center, left, right) {
  return {
    sideMenu: {
      center,
      left,
      right
    }
  }
}

export function generateSingleScreen(screen, drawer) {
  if (drawer) {
    return generateDrawer(generateSingleScreen(screen), generateComponent(drawer.left), generateComponent(drawer.right));  
  }

  return generateComponentStack(screen);
}

export function generateBottomTabs(tabs, drawer) {
  if (drawer) {
    return generateDrawer(generateBottomTabs(tabs), generateComponent(drawer.left), generateComponent(drawer.right));  
  }

  return {
    bottomTabs: {
      children: tabs.map(tab => {
        return generateComponentStack(tab);
      })
    }
  }
}

export function generateBottomTabsChildren(tabs) {
  return tabs.map(tab => {
    return generateComponentStack(tab);
  });
}

export function generateComponent(oldComponent) {
  if (!oldComponent) {
    return undefined;
  }

  const guid = generateGuid();
  const component = {
    id: guid,
    name: oldComponent.screen,
    passProps: {
      navigator: generateNavigator(guid, oldComponent)
    },
    options: generateComponentOptions(oldComponent)
  }

  return { component };
}

function generateComponentOptions(component) {
  return {
    topBar: {
      title: {
        text: component.title
      }
    },
    bottomTab: {
      title: component.label,
      icon: component.icon
    }
  }
}

export function generateDefaultOptions(options) {
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
  }
}

export function generateComponentStack(oldComponent) {
  return {
    stack: {
      children: [generateComponent(oldComponent)]
    }
  }
}
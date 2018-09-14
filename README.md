# react-native-navigation-v1-v2-adapter - WIP

React Native Navigation v1 to v2 adapter

[![npm (tag)](https://img.shields.io/npm/v/react-native-navigation-v1-v2-adapter/latest.svg)](https://github.com/wix-playground/react-native-navigation-v1-v2-adapter#react-native-navigation-v1-v2-adapter---wip)
[![Build Status](https://travis-ci.org/wix-playground/react-native-navigation-v1-v2-adapter.svg?branch=master)](https://travis-ci.org/wix-playground/react-native-navigation-v1-v2-adapter)

# Installing

## Requirements

- node >= 8
- react-native >= 0.51

## npm

```
npm uninstall react-native-navigation
npm install --save react-native-navigation-v1-v2-adapter
```

## JS

The adapter does its magic by swizzling a few method and adding another set of methods to the `Navigation` object. Therefor you need to ensure you're using the modified `Navigation` object and to do so, you have two options:

1.  _The easy way_. Execute the adapter's static code first when your Js code starts running. Simply import `Navigation` from the adapter at the top of your `index.js` file.

    ```js
    import {
      Navigation,
      ScreenVisibilityListener
    } from "react-native-navigation-v1-v2-adapter";
    ```

2.  _The hard way_. Replace all import statements across your codebase:

    ```js
    import {
      Navigation,
      ScreenVisibilityListener
    } from "react-native-navigation";
    ```

    With:

    ```js
    import {
      Navigation,
      ScreenVisibilityListener
    } from "react-native-navigation-v1-v2-adapter";
    ```

## iOS

First, make sure you have the 2.x version of React Native Navigation installed.

```
npm install --save react-native-navigation@2
```

or

```
yarn add react-native-navigation@2
```


2.  In Xcode, in Project Navigator (left pane), right-click on the `Libraries` > `Add files to [project name]`. Add `node_modules/react-native-navigation/lib/ios/ReactNativeNavigation.xcodeproj` ([screenshots](https://facebook.github.io/react-native/docs/linking-libraries-ios.html#manual-linking)).

    (it may install RNN v2 inside react-native-navigation-v1-v2-adapter, in such case the path will be: `node_modules/react-native-navigation-v1-v2-adapter/node_modules/react-native-navigation/lib/ios/ReactNativeNavigation.xcodeproj`

3.  In Xcode, in Project Navigator (left pane), click on your project (top), then click on your _target_ row (on the "project and targets list", which is on the left column of the right pane) and select the `Build Phases` tab (right pane). In the `Link Binary With Libraries` section add `libReactNativeNavigation.a` ([screenshots](https://facebook.github.io/react-native/docs/linking-libraries-ios.html#step-2)).

4.  In Xcode, you will need to edit this file: `AppDelegate.m`. This function is the main entry point for your app:

    ```objectivec
     - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions { ... }
    ```

    Its content should look like this:

    ```objectivec
    #import "AppDelegate.h"

    #import <React/RCTBundleURLProvider.h>
    #import <React/RCTRootView.h>
    #import <ReactNativeNavigation/ReactNativeNavigation.h>

    @implementation AppDelegate

    - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
    {
    	NSURL *jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
    	[ReactNativeNavigation bootstrap:jsCodeLocation launchOptions:launchOptions];

    	return YES;
    }

    @end
    ```

## Android

1.  update `build.gradle`

    ```diff
    buildscript {
        repositories {
            google()
            jcenter()
        }
        dependencies {
    -        classpath 'com.android.tools.build:gradle:3.0.1'
    +        classpath 'com.android.tools.build:gradle:3.1.2'

            // NOTE: Do not place your application dependencies here; they belong
            // in the individual module build.gradle files
        }
    }
    ```

2.  Update `gradle-wrapper.properties`

    ```diff
     distributionBase=GRADLE_USER_HOME
     distributionPath=wrapper/dists
     zipStoreBase=GRADLE_USER_HOME
     zipStorePath=wrapper/dists
    -distributionUrl=https\://services.gradle.org/distributions/gradle-4.1-all.zip
    +distributionUrl=https\://services.gradle.org/distributions/gradle-4.4-all.zip
    ```

3.  Update `app/build.gradle`

    ```diff
    android {
    	compileSdkVersion 25
    -        buildToolsVersion '26.0.2'
    +        buildToolsVersion '27.0.3'

    ...
    +   compileOptions {
    +       sourceCompatibility JavaVersion.VERSION_1_8
    +       targetCompatibility JavaVersion.VERSION_1_8
    +   }
    }

    dependencies {
    //   Change all `compile` statements to `implementation`
    -    compile fileTree(dir: 'libs', include: ['*.jar'])
    -    compile 'com.facebook.react:react-native:+'
    -    compile project(':react-native-navigation')
    +    implementation fileTree(dir: 'libs', include: ['*.jar'])
    +    implementation 'com.facebook.react:react-native:+'
    +    implementation project(':react-native-navigation')
     }
    ```

4.  Update `setting.gradle`

    ```diff
    include ':app'
    -project(':react-native-navigation').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-navigation/android/app/')
    +project(':react-native-navigation').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-navigation/lib/android/app/')
    ```

5.  Edit `MainApplication.java` - Only if your app has a single index file

        	```diff
        	public class MainApplication extends NavigationApplication {

        	-    @Nullable
        	-    @Override
        	-    public String getJSMainModuleName() {
        	-        return "index";
        	-    }

    - @Override
    - protected ReactNativeHost createReactNativeHost() {
    -        return new NavigationReactNativeHost(this) {
    -            @Override
    -            protected String getJSMainModuleName() {
    -                return "index";
    -            }
    -        };
    - }
      }
      ```

6.  Edit `MainActivity.java`

        	```diff

    - public class MainActivity extends NavigationActivity {

    * public class MainActivity extends SplashActivity {

          	}

          	```

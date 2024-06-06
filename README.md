## Some libraries you will need.

1. node.js and npm, can install these through homebrew (package manager) or https://nodejs.org/en
2. ensure these are working in the terminal with node -v and npm -v
3. git, install by https://www.git-scm.com/downloads
4. ensure this is working with git --version
5. cocoapods, https://www.cocoapods.org/
6. ensure by pod --version
7. java 17, homebrew or website (if homebrew, i did it through homebrew so to make it work make sure to run the commands they give you for symlink and path)
8. check with java --version
9. xcode, android studio, these are simulators for the most part, can substitute with whatever works
10. setup their respective simulators
11. android: https://reactnative.dev/docs/0.70/environment-setup?guide=native&platform=android

## VScode setup

1. open new vscode window, files section should be empty
2. click clone repository
3. enter in the github repository link (go to the github and click code and clone, copy that git link)
4. respository should be cloned.
5. go to the root directory of the project, then npm install
6. cd ios, then pod install
7. cd android, then ./gradlew wrapper

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

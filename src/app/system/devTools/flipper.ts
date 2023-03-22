/**
 * Flipper devtools plugins can go here.
 * @see https://fbflipper.com/, https://github.com/hbmartin/awesome-flipper-plugins
 */

export const setupFlipper = () => {
  if (__DEV__) {
    require("react-native-flipper-relay-devtools").addPlugin()
  }
}

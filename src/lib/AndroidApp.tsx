import React, { Component } from "react"
import { Animated, StyleSheet, Text, View } from "react-native"
import Config from "react-native-config"
import { ScrollView } from "react-native-gesture-handler"
import { RectButton } from "react-native-gesture-handler"
import Swipeable from "react-native-gesture-handler/Swipeable"

class AppleStyleSwipeableRow extends Component {
  renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    })
    return (
      <RectButton onPress={() => console.log("wok")}>
        <Animated.Text
          style={[
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          Archive
        </Animated.Text>
      </RectButton>
    )
  }
  render() {
    return (
      <Swipeable renderLeftActions={this.renderLeftActions}>
        <Text>"hello"</Text>
      </Swipeable>
    )
  }
}

export const App = () => (
  <ScrollView>
    <Text>Android!!</Text>
    <AppleStyleSwipeableRow />
    <Text>Android!!</Text>
    <Text>our id is: {Config.ARTSY_FACEBOOK_APP_ID}</Text>
  </ScrollView>
)

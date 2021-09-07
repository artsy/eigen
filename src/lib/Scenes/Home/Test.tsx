import React, { Component } from "react"
import RNBootSplash from "react-native-bootsplash"
import { PanGestureHandler } from "react-native-gesture-handler"
import Animated from "react-native-reanimated"

const circleRadius = 30
export class Test extends Component {
  _touchX = new Animated.Value(400 / 2 - circleRadius)
  _onPanGestureEvent = Animated.event([{ nativeEvent: { x: this._touchX } }], {
    useNativeDriver: true,
  })

  componentDidMount() {
    RNBootSplash.hide()
  }

  render() {
    return (
      <PanGestureHandler onGestureEvent={this._onPanGestureEvent}>
        <Animated.View
          style={{
            height: 150,
            justifyContent: "center",
          }}
        >
          <Animated.View
            style={[
              {
                backgroundColor: "#42a5f5",
                borderRadius: circleRadius,
                height: circleRadius * 2,
                width: circleRadius * 2,
              },
              {
                transform: [
                  {
                    translateX: Animated.add(this._touchX, new Animated.Value(-circleRadius)),
                  },
                ],
              },
            ]}
          />
        </Animated.View>
      </PanGestureHandler>
    )
  }
}

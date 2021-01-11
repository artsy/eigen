import { ParamListBase } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { isPad } from "lib/utils/hardware"
import React from "react"
import { TouchableWithoutFeedback, ViewProperties } from "react-native"
import { Image } from "../Elements/Image"

interface ContainerWithBackButtonProps extends ViewProperties {
  navigation: StackNavigationProp<ParamListBase>
}

export class BackButton extends React.Component<ContainerWithBackButtonProps> {
  goBack() {
    this.props.navigation.goBack()
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.goBack()}>
        <Image
          position="absolute"
          top={isPad() ? "10px" : "14px"}
          left={isPad() ? "20px" : "10px"}
          source={require("../../../../../images/angle-left.png")}
          style={{ zIndex: 10 }} // Here the style prop is intentionally used to avoid making zIndex too handy.
        />
      </TouchableWithoutFeedback>
    )
  }
}

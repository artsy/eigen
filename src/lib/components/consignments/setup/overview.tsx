import * as React from "react"
import { NavigatorIOS, Route, View, ViewProperties } from "react-native"
import { LargeHeadline, Subtitle } from "../typography"

import TODO from "../components/artwork_consignment_todo"
import Welcome from "./welcome"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route // this gets set by NavigatorIOS
}

export default class Info extends React.Component<Props, any> {
  goTapped = () => {
    this.props.navigator.push({
      component: Welcome,
    })
  }
  render() {
    const title = "Complete work details to submit"
    const subtitle = "Provide as much detail as possible so that our partners can best assess your work."
    return (
      <View style={{ backgroundColor: "black", flex: 1 }}>
        <LargeHeadline>{title}</LargeHeadline>
        <Subtitle>{subtitle}</Subtitle>

        <TODO />
      </View>
    )
  }
}

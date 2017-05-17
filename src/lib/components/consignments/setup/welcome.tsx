import * as React from "react"
import * as Relay from "react-relay"
import Button from "../../buttons/inverted_button"
import Info from "./info"

import {
  LayoutChangeEvent,
  NavigatorIOS,
  Route,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
  ViewProperties,
} from "react-native"

interface Props extends ViewProperties {
  navigator: NavigatorIOS,
  route: Route // this gets set by NavigatorIOS
}

export default class Welcome extends React.Component<Props, any> {
  goTapped = () => {
    this.props.navigator.push({
      component: Info,
    })
  }

  render() {
    return  (
      <View style={{marginTop: 20, backgroundColor: "green"}}>
        <Text>Hello this is the welcome</Text>
        <View style={{height: 26, width: 320, marginTop: 20}}>
          <Button text="Go" onPress={this.goTapped}/>
        </View>
      </View>
    )
  }
}

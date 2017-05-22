import * as React from "react"
import Button from "../../buttons/inverted_button"
import Welcome from "./welcome"

import {
  NavigatorIOS,
  Route,
  Text,
  View,
  ViewProperties,
} from "react-native"

interface Props extends ViewProperties {
  navigator: NavigatorIOS,
  route: Route // this gets set by NavigatorIOS
}

export default class Info extends React.Component<Props, any> {
  goTapped = () => {
    this.props.navigator.push({
      component: Welcome,
    })
  }

  render() {
    return  (
      <View>
        <Text>Hello this is the info</Text>
        <View style={{height: 26, width: 320, marginBottom: 20}}>
          <Button text="Go" onPress={this.goTapped}/>
        </View>

      </View>
    )
  }
}

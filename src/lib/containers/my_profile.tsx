import * as React from "react"
import * as Relay from "react-relay"

import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  ViewProperties,
  ViewStyle,
} from "react-native"

import Headline from "../components/text/headline"

import { SwitchEvent } from "../components/switch_view"
import TabView from "../components/tab_view"

const isPad = Dimensions.get("window").width > 700

interface Props extends ViewProperties {
  artist: any
}

export class MyProfile extends React.Component<Props, {}> {
  state: {
    selectedTabIndex: number,
  }

  render() {
    const windowDimensions = Dimensions.get("window")
    const commonPadding = windowDimensions.width > 700 ? 40 : 20

    return (
      <ScrollView scrollsToTop={true} automaticallyAdjustContentInsets={false}>
        <View style={{ paddingLeft: commonPadding, paddingRight: commonPadding }}>
          <Headline>Hi</Headline>
        </View>
      </ScrollView>
    )
  }
}

interface Styles {
  tabView: ViewStyle,
}

const styles = StyleSheet.create<Styles>({
  tabView: {
    width: isPad ? 330 : null,
    marginTop: 30,
    marginBottom: 30,
    alignSelf: isPad ? "center" : null,
  },
})

export default Relay.createContainer(MyProfile, {
  fragments: {
    me: () => Relay.QL`
      query {
        me {
          name
        }
      }
    `,
  },
})

interface RelayProps {
  artist: {
    _id: string,
    id: string,
    has_metadata: boolean | null,
    counts: {
      artworks: boolean | number | string | null,
      partner_shows: boolean | number | string | null,
      related_artists: boolean | number | string | null,
      articles: boolean | number | string | null,
    } | null,
  },
}

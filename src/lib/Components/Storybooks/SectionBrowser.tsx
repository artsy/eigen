import * as React from "react"
import { ListView, NavigatorIOS, Route, TouchableHighlight, View, ViewProperties } from "react-native"

import { StorySection } from "./"
import StoryBrowser from "./StoryBrowser"
import { Background, BodyText, Separator, Title } from "./Styles"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route
  section: StorySection
}

const render = (props: Props) => {
  const Headline = () =>
    <Title>
      {props.section.kind}
    </Title>

  const ListViewItem = (item: StorySection) => {
    const showStoriesForSection = () => {
      if (item.stories) {
        props.navigator.push({ title: item.kind, component: StoryBrowser, passProps: { section: item } })
      } else {
        props.navigator.push({ title: item.kind, component: StorybookBrowser, passProps: { section: item } })
      }
    }

    return (
      <View key={item.kind}>
        <TouchableHighlight onPress={showStoriesForSection}>
          <BodyText>
            {item.kind}
          </BodyText>
        </TouchableHighlight>
        <Separator />
      </View>
    )
  }

  const storybookDS = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(
    props.section.sections
  )

  return (
    <Background>
      <ListView style={{ flex: 1 }} dataSource={storybookDS} renderRow={ListViewItem} renderHeader={Headline} />
    </Background>
  )
}

export default class StorybookBrowser extends React.Component<Props, null> {
  render() {
    return render(this.props)
  }
}

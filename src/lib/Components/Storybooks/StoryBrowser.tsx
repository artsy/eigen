import * as React from "react"
import { ListView, NavigatorIOS, Route, TouchableHighlight, View, ViewProperties } from "react-native"

import { Story, StorySection } from "./"
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

  const ListViewItem = (item: Story) => {
    const showStory = () => {
      props.navigator.push({ title: item.name, component: item.render as any })
    }

    return (
      <View key={item.name}>
        <TouchableHighlight onPress={showStory}>
          <BodyText>
            {item.name}
          </BodyText>
        </TouchableHighlight>
        <Separator />
      </View>
    )
  }

  const storybookDS = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(
    props.section.stories
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

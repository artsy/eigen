import React from "react"
import { FlatList, Route, TouchableHighlight, View, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"

import { StorySection } from "./"
import StoryBrowser from "./StoryBrowser"
import { Background, BodyText, Separator, Title } from "./Styles"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route
  section: StorySection
}

const render = (props: Props) => {
  const renderItem = (item: StorySection) => {
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
          <BodyText>{item.kind}</BodyText>
        </TouchableHighlight>
        <Separator />
      </View>
    )
  }

  return (
    <Background>
      <FlatList
        style={{ flex: 1 }}
        data={props.section.sections}
        keyExtractor={(item, index) => item.kind + String(index)}
        renderItem={({ item }) => {
          return renderItem(item)
        }}
        ListHeaderComponent={() => <Title>{props.section.kind}</Title>}
      />
    </Background>
  )
}

export default class StorybookBrowser extends React.Component<Props, null> {
  render() {
    return render(this.props)
  }
}

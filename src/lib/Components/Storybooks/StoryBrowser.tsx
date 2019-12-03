import React from "react"
import { FlatList, Route, TouchableHighlight, View, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"

import { Story, StorySection } from "./"
import { Background, BodyText, Separator, Title } from "./Styles"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route
  section: StorySection
}

const render = (props: Props) => {
  const renderItem = (item: Story) => {
    const showStory = () => {
      props.navigator.push({ title: item.name, component: item.render as any })
    }

    return (
      <View key={item.name}>
        <TouchableHighlight onPress={showStory}>
          <BodyText>{item.name}</BodyText>
        </TouchableHighlight>
        <Separator />
      </View>
    )
  }

  return (
    <Background>
      <FlatList
        style={{ flex: 1 }}
        data={props.section.stories}
        keyExtractor={(item, index) => item.name + String(index)}
        renderItem={({ item }) => renderItem(item)}
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

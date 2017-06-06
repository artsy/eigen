import "./consignments.story"
import "./style.story"

import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"

import * as bottomAlignedButton from "./bottom_aligned.story"
import * as search from  "./search.story"
import * as todo from  "./todo.story"

// Just a quick interface so you know the API
export interface AutoStory {
  name: string,
  allStates: any[],
  component: any
}

// Converts a set of state and a component type into a set of stories
const autoStories: AutoStory[] = [
  search,
  bottomAlignedButton,
  todo,
]

const Wrapper = (props) =>
  <View style={{flex: 1, backgroundColor: "black", padding: 20, marginTop: 60}}>
    {props.children}
  </View>

// Allows stories to strictly be about their state and the
// component itself.

autoStories.forEach(storybook => {
  const stories = storiesOf(storybook.name)

  storybook.allStates.forEach(element => {
    const name = Object.keys(element)[0]
    stories.add(name, () =>
      <Wrapper>
        <storybook.component {...element[name]} />
      </Wrapper>,
    )
  })
})

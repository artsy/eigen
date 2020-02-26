import { Join, Spacer } from "@artsy/palette"
import React from "react"
import { ScrollView as RNScrollView } from "react-native"
import styled from "styled-components"

export const CardScrollView: React.FC = ({ children }) => (
  <ScrollView
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    scrollsToTop={false}
    contentContainerStyle={{ paddingHorizontal: 20 }}
  >
    <Join separator={<Spacer width="15px" />}>{React.Children.toArray(children)}</Join>
  </ScrollView>
)

const ScrollView = styled(RNScrollView)`
  flex-grow: 1;
  flex-direction: row;
  margin-top: 10px;
  margin-bottom: 25px;
`

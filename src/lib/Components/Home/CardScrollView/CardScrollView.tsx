import { Join, Spacer } from "@artsy/palette"
import React from "react"
import styled from "styled-components/native"

export const CardScrollView: React.FC = ({ children }) => (
  <ScrollView>
    <Join separator={<Spacer width="15px" />}>{React.Children.toArray(children)}</Join>
  </ScrollView>
)

const ScrollView = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  scrollsToTop: false,
  contentContainerStyle: {
    paddingHorizontal: 20,
  },
})`
  flex-grow: 1;
  flex-direction: row;
  margin-top: 10px;
  margin-bottom: 25px;
`

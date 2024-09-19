import { Flex } from "@artsy/palette-mobile"
import { HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT } from "app/Scenes/HomeView/HomeView"
import React from "react"

export const HomeViewSectionWrapper: React.FC = ({ children }) => {
  return <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>{children}</Flex>
}

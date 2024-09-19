import { ContextModule } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import VisibilitySensor from "@svanboxel/visibility-sensor-react-native"
import { HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT } from "app/Scenes/HomeView/HomeView"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import React from "react"

interface HomeViewSectionWrapperProps {
  children: React.ReactNode
  sectionID?: string
}

export const HomeViewSectionWrapper: React.FC<HomeViewSectionWrapperProps> = ({
  children,
  sectionID,
}) => {
  const { viewedSection } = useHomeViewTracking()
  const handleImageVisibility = () => {
    // TODO REVIERT
    if (sectionID) {
      viewedSection(sectionID as ContextModule)
    }
  }

  // We only track section views if we have a sectionID
  if (sectionID) {
    return (
      <VisibilitySensor onChange={handleImageVisibility}>
        <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>{children}</Flex>
      </VisibilitySensor>
    )
  }

  return <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>{children}</Flex>
}

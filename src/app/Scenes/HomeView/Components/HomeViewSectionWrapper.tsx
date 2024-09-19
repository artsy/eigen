import { ContextModule } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import VisibilitySensor from "@svanboxel/visibility-sensor-react-native"
import { HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT } from "app/Scenes/HomeView/HomeView"
import { HomeViewStore } from "app/Scenes/HomeView/HomeViewContext"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import React, { useCallback } from "react"

interface HomeViewSectionWrapperProps {
  children: React.ReactNode
  contextModule?: ContextModule
}

export const HomeViewSectionWrapper: React.FC<HomeViewSectionWrapperProps> = ({
  children,
  contextModule,
}) => {
  const { viewedSection } = useHomeViewTracking()
  const addTrackedSection = HomeViewStore.useStoreActions((actions) => actions.addTrackedSection)
  const trackedSections = HomeViewStore.useStoreState((state) => state.trackedSections)

  const handleImageVisibility = useCallback(() => {
    if (contextModule && !trackedSections.includes(contextModule)) {
      viewedSection(contextModule as ContextModule)
      addTrackedSection(contextModule)
    }
  }, [contextModule, viewedSection, addTrackedSection, trackedSections])

  // We only track section views if we have a contextModule
  if (contextModule) {
    return (
      <VisibilitySensor onChange={handleImageVisibility}>
        <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>{children}</Flex>
      </VisibilitySensor>
    )
  }

  return <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>{children}</Flex>
}

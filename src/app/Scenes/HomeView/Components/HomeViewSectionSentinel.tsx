import { ContextModule } from "@artsy/cohesion"
import { HomeViewStore } from "app/Scenes/HomeView/HomeViewContext"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { Sentinel } from "app/utils/Sentinel"
import React, { useCallback } from "react"

interface HomeViewSectionSentinelProps {
  contextModule: ContextModule
}

export const HomeViewSectionSentinel: React.FC<HomeViewSectionSentinelProps> = ({
  contextModule,
}) => {
  const { viewedSection } = useHomeViewTracking()
  const addTrackedSection = HomeViewStore.useStoreActions((actions) => actions.addTrackedSection)
  const trackedSections = HomeViewStore.useStoreState((state) => state.trackedSections)

  const handleImageVisibility = useCallback(
    (visible) => {
      if (visible && contextModule && !trackedSections.includes(contextModule)) {
        viewedSection(contextModule as ContextModule)
        addTrackedSection(contextModule)
      }
    },
    [contextModule, viewedSection, addTrackedSection, trackedSections]
  )

  return <Sentinel onAppear={handleImageVisibility} />
}

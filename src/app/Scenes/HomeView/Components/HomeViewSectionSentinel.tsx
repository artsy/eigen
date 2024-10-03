import { ContextModule } from "@artsy/cohesion"
import { HomeViewStore } from "app/Scenes/HomeView/HomeViewContext"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { Sentinel } from "app/utils/Sentinel"
import React, { useCallback } from "react"

interface HomeViewSectionSentinelProps {
  contextModule: ContextModule
  index: number
}

export const HomeViewSectionSentinel: React.FC<HomeViewSectionSentinelProps> = ({
  contextModule,
  index,
}) => {
  const { viewedSection } = useHomeViewTracking()
  const addTrackedSection = HomeViewStore.useStoreActions((actions) => actions.addTrackedSection)
  const trackedSections = HomeViewStore.useStoreState((state) => state.trackedSections)

  const handleImageVisibility = useCallback(
    (visible) => {
      if (visible && !trackedSections.includes(contextModule)) {
        viewedSection(contextModule as ContextModule, index)
        addTrackedSection(contextModule)
      }
    },
    [contextModule, viewedSection, addTrackedSection, trackedSections]
  )

  return <Sentinel onChange={handleImageVisibility} />
}

import { ContextModule } from "@artsy/cohesion"
import { HomeViewStore } from "app/Scenes/HomeView/HomeViewContext"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { Sentinel } from "app/utils/Sentinel"
import React, { useCallback } from "react"

interface HomeViewSectionSentinelProps {
  contextModule: ContextModule
  sectionType?: string
  index: number
}

export const HomeViewSectionSentinel: React.FC<HomeViewSectionSentinelProps> = ({
  contextModule,
  sectionType,
  index,
}) => {
  const { viewedSection } = useHomeViewTracking()
  const addTrackedSection = HomeViewStore.useStoreActions((actions) => actions.addTrackedSection)
  const trackedSections = HomeViewStore.useStoreState((state) => state.trackedSections)
  const addTrackedSectionTypes = HomeViewStore.useStoreActions(
    (actions) => actions.addTrackedSectionTypes
  )

  const handleVisibilityChange = useCallback(
    (visible: boolean) => {
      if (visible && !trackedSections.includes(contextModule)) {
        viewedSection(contextModule as ContextModule, index)
        addTrackedSection(contextModule)
        if (sectionType) {
          addTrackedSectionTypes(sectionType)
        }
      }
    },
    [contextModule, viewedSection, addTrackedSection, trackedSections]
  )

  return <Sentinel onChange={handleVisibilityChange} />
}

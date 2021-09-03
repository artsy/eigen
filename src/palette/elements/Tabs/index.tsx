import { usePaletteFlagStore } from "palette/PaletteFlag"
import React from "react"
import { ContentTabs } from "./ContentTabs"
import { NavigationalTabs } from "./NavigationalTabs"
import { StepTabs } from "./StepTabs"
import { TabV3, TabV3Props } from "./Tab"
import { TabV2 } from "./TabsV2"

export { NavigationalTabs, ContentTabs, StepTabs }

export const Tab = ({ ...props }: TabV3Props) => {
  const allowV3 = usePaletteFlagStore((state) => state.allowV3)
  if (allowV3) {
    return <TabV3 {...props} />
  }
  return <TabV2 {...props} />
}

export const TAB_BAR_HEIGHT = 44

export type TabsType = Array<{
  label: string
  completed?: boolean
}>

export interface TabsProps {
  onTabPress: (tabIndex: number) => void
  activeTab: number
  tabs: TabsType
}

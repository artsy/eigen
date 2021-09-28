import React from "react"
import { ContentTabs } from "./ContentTabs"
import { NavigationalTabs } from "./NavigationalTabs"
import { StepTabs } from "./StepTabs"
import { TabV3, TabV3Props } from "./Tab"

export { NavigationalTabs, ContentTabs, StepTabs }

export const Tab = ({ ...props }: TabV3Props) => {
  return <TabV3 {...props} />
}

export const TAB_BAR_HEIGHT = 44

export type TabsType = Array<{
  label: string
  superscript?: string
  completed?: boolean
}>

export interface TabsProps {
  onTabPress: (tablabel: string, tabIndex: number) => void
  activeTab: number
  tabs: TabsType
}

/**
 * TODO: This folder can be deleted once the new react-collapsible-tabs-view
 * tabs are used everywhere.
 */

import { TabVisualClues } from "app/Components/StickyTabPage/StickyTabPage"
import { ContentTabs } from "./ContentTabs"
import { NavigationalTabs } from "./LegacyNavigationalTabs"
import { StepTabs } from "./LegacyStepTabs"
export * from "./LegacyTab"

export { NavigationalTabs, ContentTabs, StepTabs }

export const TAB_BAR_HEIGHT = 44

export type TabsType = Array<{
  label: string
  superscript?: string
  completed?: boolean
  visualClues?: TabVisualClues
}>

export interface TabsProps {
  onTabPress: (tablabel: string, tabIndex: number) => void
  activeTab: number
  tabs: TabsType
}

import { TabVisualClues } from "app/Components/StickyTabPage/StickyTabPage"
import { VisualClueName } from "app/store/config/visualClues"
import { ContentTabs } from "./ContentTabs"
import { NavigationalTabs } from "./NavigationalTabs"
import { StepTabs } from "./StepTabs"
export * from "./Tab"

export { NavigationalTabs, ContentTabs, StepTabs }

export const TAB_BAR_HEIGHT = 44

export type TabsType = Array<{
  label: string
  superscript?: string
  visualClue?: VisualClueName
  completed?: boolean
  visualClues?: TabVisualClues
}>

export interface TabsProps {
  onTabPress: (tablabel: string, tabIndex: number) => void
  activeTab: number
  tabs: TabsType
}

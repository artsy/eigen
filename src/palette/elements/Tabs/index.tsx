import { usePaletteFlagStore } from "palette/PaletteFlag"
import React from "react"
import { ContentTabs } from "./ContentTabs"
import { NavigationTabs } from "./NavigationTabs"
import { StepTabs } from "./StepTabs"
import { TabProps, TabV3 } from "./Tab"
import { TabsType } from "./tabHelpers"
import { TabV2 } from "./TabsV2"

export { NavigationTabs, ContentTabs, StepTabs }

export const Tab = ({ ...props }: TabProps) => {
  const allowV3 = usePaletteFlagStore((state) => state.allowV3)
  if (allowV3) {
    return <TabV3 {...props} />
  }
  return <TabV2 {...props} />
}

export { TabsType }

import { storiesOf } from "@storybook/react-native"
import React, { useState } from "react"
import { View } from "react-native"
import { TabsProps, TabsType } from "."
import { ContentTabs } from "./ContentTabs"
import { NavigationalTabs } from "./NavigationalTabs"
import { StepTabs } from "./StepTabs"

interface WrapperProps {
  component: React.FC<TabsProps>
  tabs: TabsType
}

const Wrapper: React.FC<WrapperProps> = ({ component: Component, tabs }) => {
  const [activeTab, setActiveTab] = useState(0)
  return (
    <View style={{ marginTop: 50 }}>
      <Component tabs={tabs} onTabPress={(_, index) => setActiveTab(index)} activeTab={activeTab} />
    </View>
  )
}

storiesOf("Navigational Tabs", module)
  .add("With 3 Tabs", () => {
    const tabs: TabsType = [{ label: "Artist" }, { label: "Artworks" }, { label: "Insights" }]
    return <Wrapper component={NavigationalTabs} tabs={tabs} />
  })
  .add("With 2 Tabs", () => {
    const tabs: TabsType = [{ label: "Artist" }, { label: "Artworks" }]
    return <Wrapper tabs={tabs} component={NavigationalTabs} />
  })
  .add("With superscript", () => {
    const tabs: TabsType = [{ label: "Artist" }, { label: "Artworks", superscript: "Beta" }]
    return <Wrapper tabs={tabs} component={NavigationalTabs} />
  })

storiesOf("Content Tabs", module).add("ContentTabs", () => {
  const tabs: TabsType = [
    { label: "Artist" },
    { label: "Artworks" },
    { label: "Insights" },
    { label: "Artist Two" },
    { label: "Long Artworks Artworks" },
    { label: "An Insight" },
  ]
  return <Wrapper tabs={tabs} component={ContentTabs} />
})

storiesOf("Step Tabs", module)
  .add("Step Tabs with step 1 completed", () => {
    const tabs: TabsType = [
      { label: "Step 1", completed: true },
      { label: "Step 2" },
      { label: "Step 3" },
    ]
    return <Wrapper tabs={tabs} component={StepTabs} />
  })
  .add("Step Tabs with NO step completed", () => {
    const tabs: TabsType = [{ label: "Step 1" }, { label: "Step 2" }, { label: "Step 3" }]
    return <Wrapper tabs={tabs} component={StepTabs} />
  })

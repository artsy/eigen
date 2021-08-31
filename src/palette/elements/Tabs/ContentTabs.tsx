import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { MutableRefObject } from "react"
import { ScrollView, View, ViewStyle } from "react-native"
import { useColor } from "../../hooks"
import { Box } from "../Box"
import { Tab } from "./Tab"

interface TabAttributes {
  width: number
  height: number
  px: number
  py: number
  fx: number
  fy: number
}
interface ItemProps {
  active: boolean
  getTabAttributes: (attributes: TabAttributes) => void
  setActiveTabRef: (current: View) => void
  style: ViewStyle
  label: string
  onPress: () => void
}

const TabItem: React.FC<ItemProps> = ({ active, getTabAttributes, label, onPress, setActiveTabRef }) => {
  const color = useColor()
  const [boxWidth, setBoxWidth] = useState(0)
  const boxRef = useRef<View>(null)
  // const setActiveTabRefOnParent = (current: View) => {
  //   setActiveTabRef(current)
  // }
  useEffect(() => {
    if (active && !!boxRef.current) {
      boxRef.current.measure((width, height, px, py, fx, fy) => {
        const tabAttributes = {
          fx,
          fy,
          px,
          py,
          width,
          height,
        }
        console.log("location", tabAttributes)
        getTabAttributes(tabAttributes)
        // setActiveTabRefOnParent(boxRef.current as View)
      })
    }
  }, [active])
  return (
    <View ref={boxRef} onLayout={({ nativeEvent }) => setBoxWidth(nativeEvent.layout.width)}>
      <Tab style={{ paddingHorizontal: 8 }} label={label} onPress={onPress} active={active} />
      {!!active && <Box height={2} backgroundColor={color("black100")} width={boxWidth} />}
    </View>
  )
}
export type ContentTabsType = Array<{
  label: string
  id: string
}>

interface ContentTabsProps {
  setActiveTab: Dispatch<SetStateAction<string>>
  activeTab: string
  tabs: ContentTabsType
}

export const ContentTabs: React.FC<ContentTabsProps> = ({ setActiveTab, activeTab, tabs }) => {
  const color = useColor()
  const activeTabRef = useRef<View>(null)
  const [currentTabAttributes, setCurrentTabAttributes] = useState<TabAttributes | null>(null)

  const getAttributes = (attributes: TabAttributes) => {
    setCurrentTabAttributes(attributes)
  }

  const setActiveTabRef = (current: View) => {
    ;(activeTabRef as MutableRefObject<View>).current = current
  }

  return (
    <Box>
      <Box borderBottomWidth={1} borderBottomColor={color("black10")} top={currentTabAttributes?.py ?? 50 - 0.8} />
      <ScrollView
        scrollEventThrottle={50}
        alwaysBounceVertical={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
          // height: 50,
        }}
        horizontal
      >
        {tabs.map(({ label, id }) => {
          const active = activeTab === id
          return (
            <TabItem
              key={id}
              active={active}
              style={{ paddingHorizontal: 8 }}
              label={label}
              onPress={() => {
                setActiveTab(id)
              }}
              getTabAttributes={getAttributes}
              setActiveTabRef={setActiveTabRef}
            />
          )
        })}
      </ScrollView>
      <Box
        height={1}
        top={-1}
        backgroundColor={color("black100")}
        width={currentTabAttributes?.px}
        left={currentTabAttributes?.fx}
      />
    </Box>
  )
}

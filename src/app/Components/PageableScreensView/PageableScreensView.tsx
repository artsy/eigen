import { Flex } from "@artsy/palette-mobile"
import { PageableLazyScreen } from "app/Components/PageableScreensView/PageableLazyScreen"
import { useState } from "react"
import PagerView, { PagerViewProps } from "react-native-pager-view"
import {
  PageableScreenEntity,
  PageableScreensContext,
  PageableScreensContextValue,
} from "./PageableScreensContext"

interface PageableScreensViewProps {
  screens: PageableScreenEntity[]
  initialScreenName?: string
  prefetchScreensCount?: number
}

export const PageableScreensView: React.FC<PageableScreensViewProps> = (props) => {
  const { screens, initialScreenName, prefetchScreensCount = 1 } = props
  const [activeScreenIndex, setActiveScreenIndex] = useState(
    initialScreenName ? screens.findIndex((screen) => screen.name === initialScreenName) : 0
  )

  const context: PageableScreensContextValue = {
    activeScreenIndex,
    activeScreen: screens[activeScreenIndex],
  }

  const handlePageSelected: PagerViewProps["onPageSelected"] = (event) => {
    setActiveScreenIndex(event.nativeEvent.position)
  }

  return (
    <PageableScreensContext.Provider value={context}>
      <PagerView
        style={{ flex: 1 }}
        overScrollMode="never"
        onPageSelected={handlePageSelected}
        initialPage={activeScreenIndex}
      >
        {screens.map((screen, screenIndex) => {
          const shouldRender = Math.abs(activeScreenIndex - screenIndex) <= prefetchScreensCount

          return (
            <Flex width="100%" height="100%" key={screen.name}>
              <PageableLazyScreen screen={screen} shouldRender={shouldRender} />
            </Flex>
          )
        })}
      </PagerView>
    </PageableScreensContext.Provider>
  )
}

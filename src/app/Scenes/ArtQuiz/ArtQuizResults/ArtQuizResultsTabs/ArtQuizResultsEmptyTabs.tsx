import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { ArtQuizResultsTabsHeader } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsTabsHeader"
import { compact } from "lodash"
import { Screen, Text, useSpace } from "palette"

enum Tab {
  trendingCollections = "Trending Collections",
  trendingArtists = "Trending Artists",
}

export const ArtQuizResultsEmptyTabs = () => {
  return (
    <Screen>
      <Screen.Body fullwidth>
        <StickyTabPage
          disableBackButtonUpdate
          tabs={compact([
            {
              title: Tab.trendingCollections,
              content: <EmptyScreen />,
              initial: true,
            },
            {
              title: Tab.trendingArtists,
              content: <EmptyScreen />,
            },
          ])}
          staticHeaderContent={
            <ArtQuizResultsTabsHeader
              title="Explore Your Quiz Results"
              subtitle="There are almost 2 million artworks on Artsy—keep exploring to find something you love."
            />
          }
        />
      </Screen.Body>
    </Screen>
  )
}

const EmptyScreen = () => {
  const space = useSpace()
  return (
    <StickyTabPageScrollView
      contentContainerStyle={{
        paddingVertical: space("2"),
      }}
    >
      <Text>In progress ...</Text>
    </StickyTabPageScrollView>
  )
}

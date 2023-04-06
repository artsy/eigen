import { ArtQuizResultsQuery$data } from "__generated__/ArtQuizResultsQuery.graphql"
import { ArtQuizResultsTabs_me$key } from "__generated__/ArtQuizResultsTabs_me.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { ArtQuizExploreArtists } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizExploreArtists"
import { ArtQuizExploreArtworks } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizExploreArtworks"
import { ArtQuizLikedArtworks } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizLikedArtworks"
import { ArtQuizResultsTabsHeader } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsTabsHeader"
import { navigate } from "app/system/navigation/navigate"
import { compact } from "lodash"
import { Screen } from "app/Components/Screen"
import { graphql, useFragment } from "react-relay"

enum Tab {
  worksYouLiked = "Works you liked",
  exploreWorks = "Explore Works",
  exploreArtists = "Explore Artists",
}

export const ArtQuizResultsTabs = ({ me }: { me: ArtQuizResultsQuery$data["me"] }) => {
  const queryResult = useFragment<ArtQuizResultsTabs_me$key>(artQuizResultsTabsFragment, me)?.quiz

  const savedArtworks = queryResult?.savedArtworks!
  const recommendedArtworks = queryResult?.recommendedArtworks!

  return (
    <Screen>
      <Screen.Header onBack={() => navigate("/")} />
      <Screen.Body fullwidth noBottomSafe>
        <StickyTabPage
          disableBackButtonUpdate
          tabs={compact([
            {
              title: Tab.worksYouLiked,
              content: <ArtQuizLikedArtworks savedArtworks={savedArtworks} />,
              initial: true,
            },
            {
              title: Tab.exploreWorks,
              content: <ArtQuizExploreArtworks recommendedArtworks={recommendedArtworks} />,
            },
            {
              title: Tab.exploreArtists,
              content: <ArtQuizExploreArtists savedArtworks={savedArtworks} />,
            },
          ])}
          staticHeaderContent={
            <ArtQuizResultsTabsHeader
              title="Explore Your Quiz Results"
              subtitle="We think you’ll enjoy these recommendations based on your likes. To tailor Artsy to your art tastes, follow artists and save works you love."
            />
          }
        />
      </Screen.Body>
    </Screen>
  )
}

const artQuizResultsTabsFragment = graphql`
  fragment ArtQuizResultsTabs_me on Me {
    quiz {
      recommendedArtworks {
        ...ArtQuizExploreArtworksFragment_artwork
      }
      savedArtworks {
        ...ArtQuizLikedArtworks_artworks
        ...ArtQuizExploreArtists_artworks
      }
    }
  }
`

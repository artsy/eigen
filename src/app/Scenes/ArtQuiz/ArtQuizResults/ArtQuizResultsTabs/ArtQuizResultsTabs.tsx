import { ArtQuizResultsQuery$data } from "__generated__/ArtQuizResultsQuery.graphql"
import { ArtQuizResultsTabs_me$key } from "__generated__/ArtQuizResultsTabs_me.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { ArtQuizLikedArtworks } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizLikedArtworks"
import { ArtQuizResultsTabsHeader } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsTabsHeader"
import { compact } from "lodash"
import { Screen } from "palette"
import { graphql, useFragment } from "react-relay"

enum Tab {
  worksYouLiked = "Works you liked",
  collections = "Collections",
  artists = "Artists",
}

export const ArtQuizResultsTabs = ({ me }: { me: ArtQuizResultsQuery$data["me"] }) => {
  const savedArtworks = useFragment<ArtQuizResultsTabs_me$key>(artQuizResultsTabsFragment, me)?.quiz
    .savedArtworks

  return (
    <Screen>
      <Screen.Body fullwidth>
        <StickyTabPage
          disableBackButtonUpdate
          tabs={compact([
            {
              title: Tab.worksYouLiked,
              content: <ArtQuizLikedArtworks savedArtworks={savedArtworks!} />,
              initial: true,
            },
            {
              title: Tab.collections,
              content: <ArtQuizLikedArtworks savedArtworks={savedArtworks!} />,
            },
            {
              title: Tab.artists,
              content: <ArtQuizLikedArtworks savedArtworks={savedArtworks!} />,
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
      savedArtworks {
        ...ArtQuizLikedArtworks_me
      }
    }
  }
`

import { ArtQuizResultsEmptyTabsQuery$data } from "__generated__/ArtQuizResultsEmptyTabsQuery.graphql"
import { ArtQuizTrendingArtists_viewer$key } from "__generated__/ArtQuizTrendingArtists_viewer.graphql"
import { StickyTabPageFlatList } from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { ArtQuizTrendingArtist } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsEmptyTabs/ArtQuizTrendingArtist"
import { extractNodes } from "app/utils/extractNodes"
import { graphql, useFragment } from "react-relay"

export const ArtQuizTrendingArtists = ({
  viewer,
}: {
  viewer: ArtQuizResultsEmptyTabsQuery$data["viewer"]
}) => {
  const viewerData = useFragment<ArtQuizTrendingArtists_viewer$key>(
    artQuizTrendingArtistsFragment,
    viewer
  )

  const artists = extractNodes(viewerData?.curatedTrendingArtists)

  const artistSections = artists.map((artist) => ({
    key: artist.internalID,
    content: <ArtQuizTrendingArtist artistData={artist} />,
  }))

  return (
    <StickyTabPageFlatList
      style={{ paddingHorizontal: 0 }}
      data={artistSections!}
      initialNumToRender={2}
      keyExtractor={(item, index) => String(item?.collection?.internalID || index)}
    />
  )
}

const artQuizTrendingArtistsFragment = graphql`
  fragment ArtQuizTrendingArtists_viewer on Viewer {
    curatedTrendingArtists(first: 16) {
      edges {
        node {
          ...ArtQuizTrendingArtist_artist
          internalID
        }
      }
    }
  }
`

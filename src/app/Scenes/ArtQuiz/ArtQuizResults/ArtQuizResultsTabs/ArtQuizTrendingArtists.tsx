import { Tabs } from "@artsy/palette-mobile"
import { ArtQuizResultsEmptyTabsQuery$data } from "__generated__/ArtQuizResultsEmptyTabsQuery.graphql"
import { ArtQuizTrendingArtists_viewer$key } from "__generated__/ArtQuizTrendingArtists_viewer.graphql"

import { ArtQuizArtist } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizArtist"
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

  return (
    <Tabs.FlatList
      data={artists}
      initialNumToRender={2}
      keyExtractor={(item, index) => String(item?.internalID || index)}
      renderItem={({ item, index }) => {
        return <ArtQuizArtist artistData={item} key={index} />
      }}
    />
  )
}

const artQuizTrendingArtistsFragment = graphql`
  fragment ArtQuizTrendingArtists_viewer on Viewer {
    curatedTrendingArtists(first: 16) {
      edges {
        node {
          ...ArtQuizArtist_artist
          internalID
        }
      }
    }
  }
`

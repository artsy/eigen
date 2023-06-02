import { Join, Spacer, useSpace } from "@artsy/palette-mobile"
import { ArtistKindPills_artist$key } from "__generated__/ArtistKindPills_artist.graphql"
import { Pill } from "app/Components/Pill"
import { ScrollView } from "react-native"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArtistKindPillsProps {
  artist: ArtistKindPills_artist$key
}

export const ArtistKindPills: React.FC<ArtistKindPillsProps> = ({ artist }) => {
  const space = useSpace()
  const data = useFragment(ArtistKindPillsFragment, artist)

  if (!data.insights) return null

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{
        marginHorizontal: -space(2),
      }}
      contentContainerStyle={{
        paddingHorizontal: space(2),
      }}
    >
      <Join separator={<Spacer x={1} />}>
        {data.insights.map((i: any, index: number) => (
          <Pill key={index} rounded badge>
            {i.label}
          </Pill>
        ))}
      </Join>
    </ScrollView>
  )
}

const ArtistKindPillsFragment = graphql`
  fragment ArtistKindPills_artist on Artist {
    insights {
      kind
      label
    }
  }
`

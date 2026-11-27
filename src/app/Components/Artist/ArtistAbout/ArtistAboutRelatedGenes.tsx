import { Pill, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { ArtistAboutRelatedGenes_artist$key } from "__generated__/ArtistAboutRelatedGenes_artist.graphql"
import { useArtistAboutTracking } from "app/Components/Artist/ArtistAbout/useArtistAboutTracking"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { Fragment, useMemo } from "react"
import { ScrollView } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"

interface ArtistAboutRelatedGenesProps {
  artist: ArtistAboutRelatedGenes_artist$key
}

const MAX_WIDTH = 800
const MAX_GENES = 24

export const ArtistAboutRelatedGenes: React.FC<ArtistAboutRelatedGenesProps> = ({
  artist: artistRef,
}) => {
  const artist = useFragment(fragment, artistRef)
  const genes = useMemo(() => extractNodes(artist.related?.genes).slice(0, MAX_GENES), [artist])
  const space = useSpace()
  const artistAboutTracking = useArtistAboutTracking()

  return (
    <>
      <Text variant="sm-display" pb={4} px={2}>
        Related Categories
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          maxWidth: isTablet() ? "100%" : MAX_WIDTH,
          flexWrap: "wrap",
          marginHorizontal: space(2),
        }}
      >
        {genes.map(({ name, href, internalID }) => (
          <Fragment key={`gene-${internalID}`}>
            <RouterLink
              hasChildTouchable
              to={href}
              onPress={() =>
                artistAboutTracking.tappedGene({
                  artistID: artist.internalID,
                  artistSlug: artist.slug,
                  geneID: internalID,
                  geneName: name ?? "",
                })
              }
            >
              <Pill variant="default">{name}</Pill>
            </RouterLink>
            <Spacer x={1} y={4} />
          </Fragment>
        ))}
      </ScrollView>
    </>
  )
}

const fragment = graphql`
  fragment ArtistAboutRelatedGenes_artist on Artist {
    internalID
    slug
    related {
      genes {
        edges {
          node {
            internalID
            href
            name
          }
        }
      }
    }
  }
`

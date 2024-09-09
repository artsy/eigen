import { ContextModule } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { ArtworksRailHomeViewSection_section$key } from "__generated__/ArtworksRailHomeViewSection_section.graphql"
import { LargeArtworkRail } from "app/Components/ArtworkRail/LargeArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import LegacyHomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { getSectionHref } from "app/Scenes/HomeView/helpers/getSectionHref"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { View } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworksRailHomeViewSectionProps {
  section: ArtworksRailHomeViewSection_section$key
}

export const ArtworksRailHomeViewSection: React.FC<ArtworksRailHomeViewSectionProps> = ({
  section,
}) => {
  const tracking = useTracking()

  const data = useFragment(fragment, section)
  const title = data.component?.title
  const artworks = extractNodes(data.artworksConnection)
<<<<<<< HEAD
  const componentHref = getSectionHref(data.internalID, data.component?.behaviors?.viewAll?.href)
=======
  const componentHref = data.component?.behaviors?.viewAll?.href
>>>>>>> d26d9aeac0 (chore: use new artwork screen sections)

  if (!artworks || artworks.length === 0) {
    return null
  }

  const handleOnArtworkPress = (artwork: any, position: number) => {
    tracking.trackEvent(
      LegacyHomeAnalytics.artworkThumbnailTapEvent(
        data.internalID as ContextModule,
        artwork.slug,
        artwork.internalID,
        position,
        "single"
      )
    )

    navigate(artwork.href)
  }

  return (
    <Flex>
      <View>
        <Flex pl={2} pr={2}>
          <SectionTitle
            title={title}
            onPress={
              componentHref
                ? () => {
                    navigate(componentHref, {
                      passProps: {
                        sectionType: data.__typename,
                      },
                    })
                  }
                : undefined
            }
          />
        </Flex>
        <LargeArtworkRail
          artworks={artworks}
          onPress={handleOnArtworkPress}
          showSaveIcon
          onMorePress={
            componentHref
              ? () => {
                  navigate(componentHref, {
                    passProps: {
                      sectionType: data.__typename,
                    },
                  })
                }
              : undefined
          }
        />
      </View>
    </Flex>
  )
}

const fragment = graphql`
  fragment ArtworksRailHomeViewSection_section on ArtworksRailHomeViewSection {
    __typename
    internalID
    component {
      title
      behaviors {
        viewAll {
          href
        }
      }
    }

    artworksConnection(first: 10) {
      edges {
        node {
          ...LargeArtworkRail_artworks
        }
      }
    }
  }
`

import { Flex, MapPinIcon, Text } from "@artsy/palette-mobile"
import {
  NearbyFairsInYourCityRail_fairsConnection$data,
  NearbyFairsInYourCityRail_fairsConnection$key,
} from "__generated__/NearbyFairsInYourCityRail_fairsConnection.graphql"
import {
  CardRailCard,
  CardRailMetadataContainer as MetadataContainer,
} from "app/Components/Home/CardRailCard"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { ThreeUpImageLayout } from "app/Components/ThreeUpImageLayout"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { concat, take } from "lodash"
import { View } from "react-native"
import { graphql, useFragment } from "react-relay"

interface NearbyFairsInYourCityRailProps {
  fairsConnection: NearbyFairsInYourCityRail_fairsConnection$key
  title: string
}

type FairItem = ExtractNodeType<NearbyFairsInYourCityRail_fairsConnection$data["fairsConnection"]>

export const NearbyFairsInYourCityRail: React.FC<NearbyFairsInYourCityRailProps> = ({
  fairsConnection,
  title,
}) => {
  const { fairsConnection: fairsNodes } = useFragment(
    nearbyFairsInYourCityFragment,
    fairsConnection
  )

  const fairs = extractNodes(fairsNodes)

  return (
    <Flex>
      <Flex mx={2}>
        <SectionTitle
          title={title}
          RightButtonContent={() => <MapPinIcon fill="blue100" />}
          onPress={() => navigate("/nearby/city-picker")}
        />
      </Flex>

      <CardRailFlatList<FairItem>
        data={fairs}
        initialNumToRender={3}
        renderItem={({ item: result }) => {
          // Fairs are expected to always have >= 2 artworks and a hero image.
          // We can make assumptions about this in UI layout, but should still
          // be cautious to avoid crashes if this assumption is broken.
          const artworkImageURLs = take(
            concat(
              [result?.image?.url!],
              extractNodes(result?.followedArtistArtworks, (artwork) => artwork.image?.url!),
              extractNodes(result?.otherArtworks, (artwork) => artwork.image?.url!)
            ),
            3
          )

          return (
            <CardRailCard
              key={result?.slug}
              onPress={() => {
                if (result?.slug) {
                  navigate(`/fair/${result?.slug}`)
                }
              }}
            >
              <View>
                <ThreeUpImageLayout imageURLs={artworkImageURLs} />
                <MetadataContainer>
                  <Text numberOfLines={1} lineHeight="20px" variant="sm">
                    {result?.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    lineHeight="20px"
                    color="black60"
                    variant="sm"
                    testID="card-subtitle"
                    ellipsizeMode="middle"
                  >
                    {result?.exhibitionPeriod}
                  </Text>
                </MetadataContainer>
              </View>
            </CardRailCard>
          )
        }}
      />
    </Flex>
  )
}

const nearbyFairsInYourCityFragment = graphql`
  fragment NearbyFairsInYourCityRail_fairsConnection on City {
    fairsConnection(first: 10, status: CLOSED) {
      edges {
        node {
          id
          internalID
          slug
          profile {
            slug
          }
          name
          exhibitionPeriod(format: SHORT)
          image {
            url(version: "large")
          }
          followedArtistArtworks: filterArtworksConnection(
            first: 2
            input: { includeArtworksByFollowedArtists: true }
          ) {
            edges {
              node {
                image {
                  url(version: "large")
                }
              }
            }
          }
          otherArtworks: filterArtworksConnection(first: 2) {
            edges {
              node {
                image {
                  url(version: "large")
                }
              }
            }
          }
        }
      }
    }
  }
`

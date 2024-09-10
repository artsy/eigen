import { bullet, Flex, Text } from "@artsy/palette-mobile"
import {
  FairRailItem_fair$data,
  FairRailItem_fair$key,
} from "__generated__/FairRailItem_fair.graphql"
import { CardRailCard, CardRailMetadataContainer } from "app/Components/Home/CardRailCard"
import { ThreeUpImageLayout } from "app/Components/ThreeUpImageLayout"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { compact, concat, take } from "lodash"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"

interface FairRailItemProps {
  fair: FairRailItem_fair$key
  onPress?: (fair: FairRailItem_fair$data) => void
}

export const FairRailItem: FC<FairRailItemProps> = ({ fair: fairFragment, onPress }) => {
  const fair = useFragment(fragment, fairFragment)

  // Fairs are expected to always have >= 2 artworks and a hero image.
  // We can make assumptions about this in UI layout, but should still
  // be cautious to avoid crashes if this assumption is broken.
  const artworkImageURLs = compact(
    take(
      concat(
        [fair.image?.url],
        extractNodes(fair.followedArtistArtworks, (artwork) => artwork.image?.url),
        extractNodes(fair.otherArtworks, (artwork) => artwork.image?.url)
      ),
      3
    )
  )

  const location = fair.location?.city || fair.location?.country

  return (
    <CardRailCard
      key={fair.slug}
      onPress={() => {
        onPress?.(fair)
        navigate(`/fair/${fair.slug}`)
      }}
    >
      <Flex>
        <ThreeUpImageLayout imageURLs={artworkImageURLs} />
        <CardRailMetadataContainer>
          <Text numberOfLines={1} lineHeight="20px" variant="sm">
            {fair.name}
          </Text>
          <Text
            numberOfLines={1}
            lineHeight="20px"
            color="black60"
            variant="sm"
            testID="card-subtitle"
            ellipsizeMode="middle"
          >
            {fair.exhibitionPeriod}
            {Boolean(location) && `  ${bullet}  ${location}`}
          </Text>
        </CardRailMetadataContainer>
      </Flex>
    </CardRailCard>
  )
}

const fragment = graphql`
  fragment FairRailItem_fair on Fair {
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
    location {
      city
      country
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
`

import { bullet, useTheme } from "@artsy/palette-mobile"
import { FairCard_fair$data, FairCard_fair$key } from "__generated__/FairCard_fair.graphql"
import { CARD_WIDTH } from "app/Components/CardRail/CardRailCard"
import { CardWithMetaData, useNumColumns } from "app/Components/Cards/CardWithMetaData"
import { MultipleImageLayout } from "app/Components/MultipleImageLayout"
import { extractNodes } from "app/utils/extractNodes"
import { compact, concat, take } from "lodash"
import { FC, memo } from "react"
import { useWindowDimensions } from "react-native"
import { graphql, useFragment } from "react-relay"

interface FairCardProps {
  fair: FairCard_fair$key | null | undefined
  onPress?: (fair: FairCard_fair$data) => void
  isFluid?: boolean
}

export const FairCard: FC<FairCardProps> = memo(({ fair: fairFragment, onPress, isFluid }) => {
  const fair = useFragment(fragment, fairFragment)

  const numColumns = useNumColumns()
  const { space } = useTheme()
  const { width: screenWidth } = useWindowDimensions()

  if (!fair) {
    return null
  }

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
    <CardWithMetaData
      testId="featured-fair--card"
      isFluid={isFluid}
      href={`/fair/${fair.slug}`}
      imageComponent={
        <MultipleImageLayout
          imageURLs={artworkImageURLs}
          width={isFluid ? screenWidth / numColumns - 2 * space(2) : CARD_WIDTH}
        />
      }
      title={fair.name}
      subtitle={fair.exhibitionPeriod}
      tag={Boolean(location) ? `  ${bullet}  ${location}` : undefined}
      onPress={() => {
        onPress?.(fair)
      }}
    />
  )
})

const fragment = graphql`
  fragment FairCard_fair on Fair {
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

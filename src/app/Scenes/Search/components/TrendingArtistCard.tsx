import { Flex, Text } from "@artsy/palette-mobile"
import { TrendingArtistCard_artist$key } from "__generated__/TrendingArtistCard_artist.graphql"
import { ImageWithFallback } from "app/Components/ImageWithFallback/ImageWithFallback"
import { RouterLink } from "app/system/navigation/RouterLink"
import { graphql, useFragment } from "react-relay"

interface TrendingArtistCardProps {
  artist: TrendingArtistCard_artist$key
  onPress: () => void
}

const CARD_WIDTH = 140
const CARD_HEIGHT = 105

export const TrendingArtistCard: React.FC<TrendingArtistCardProps> = ({ artist, onPress }) => {
  const data = useFragment(TrendingArtistCardFragment, artist)

  return (
    <RouterLink to={data.href} style={{ width: CARD_WIDTH, overflow: "hidden" }} onPress={onPress}>
      <Flex>
        <ImageWithFallback
          src={data.coverArtwork?.image?.url}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
        />

        <Flex mt={1}>
          <Text variant="xs" numberOfLines={1}>
            {data.name}
          </Text>

          {!!data.formattedNationalityAndBirthday && (
            <Text variant="xs" numberOfLines={1} color="mono60">
              {data.formattedNationalityAndBirthday}
            </Text>
          )}
        </Flex>
      </Flex>
    </RouterLink>
  )
}

const TrendingArtistCardFragment = graphql`
  fragment TrendingArtistCard_artist on Artist {
    href
    name
    formattedNationalityAndBirthday
    coverArtwork {
      image {
        url(version: "small")
      }
    }
  }
`

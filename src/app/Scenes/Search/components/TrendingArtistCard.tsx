import { Flex, Text } from "@artsy/palette-mobile"
import { TrendingArtistCard_artist$key } from "__generated__/TrendingArtistCard_artist.graphql"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { TouchableHighlight } from "react-native"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface TrendingArtistCardProps {
  artist: TrendingArtistCard_artist$key
  onPress: () => void
}

const CARD_WIDTH = 140
const CARD_HEIGHT = 105

export const TrendingArtistCard: React.FC<TrendingArtistCardProps> = ({ artist, onPress }) => {
  const data = useFragment(TrendingArtistCardFragment, artist)

  return (
    <TouchableHighlight
      underlayColor="transparent"
      style={{ width: CARD_WIDTH, overflow: "hidden" }}
      onPress={onPress}
    >
      <Flex>
        <OpaqueImageView imageURL={data.image?.url} width={CARD_WIDTH} height={CARD_HEIGHT} />

        <Flex mt={1}>
          <Text variant="xs" numberOfLines={1}>
            {data.name}
          </Text>

          {!!data.formattedNationalityAndBirthday && (
            <Text variant="xs" numberOfLines={1} color="black60">
              {data.formattedNationalityAndBirthday}
            </Text>
          )}
        </Flex>
      </Flex>
    </TouchableHighlight>
  )
}

const TrendingArtistCardFragment = graphql`
  fragment TrendingArtistCard_artist on Artist {
    href
    name
    formattedNationalityAndBirthday
    image {
      url(version: "small")
    }
  }
`

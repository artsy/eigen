import { TrendingArtistCard_artist$key } from "__generated__/TrendingArtistCard_artist.graphql"
import { navigate } from "app/navigation/navigate"
import { Flex, OpaqueImageView, Text, useColor } from "palette"
import { TouchableHighlight } from "react-native"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface TrendingArtistCardProps {
  artist: TrendingArtistCard_artist$key
}

const CARD_WIDTH = 140
const CARD_HEIGHT = 105

export const TrendingArtistCard: React.FC<TrendingArtistCardProps> = ({ artist }) => {
  const color = useColor()
  const data = useFragment(TrendingArtistCardFragment, artist)

  const handlePress = () => {
    navigate(data.href!)
  }

  return (
    <TouchableHighlight
      underlayColor={color("white100")}
      activeOpacity={0.8}
      style={{ width: CARD_WIDTH, overflow: "hidden" }}
      onPress={handlePress}
    >
      <Flex>
        <OpaqueImageView imageURL={data.image?.url} width={CARD_WIDTH} height={CARD_HEIGHT} />

        <Flex>
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

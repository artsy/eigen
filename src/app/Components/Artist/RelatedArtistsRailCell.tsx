import { Flex, FollowButton, Image, Text, Touchable } from "@artsy/palette-mobile"
import { RelatedArtistsRailCell_artist$key } from "__generated__/RelatedArtistsRailCell_artist.graphql"

import { navigate } from "app/system/navigation/navigate"
import { useFollowArtist } from "app/utils/mutations/useFollowArtist"
import { useFragment, graphql } from "react-relay"

const DEFAULT_CELL_WIDTH = 300

interface RelatedArtistsRailCellProps {
  artist: RelatedArtistsRailCell_artist$key
}

export const RelatedArtistsRailCell: React.FC<RelatedArtistsRailCellProps> = ({ artist }) => {
  const data = useFragment(query, artist)
  const [commitMutation] = useFollowArtist()

  if (!data) {
    return null
  }

  const handleOnPress = () => {
    navigate(data.href)
  }

  const handleOnFollow = () => {
    commitMutation({
      variables: {
        input: {
          artistID: data.internalID,
          unfollow: data.isFollowed,
        },
      },
      optimisticResponse: {
        followArtist: {
          artist: {
            ...data,
            isFollowed: !data.isFollowed,
          },
        },
      },
      onError: (error) => console.error("[RelatedArtistCell]: error on followArtist", error),
    })
  }

  return (
    <Touchable onPress={handleOnPress}>
      <Image
        testID="related-artist-cover"
        src={data.image?.url ?? ""}
        aspectRatio={1.3}
        width={DEFAULT_CELL_WIDTH}
      />

      <Flex flexDirection="row" justifyContent="space-between" my={1}>
        <Flex>
          <Text variant="sm-display">{data.name}</Text>
          <Text variant="xs" color="black60">
            {data.formattedNationalityAndBirthday}
          </Text>
        </Flex>
        <FollowButton isFollowed={!!data.isFollowed} onPress={handleOnFollow} />
      </Flex>
    </Touchable>
  )
}

const query = graphql`
  fragment RelatedArtistsRailCell_artist on Artist {
    id
    internalID @required(action: NONE)
    name @required(action: NONE)
    href @required(action: NONE)
    formattedNationalityAndBirthday
    isFollowed
    image {
      url(version: "large")
    }
  }
`

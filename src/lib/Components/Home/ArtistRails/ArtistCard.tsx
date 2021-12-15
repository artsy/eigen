import { ArtistCard_artist } from "__generated__/ArtistCard_artist.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { Button, CheckIcon, CloseIcon, Flex, Text, Touchable, useColor } from "palette"

const ARTIST_CARD_WIDTH = 295

interface ArtistCardProps {
  artist: ArtistCard_artist
  onDismiss?: () => void
  onFollow?: () => void
  onPress?: () => void
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onDismiss, onFollow, onPress }) => {
  const color = useColor()

  const handlePress = () => {
    onPress?.()

    if (artist.href) {
      navigate(artist.href)
    }
  }

  return (
    <ArtistCardWrapper onPress={handlePress}>
      <Flex>
        <Flex>
          <ImageView imageURL={artist?.image?.url} width={ARTIST_CARD_WIDTH} height={180} />
        </Flex>
        <Flex flexDirection="row" mt={1}>
          <Flex flex={1} flexDirection="column" justifyContent="center">
            <Text numberOfLines={1}>{artist.name}</Text>
            {!!artist.formattedNationalityAndBirthday && (
              <Text numberOfLines={1} color="black60">
                {artist.formattedNationalityAndBirthday}
              </Text>
            )}
          </Flex>
          <Flex>
            <Button
              variant="outline"
              size="small"
              longestText="Following"
              onPress={onFollow}
              icon={artist.isFollowed ? <CheckIcon fill="black60" width="16px" height="16px" /> : ""}
            >
              {artist.isFollowed ? "Following" : "Follow"}
            </Button>
          </Flex>
        </Flex>
        {!!onDismiss && (
          <Flex
            position="absolute"
            overflow="hidden"
            backgroundColor={color("white100")}
            alignItems="center"
            justifyContent="center"
            borderRadius={12}
            style={{ top: 6, right: 6, width: 24, height: 24 }}
          >
            <Touchable hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }} activeOpacity={0.2} onPress={onDismiss}>
              <CloseIcon fill="black60" width={16} height={16} />
            </Touchable>
          </Flex>
        )}
      </Flex>
    </ArtistCardWrapper>
  )
}

export const ArtistCardWrapper = styled.TouchableHighlight.attrs(() => ({ underlayColor: "transparent" }))`
  width: ${ARTIST_CARD_WIDTH}px;
  overflow: hidden;
`

export const ArtistCardContainer = createFragmentContainer(ArtistCard, {
  artist: graphql`
    fragment ArtistCard_artist on Artist {
      id
      slug
      internalID
      href
      name
      formattedNationalityAndBirthday
      image {
        url(version: "small")
      }
      basedOn {
        name
      }
      isFollowed
    }
  `,
})

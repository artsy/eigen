import { Box, Flex, Sans, space } from "@artsy/palette"
import { ViewingRoomHeader_viewingRoom } from "__generated__/ViewingRoomHeader_viewingRoom.graphql"
import { SimpleTicker } from "lib/Components/Countdown"
import { CountdownProps, CountdownTimer } from "lib/Components/Countdown/CountdownTimer"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React from "react"
import { Dimensions } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

interface ViewingRoomHeaderProps {
  viewingRoom: ViewingRoomHeader_viewingRoom
}

export const BackgroundImage = styled(OpaqueImageView)<{ height: number; width: number }>`
  position: absolute;
  height: 100%;
  width: 100%;
`

const CountdownContainer = styled.View`
  position: absolute;
  bottom: ${space(2)};
  right: ${space(2)};
  width: 45%;
`

const PartnerContainer = styled(Flex)`
  position: absolute;
  bottom: ${space(2)};
  left: ${space(2)};
  width: 45%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const Overlay = styled.View`
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  position: absolute;
`

const CountdownText: React.SFC<CountdownProps> = ({ duration }) => (
  <SimpleTicker duration={duration} separator="  " size="2" weight="medium" color="white100" />
)

const PartnerIconImage = styled.Image`
  border-radius: 100;
`

export const ViewingRoomHeader: React.FC<ViewingRoomHeaderProps> = props => {
  const { heroImageURL, title, partner, startAt, endAt } = props.viewingRoom
  const partnerIconImageURL = partner?.profile?.icon?.url
  const { width: screenWidth } = Dimensions.get("window")
  const imageHeight = 547

  return (
    <>
      <Box style={{ height: imageHeight, width: screenWidth, position: "relative" }}>
        <BackgroundImage
          data-test-id="background-image"
          imageURL={heroImageURL}
          height={imageHeight}
          width={screenWidth}
        />
        <Overlay />
        <Flex flexDirection="row" justifyContent="center" alignItems="flex-end" px={2} height={imageHeight - 60}>
          <Flex alignItems="center" flexDirection="column" flexGrow={1}>
            <Sans data-test-id="title" size="6" textAlign="center" color="white100">
              {title}
            </Sans>
          </Flex>
        </Flex>
        <PartnerContainer>
          {partnerIconImageURL && (
            <Box mr={0.5}>
              <PartnerIconImage source={{ uri: partnerIconImageURL, width: 20, height: 20 }} />
            </Box>
          )}
          <Sans data-test-id="partner-name" size="2" weight="medium" numberOfLines={1} color="white100">
            {partner!.name}
          </Sans>
        </PartnerContainer>
        <CountdownContainer>
          <Flex alignItems="flex-end">
            <CountdownTimer startAt={startAt as string} endAt={endAt as string} countdownComponent={CountdownText} />
          </Flex>
        </CountdownContainer>
      </Box>
    </>
  )
}

export const ViewingRoomHeaderContainer = createFragmentContainer(ViewingRoomHeader, {
  viewingRoom: graphql`
    fragment ViewingRoomHeader_viewingRoom on ViewingRoom {
      title
      startAt
      endAt
      heroImageURL
      partner {
        name
        profile {
          icon {
            url(version: "square")
          }
        }
      }
    }
  `,
})

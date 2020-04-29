import { Box, Flex, Sans, space } from "@artsy/palette"
import { ViewingRoomHeader_viewingRoom } from "__generated__/ViewingRoomHeader_viewingRoom.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { CountdownTimer } from "lib/Scenes/Fair/Components/FairHeader/CountdownTimer"
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
  bottom: ${space(1)};
  right: 0;
  width: 50%;
`

const Overlay = styled.View`
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  position: absolute;
`

export const ViewingRoomHeader: React.FC<ViewingRoomHeaderProps> = props => {
  const { width: screenWidth } = Dimensions.get("window")
  const imageHeight = 547

  return (
    <>
      <Box style={{ height: imageHeight, width: screenWidth, position: "relative" }}>
        <BackgroundImage
          data-test-id="background-image"
          imageURL={props.viewingRoom.heroImageURL}
          height={imageHeight}
          width={screenWidth}
        />
        <Overlay />
        <Flex flexDirection="row" justifyContent="center" alignItems="flex-end" px={2} height={imageHeight - 60}>
          <Flex alignItems="center" flexDirection="column" flexGrow={1}>
            <Sans data-test-id="title" size="6" textAlign="center" color="white100">
              {props.viewingRoom.title}
            </Sans>
          </Flex>
        </Flex>
        <CountdownContainer>
          <CountdownTimer
            formattedOpeningHours=""
            startAt="2020-03-10T20:22:42+00:00"
            endAt="2020-04-22T10:24:31+00:00"
          />
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
    }
  `,
})

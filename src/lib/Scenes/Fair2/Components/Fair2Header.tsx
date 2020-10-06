import { Fair2Header_fair } from "__generated__/Fair2Header_fair.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { Box, ChevronIcon, Flex, Text } from "palette"
import React from "react"
import { Dimensions, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { Fair2TimingFragmentContainer as FairTiming } from "./Fair2Timing"

interface Fair2HeaderProps {
  fair: Fair2Header_fair
}

export const Fair2Header: React.FC<Fair2HeaderProps> = ({ fair }) => {
  const {
    name,
    slug,
    about,
    image,
    tagline,
    location,
    ticketsLink,
    fairHours,
    fairLinks,
    fairContact,
    summary,
    fairTickets,
  } = fair
  const screenWidth = Dimensions.get("screen").width
  const profileImageUrl = fair?.profile?.icon?.imageUrl
  const previewText = summary || about

  const canShowMoreInfoLink =
    !!about ||
    !!tagline ||
    !!location?.summary ||
    !!ticketsLink ||
    !!fairHours ||
    !!fairLinks ||
    !!fairContact ||
    !!summary ||
    !!fairTickets

  return (
    <Box>
      {!!image && (
        <Flex alignItems="center" justifyContent="center" style={{ position: "relative" }}>
          <OpaqueImageView width={screenWidth} height={screenWidth / image.aspectRatio} imageURL={image.imageUrl} />
          {!!profileImageUrl && (
            <Flex
              alignItems="center"
              justifyContent="center"
              bg="white100"
              width={80}
              height={60}
              px={1}
              position="absolute"
              bottom={0}
              left={2}
            >
              <OpaqueImageView width={60} height={40} imageURL={profileImageUrl} placeholderBackgroundColor="white" />
            </Flex>
          )}
        </Flex>
      )}
      <Box px={2}>
        <Text variant="largeTitle" py={2}>
          {name}
        </Text>
        <FairTiming fair={fair} />
        <Text variant="text">{previewText}</Text>
        {!!canShowMoreInfoLink && (
          <TouchableOpacity onPress={() => navigate(`/fair/${slug}/info`)}>
            <Flex py={2} flexDirection="row" justifyContent="flex-start">
              <Text variant="mediumText">More info</Text>
              <ChevronIcon mr="-5px" mt="2px" />
            </Flex>
          </TouchableOpacity>
        )}
      </Box>
    </Box>
  )
}

export const Fair2HeaderFragmentContainer = createFragmentContainer(Fair2Header, {
  fair: graphql`
    fragment Fair2Header_fair on Fair {
      about
      summary
      name
      slug
      profile {
        icon {
          imageUrl: url(version: "untouched-png")
        }
      }
      image {
        imageUrl: url(version: "large_rectangle")
        aspectRatio
      }
      # Used to figure out if we should render the More info link
      tagline
      location {
        summary
      }
      ticketsLink
      fairHours: hours(format: MARKDOWN) # aliased to avoid conflicts in the VanityURLQueryRenderer
      fairLinks: links(format: MARKDOWN) # aliased to avoid conflicts in the VanityURLQueryRenderer
      fairTickets: tickets(format: MARKDOWN) # aliased to avoid conflicts in the VanityURLQueryRenderer
      fairContact: contact(format: MARKDOWN) # aliased to avoid conflicts in the VanityURLQueryRenderer
      ...Fair2Timing_fair
    }
  `,
})

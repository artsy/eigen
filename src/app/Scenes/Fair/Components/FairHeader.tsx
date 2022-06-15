import { FairHeader_fair$data } from "__generated__/FairHeader_fair.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { ReadMore } from "app/Components/ReadMore"
import { navigate } from "app/navigation/navigate"
import { shouldShowLocationMap } from "app/Scenes/Fair/FairMoreInfo"
import { truncatedTextLimit } from "app/utils/hardware"
import { Box, ChevronIcon, Flex, Spacer, Text } from "palette"
import React from "react"
import { Dimensions, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { shouldShowFairBMWArtActivationLink } from "../FairBMWArtActivation"
import { FairTimingFragmentContainer as FairTiming } from "./FairTiming"

interface FairHeaderProps {
  fair: FairHeader_fair$data
}

export const FairHeader: React.FC<FairHeaderProps> = ({ fair }) => {
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
    sponsoredContent,
  } = fair
  const screenWidth = Dimensions.get("screen").width
  const profileImageUrl = fair?.profile?.icon?.imageUrl
  const previewText = summary || about

  const canShowMoreInfoLink =
    !!about ||
    !!tagline ||
    !!location?.summary ||
    shouldShowLocationMap(location?.coordinates) ||
    !!ticketsLink ||
    !!fairHours ||
    !!fairLinks ||
    !!fairContact ||
    !!summary ||
    !!fairTickets ||
    shouldShowFairBMWArtActivationLink({ sponsoredContent })

  return (
    <Box>
      {!!image ? (
        <Flex alignItems="center" justifyContent="center" style={{ position: "relative" }}>
          <OpaqueImageView
            width={screenWidth}
            height={screenWidth / image.aspectRatio}
            imageURL={image.imageUrl}
          />
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
              <OpaqueImageView
                width={60}
                height={40}
                imageURL={profileImageUrl}
                placeholderBackgroundColor="white"
              />
            </Flex>
          )}
        </Flex>
      ) : (
        <SafeTopMargin />
      )}
      <Box px={2}>
        <Text variant="lg" py={2}>
          {name}
        </Text>
        <FairTiming fair={fair} />
        {!!previewText && (
          <ReadMore textStyle="new" content={previewText} maxChars={truncatedTextLimit()} />
        )}
        {!!canShowMoreInfoLink && (
          <TouchableOpacity onPress={() => navigate(`/fair/${slug}/info`)}>
            <Flex pt={2} flexDirection="row" justifyContent="flex-start">
              <Text variant="sm">More info</Text>
              <ChevronIcon mr="-5px" mt="2px" />
            </Flex>
          </TouchableOpacity>
        )}
      </Box>
    </Box>
  )
}

const SafeTopMargin = () => <Spacer mt={6} pt={2} />

export const FairHeaderFragmentContainer = createFragmentContainer(FairHeader, {
  fair: graphql`
    fragment FairHeader_fair on Fair {
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
        coordinates {
          lat
          lng
        }
      }
      ticketsLink
      sponsoredContent {
        activationText
        pressReleaseUrl
      }
      fairHours: hours(format: MARKDOWN) # aliased to avoid conflicts in the VanityURLQueryRenderer
      fairLinks: links(format: MARKDOWN) # aliased to avoid conflicts in the VanityURLQueryRenderer
      fairTickets: tickets(format: MARKDOWN) # aliased to avoid conflicts in the VanityURLQueryRenderer
      fairContact: contact(format: MARKDOWN) # aliased to avoid conflicts in the VanityURLQueryRenderer
      ...FairTiming_fair
    }
  `,
})

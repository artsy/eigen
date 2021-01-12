import { Fair2MoreInfo_fair } from "__generated__/Fair2MoreInfo_fair.graphql"
import { Fair2MoreInfoQuery } from "__generated__/Fair2MoreInfoQuery.graphql"
import { LocationMapContainer } from "lib/Components/LocationMap"
import { Markdown } from "lib/Components/Markdown"
import { LinkText } from "lib/Components/Text/LinkText"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { defaultRules } from "lib/utils/renderMarkdown"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { Box, ChevronIcon, Flex, Spacer, Text, Theme } from "palette"
import React from "react"
import { ScrollView, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { shouldShowFairBMWArtActivationLink } from "./FairBMWArtActivation"

interface Fair2MoreInfoQueryRendererProps {
  fairID: string
}

interface Fair2MoreInfoProps {
  fair: Fair2MoreInfo_fair
}

interface LocationCoordinates {
  lat: number | null
  lng: number | null
}

export const shouldShowLocationMap = (coordinates: LocationCoordinates | null | undefined): boolean => {
  return !!(coordinates && coordinates?.lat && coordinates?.lng)
}

export const Fair2MoreInfo: React.FC<Fair2MoreInfoProps> = ({ fair }) => {
  const markdownRules = defaultRules({ useNewTextStyles: true })

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.Fair2MoreInfoPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Fair2MoreInfo,
        context_screen_owner_id: fair.internalID,
        context_screen_owner_slug: fair.slug,
      }}
    >
      <ScrollView>
        <Theme>
          <Box px={2} pb={2} pt={6}>
            <Text variant="largeTitle">About</Text>

            <Spacer my={1} />

            {!!fair.summary && (
              <>
                <Markdown rules={markdownRules}>{fair.summary}</Markdown>
                <Spacer my={1} />
              </>
            )}
            {!!fair.about && (
              <>
                <Markdown rules={markdownRules}>{fair.about}</Markdown>
                <Spacer my={1} />
              </>
            )}

            {!!fair.tagline && (
              <>
                <Text variant="text">{fair.tagline}</Text>
                <Spacer my={1} />
              </>
            )}

            {!!fair.location && (
              <>
                <Text variant="mediumText">Location</Text>
                {!!fair.location?.summary && <Text variant="text">{fair.location?.summary}</Text>}
                {!!shouldShowLocationMap(fair.location?.coordinates) && (
                  <LocationMapContainer location={fair.location} partnerName={fair.profile?.name ?? fair.name} />
                )}
                <Spacer my={1} />
              </>
            )}

            {!!shouldShowFairBMWArtActivationLink(fair) && (
              <TouchableOpacity onPress={() => navigate(`/fair/${fair.slug}/bmw-sponsored-content`)}>
                <Flex py={2} flexDirection="row" justifyContent="flex-start">
                  <Text variant="mediumText">View BMW art activations</Text>
                  <ChevronIcon mr="-5px" mt="3px" />
                </Flex>
              </TouchableOpacity>
            )}

            {!!fair.fairHours && (
              <>
                <Text variant="mediumText">Hours</Text>
                <Markdown rules={markdownRules}>{fair.fairHours}</Markdown>
                <Spacer my={1} />
              </>
            )}
            {!!fair.fairTickets && (
              <>
                <Text variant="mediumText">Tickets</Text>
                <Markdown rules={markdownRules}>{fair.fairTickets}</Markdown>
                <Spacer my={1} />
              </>
            )}
            {!!fair.ticketsLink && (
              <>
                <TouchableOpacity onPress={() => navigate(fair.ticketsLink!)}>
                  <LinkText>Buy Tickets</LinkText>
                </TouchableOpacity>
                <Spacer my={1} />
              </>
            )}
            {!!fair.fairLinks && (
              <>
                <Text variant="mediumText">Links</Text>
                <Markdown rules={markdownRules}>{fair.fairLinks}</Markdown>
                <Spacer my={1} />
              </>
            )}
            {!!fair.fairContact && (
              <>
                <Text variant="mediumText">Contact</Text>
                <Markdown rules={markdownRules}>{fair.fairContact}</Markdown>
                <Spacer my={1} />
              </>
            )}
          </Box>
        </Theme>
      </ScrollView>
    </ProvideScreenTracking>
  )
}

export const Fair2MoreInfoFragmentContainer = createFragmentContainer(Fair2MoreInfo, {
  fair: graphql`
    fragment Fair2MoreInfo_fair on Fair {
      internalID
      slug
      about
      name
      tagline
      profile {
        name
      }
      location {
        ...LocationMap_location
        coordinates {
          lat
          lng
        }
        summary
      }
      sponsoredContent {
        activationText
        pressReleaseUrl
      }
      ticketsLink
      fairHours: hours(format: MARKDOWN)
      fairLinks: links(format: MARKDOWN)
      fairTickets: tickets(format: MARKDOWN)
      summary
      fairContact: contact(format: MARKDOWN)
    }
  `,
})

export const Fair2MoreInfoQueryRenderer: React.FC<Fair2MoreInfoQueryRendererProps> = ({ fairID }) => {
  return (
    <QueryRenderer<Fair2MoreInfoQuery>
      environment={defaultEnvironment}
      query={graphql`
        query Fair2MoreInfoQuery($fairID: String!) {
          fair(id: $fairID) @principalField {
            ...Fair2MoreInfo_fair
          }
        }
      `}
      variables={{ fairID }}
      render={renderWithLoadProgress(Fair2MoreInfoFragmentContainer)}
    />
  )
}

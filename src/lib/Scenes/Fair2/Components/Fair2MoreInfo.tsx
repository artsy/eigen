import { Fair2MoreInfo_fair } from "__generated__/Fair2MoreInfo_fair.graphql"
import { Fair2MoreInfoQuery } from "__generated__/Fair2MoreInfoQuery.graphql"
import { LocationMapContainer, PartnerType } from "lib/Components/LocationMap"
import { Markdown } from "lib/Components/Markdown"
import { LinkText } from "lib/Components/Text/LinkText"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { defaultRules } from "lib/utils/renderMarkdown"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Box, Spacer, Text, Theme } from "palette"
import React, { useRef } from "react"
import { ScrollView, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { blockRegex } from "simple-markdown"

interface Fair2MoreInfoQueryRendererProps {
  fairID: string
}

interface Fair2MoreInfoProps {
  fair: Fair2MoreInfo_fair
}

// Default markdown rules center align text, which we don't want.
const markdownRules = defaultRules(false, {
  paragraph: {
    match: blockRegex(/^((?:[^\n]|\n(?! *\n))+)(?:\n *)/),
    react: (node, output, state) => {
      return (
        <Text variant="text" key={state.key} textAlign="left">
          {output(node.content, state)}
        </Text>
      )
    },
  },
})

export const Fair2MoreInfo: React.FC<Fair2MoreInfoProps> = ({ fair }) => {
  const navRef = useRef<any>()
  const handleNavigation = (link: string) => {
    return SwitchBoard.presentNavigationViewController(navRef.current, link)
  }
  const coordinates = fair.location?.coordinates
  const shouldShowLocationMap = coordinates && coordinates?.lat && coordinates?.lng

  return (
    <ScrollView ref={navRef}>
      <Theme>
        <Box px={2} pb={2} pt={6}>
          <Text variant="largeTitle">About</Text>

          <Spacer my={1} />

          {!!fair.summary && (
            <>
              <Text variant="text">{fair.summary}</Text>
              <Spacer my={1} />
            </>
          )}
          {!!fair.about && (
            <>
              <Text variant="text">{fair.about}</Text>
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
              {!!shouldShowLocationMap && (
                <LocationMapContainer
                  location={fair.location}
                  partnerType={PartnerType.fair}
                  partnerName={fair.profile?.name ?? fair.name}
                />
              )}
              <Spacer my={1} />
            </>
          )}

          {!!fair.hours && (
            <>
              <Text variant="mediumText">Hours</Text>
              <Markdown rules={markdownRules}>{fair.hours}</Markdown>
              <Spacer my={1} />
            </>
          )}
          {!!fair.tickets && (
            <>
              <Text variant="mediumText">Tickets</Text>
              <Markdown rules={markdownRules}>{fair.tickets}</Markdown>
              <Spacer my={1} />
            </>
          )}
          {!!fair.ticketsLink && (
            <>
              <TouchableOpacity onPress={() => handleNavigation(fair.ticketsLink!)}>
                <LinkText>Buy Tickets</LinkText>
              </TouchableOpacity>
              <Spacer my={1} />
            </>
          )}
          {!!fair.links && (
            <>
              <Text variant="mediumText">Links</Text>
              <Markdown rules={markdownRules}>{fair.links}</Markdown>
              <Spacer my={1} />
            </>
          )}
          {!!fair.contact && (
            <>
              <Text variant="mediumText">Contact</Text>
              <Markdown rules={markdownRules}>{fair.contact}</Markdown>
              <Spacer my={1} />
            </>
          )}
        </Box>
      </Theme>
    </ScrollView>
  )
}

export const Fair2MoreInfoFragmentContainer = createFragmentContainer(Fair2MoreInfo, {
  fair: graphql`
    fragment Fair2MoreInfo_fair on Fair {
      about
      name
      slug
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
      ticketsLink
      hours(format: MARKDOWN)
      links(format: MARKDOWN)
      tickets(format: MARKDOWN)
      summary
      contact(format: MARKDOWN)
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

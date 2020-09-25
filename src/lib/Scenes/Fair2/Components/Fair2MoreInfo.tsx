import { Fair2MoreInfo_fair } from "__generated__/Fair2MoreInfo_fair.graphql"
import { Fair2MoreInfoQuery } from "__generated__/Fair2MoreInfoQuery.graphql"
import { Markdown } from "lib/Components/Markdown"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Box, Spacer, Text, Theme } from "palette"
import React, { useRef } from "react"
import { ScrollView, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface Fair2MoreInfoQueryRendererProps {
  fairID: string
}

interface Fair2MoreInfoProps {
  fair: Fair2MoreInfo_fair
}

export const Fair2MoreInfo: React.FC<Fair2MoreInfoProps> = ({ fair }) => {
  const navRef = useRef<any>()
  const handleNavigation = (link: string) => {
    return SwitchBoard.presentNavigationViewController(navRef.current, link)
  }

  return (
    <ScrollView ref={navRef}>
      <Theme>
        <Box p={2}>
          <Text variant="largeTitle">About</Text>

          <Spacer my={1} />

          {!!fair.summary && (
            <>
              <Text variant="text">{fair.summary}</Text>
              <Spacer my={3} />
            </>
          )}
          {!!fair.about && (
            <>
              <Text variant="text">{fair.about}</Text>
              <Spacer my={3} />
            </>
          )}

          {!!fair.tagline && (
            <>
              <Text variant="text">{fair.tagline}</Text>
              <Spacer my={3} />
            </>
          )}

          {!!fair.location?.summary && (
            <>
              <Text variant="mediumText">Location</Text>
              <Text variant="text">{fair.location?.summary}</Text>
              <Spacer my={3} />
            </>
          )}

          {!!fair.hours && (
            <>
              <Text variant="mediumText">Hours</Text>
              <Markdown>{fair.hours}</Markdown>
              <Spacer my={3} />
            </>
          )}
          {!!fair.tickets && (
            <>
              <Text variant="mediumText">Tickets</Text>
              <Markdown>{fair.tickets}</Markdown>
              <Spacer my={3} />
            </>
          )}
          {!!fair.ticketsLink && (
            <>
              <TouchableOpacity onPress={() => handleNavigation(fair.ticketsLink!)}>
                <Text variant="mediumText">Buy Tickets</Text>
              </TouchableOpacity>
              <Spacer my={3} />
            </>
          )}
          {!!fair.links && (
            <>
              <Text variant="mediumText">Links</Text>
              <Markdown>{fair.links}</Markdown>
              <Spacer my={3} />
            </>
          )}
          {!!fair.contact && (
            <>
              <Text variant="mediumText">Contact</Text>
              <Markdown>{fair.contact}</Markdown>
              <Spacer my={3} />
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
      location {
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

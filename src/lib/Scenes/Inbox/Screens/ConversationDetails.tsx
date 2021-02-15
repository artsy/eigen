import { ConversationDetails_me } from "__generated__/ConversationDetails_me.graphql"
import { ConversationDetailsQuery } from "__generated__/ConversationDetailsQuery.graphql"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ItemInfoFragmentContainer as ItemInfo } from "lib/Scenes/Inbox/Components/Conversations/ItemInfo"
import { AttachmentListFragmentContainer as AttachmentList } from "lib/Scenes/Inbox/Components/Conversations/Preview/Attachment/AttachmentList"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { track as _track } from "lib/utils/track"
import { Box, Flex, Join, QuestionCircleIcon, Separator, Text, Touchable } from "palette"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"

interface Props {
  me: ConversationDetails_me
  relay: RelayProp
}

export const ConversationDetails: React.FC<Props> = (props) => {
  const conversation = props.me?.conversation
  const partnerName = conversation?.to.name

  const item = conversation?.items?.[0]?.item
  const itemInfoSection = !!item && item.__typename !== "%other" && (
    <Box key="iteminfo-section">
      <Flex flexDirection="column" p="2">
        <Text mb="2" variant="mediumText">
          {item.__typename}
        </Text>

        <Touchable
          onPress={() => {
            navigate(item.href!)
          }}
        >
          <ItemInfo item={item} />
        </Touchable>
      </Flex>
    </Box>
  )

  const attachmentsSection = !!conversation?.messagesConnection && (
    <AttachmentList key="attachment-section" messageConnection={conversation?.messagesConnection} />
  )

  const supportSection = (
    <Flex flexDirection="column" p="2" key="support-section">
      <Text variant="mediumText" mb="2">
        Support
      </Text>
      <Touchable
        onPress={() => {
          navigate("https://support.artsy.net/hc/en-us/sections/360008203054-Contact-a-gallery", { modal: true })
        }}
      >
        <Flex mb="1" flexDirection="row">
          <QuestionCircleIcon mr="1" />
          <Text variant="text">Inquiries FAQ</Text>
        </Flex>
      </Touchable>
    </Flex>
  )

  const sections = [itemInfoSection, attachmentsSection, supportSection]

  return (
    <PageWithSimpleHeader title={partnerName!}>
      <Flex>
        <Join separator={<Separator my="1" />}>{sections}</Join>
      </Flex>
    </PageWithSimpleHeader>
  )
}

export const ConversationDetailsFragmentContainer = createFragmentContainer(ConversationDetails, {
  me: graphql`
    fragment ConversationDetails_me on Me {
      conversation(id: $conversationID) {
        internalID
        id
        to {
          name
          initials
        }
        from {
          email
        }
        messagesConnection(first: 30, sort: DESC) @connection(key: "Details_messagesConnection", filters: []) {
          edges {
            __typename
          }
          ...AttachmentList_messageConnection
        }
        items {
          item {
            __typename
            ... on Artwork {
              href
            }
            ... on Show {
              href
            }
            ...ItemInfo_item
          }
        }
      }
    }
  `,
})

export const ConversationDetailsQueryRenderer: React.SFC<{
  conversationID: string
}> = ({ conversationID }) => {
  return (
    <QueryRenderer<ConversationDetailsQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ConversationDetailsQuery($conversationID: String!) {
          me {
            ...ConversationDetails_me
          }
        }
      `}
      variables={{
        conversationID,
      }}
      render={renderWithLoadProgress(ConversationDetailsFragmentContainer)}
    />
  )
}

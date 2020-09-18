import { ConversationDetails_me } from "__generated__/ConversationDetails_me.graphql"
import { ConversationDetailsQuery } from "__generated__/ConversationDetailsQuery.graphql"
import { ArtworkInfoFragmentContainer as ArtworkInfo } from "lib/Components/Inbox/Conversations/ArtworkInfo"
import { AttachmentListFragmentContainer as AttachmentList } from "lib/Components/Inbox/Conversations/Preview/Attachment/AttachmentList"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Box, Flex, Join, QuestionCircleIcon, Sans, Separator } from "palette"
import React from "react"
import { useRef } from "react"
import { TouchableHighlight, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"
import styled from "styled-components/native"
import { SmallHeadline } from "../Components/Inbox/Typography"
import { track as _track } from "../utils/track"

const Container = styled.View`
  flex-direction: column;
  flex: 1;
`
const Header = styled.View`
  align-self: stretch;
  margin-top: 22px;
  flex-direction: column;
  margin-bottom: 18px;
`

// This makes it really easy to style the HeaderTextContainer with space-between
const PlaceholderView = View

const HeaderTextContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`

const ImageView = styled(OpaqueImageView)`
  width: 80px;
  height: 80px;
  border-radius: 2px;
`

interface Props {
  me: ConversationDetails_me
  relay: RelayProp
}

export const ConversationDetails: React.FC<Props> = (props) => {
  const itemRef = useRef<any>()
  const conversation = props.me?.conversation
  const partnerName = conversation?.to.name

  const item = conversation?.items?.[0]?.item
  const itemInfoSection = !!item && item.__typename !== "%other" && (
    <Box key="iteminfo-section">
      <Flex flexDirection="column" p={2}>
        <Sans mb={2} size="3" weight="medium">
          {item.__typename}
        </Sans>

        <TouchableHighlight
          onPress={() => {
            SwitchBoard.presentNavigationViewController(itemRef.current!, item.href!)
          }}
        >
          <Flex flexDirection="row">
            <Box height="80px" width="80px">
              <ImageView imageURL={item.image?.thumbnailUrl} />
            </Box>
            {item.__typename === "Artwork" && <ArtworkInfo artwork={item} />}
          </Flex>
        </TouchableHighlight>
      </Flex>
    </Box>
  )

  const attachmentsSection = !!conversation?.messagesConnection && (
    <AttachmentList key="attachment-section" messageConnection={conversation?.messagesConnection} />
  )

  const supportSection = (
    <Flex flexDirection="column" p={2} key="support-section">
      <Sans size="3" weight="medium" mb={2}>
        Support
      </Sans>
      <TouchableHighlight
        onPress={() => {
          SwitchBoard.presentModalViewController(
            itemRef.current!,
            "https://support.artsy.net/hc/en-us/sections/360008203054-Contact-a-gallery"
          )
        }}
      >
        <Flex mb={1} flexDirection="row">
          <QuestionCircleIcon mr={1} />
          <Sans size="3">Inquiries FAQ</Sans>
        </Flex>
      </TouchableHighlight>
    </Flex>
  )

  const sections = [itemInfoSection, attachmentsSection, supportSection]

  return (
    <Container ref={itemRef}>
      <Header>
        <HeaderTextContainer>
          <SmallHeadline style={{ fontSize: 14 }}>{partnerName}</SmallHeadline>
          <PlaceholderView />
        </HeaderTextContainer>
      </Header>
      <Flex flexGrow={1}>
        <Join separator={<Separator my={1} />}>{sections}</Join>
      </Flex>
    </Container>
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
              ...ArtworkInfo_artwork
              href
              image {
                thumbnailUrl: url(version: "small")
              }
            }
            ... on Show {
              href
              image: coverImage {
                thumbnailUrl: url(version: "small")
              }
            }
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

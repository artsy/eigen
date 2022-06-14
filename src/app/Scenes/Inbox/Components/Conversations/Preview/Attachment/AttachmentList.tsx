import { AttachmentList_conversation$data } from "__generated__/AttachmentList_conversation.graphql"
import { Box, DocumentIcon, Separator, Spacer, Text } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { FileDownloadFragmentContainer as FileDownload } from "./FileDownload"

interface Props {
  conversation: AttachmentList_conversation$data
}

const AttachmentList: React.FC<Props> = ({ conversation }) => {
  const attachments = conversation?.messagesConnection?.edges
    ?.map((edge) => edge?.node?.attachments)
    ?.filter((attachmentItems) => attachmentItems?.length)
    ?.reduce((previous, current) => current && previous?.concat(current), [])

  if (!attachments || attachments.length === 0) {
    return null
  }

  return (
    <>
      <Box p={2}>
        <FlatList
          data={attachments}
          keyExtractor={(item, index) => String(item?.id || index)}
          renderItem={({ item }) => {
            return item && <FileDownload tiny attachment={item} Icon={DocumentIcon} />
          }}
          ListHeaderComponent={
            <Text variant="md" weight="medium" mb={1}>
              Attachments
            </Text>
          }
          ItemSeparatorComponent={() => <Spacer mb={0.5} />}
        />
      </Box>
      <Separator />
    </>
  )
}

export const AttachmentListFragmentContainer = createFragmentContainer(AttachmentList, {
  conversation: graphql`
    fragment AttachmentList_conversation on Conversation {
      messagesConnection(first: 30, sort: DESC)
        @connection(key: "Details_messagesConnection", filters: []) {
        edges {
          node {
            __typename
            attachments {
              id
              contentType
              ...FileDownload_attachment
            }
          }
        }
      }
    }
  `,
})

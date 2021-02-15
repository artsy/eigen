import { AttachmentList_messageConnection } from "__generated__/AttachmentList_messageConnection.graphql"
import { Box, Spacer, Text } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { FileDownloadFragmentContainer as FileDownload } from "./FileDownload"

interface Props {
  messageConnection: AttachmentList_messageConnection
}

const AttachmentList: React.FC<Props> = (props) => {
  const attachmentItems =
    props.messageConnection?.edges
      ?.map((edge) => edge?.node?.attachments)
      ?.filter((attachments) => attachments && attachments.length > 0)
      ?.reduce((previous, current) => current && previous?.concat(current), [])
      ?.filter((attachment) => attachment && !attachment?.contentType.includes("image")) || []

  return (
    <Box px="1">
      <FlatList
        data={attachmentItems}
        keyExtractor={(item, index) => String(item?.id || index)}
        renderItem={({ item }) => {
          return item && <FileDownload tiny={true} attachment={item} />
        }}
        ListHeaderComponent={
          <Text variant="mediumText" mb="2" px="1">
            Attachments
          </Text>
        }
        ItemSeparatorComponent={() => <Spacer mb="0.5" />}
        ListEmptyComponent={
          <Text px="1" pb="1">
            No Attachments
          </Text>
        }
      />
    </Box>
  )
}

export const AttachmentListFragmentContainer = createFragmentContainer(AttachmentList, {
  messageConnection: graphql`
    fragment AttachmentList_messageConnection on MessageConnection {
      edges {
        node {
          attachments {
            id
            contentType
            ...FileDownload_attachment
          }
        }
      }
    }
  `,
})

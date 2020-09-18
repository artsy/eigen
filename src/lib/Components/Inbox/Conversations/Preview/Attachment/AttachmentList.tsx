import { AttachmentList_messageConnection } from "__generated__/AttachmentList_messageConnection.graphql"
import { Box, Sans, Spacer, Text } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { FileDownload } from "./FileDownload"

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

  const renderAttachment = ({ item }: { item: any }) => {
    return <FileDownload tiny={true} attachment={item} />
  }
  return (
    <Box>
      <Sans px={2} size="3" weight="medium" mb={2}>
        Attachments {}
      </Sans>
      {attachmentItems?.length ? (
        <FlatList
          data={attachmentItems}
          keyExtractor={(item, index) => String(item?.id || index)}
          renderItem={renderAttachment}
          ItemSeparatorComponent={() => <Spacer mb={0.5} />}
        />
      ) : (
        <Text px={2} pb={1}>
          No Attachments
        </Text>
      )}
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
            fileName
            downloadURL
            ...FileDownload_attachment
          }
        }
      }
    }
  `,
})

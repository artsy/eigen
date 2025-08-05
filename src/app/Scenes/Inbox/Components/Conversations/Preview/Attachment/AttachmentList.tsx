import { DocumentIcon } from "@artsy/icons/native"
import { Spacer, Box, Text, Separator } from "@artsy/palette-mobile"
import { AttachmentList_conversation$data } from "__generated__/AttachmentList_conversation.graphql"
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
            if (!item) {
              return null
            }
            return <FileDownload tiny attachment={item} Icon={DocumentIcon} />
          }}
          ListHeaderComponent={
            <Text variant="sm-display" weight="medium" mb={1}>
              Attachments
            </Text>
          }
          ItemSeparatorComponent={() => <Spacer y={0.5} />}
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

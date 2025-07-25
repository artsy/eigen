import { DownloadIcon, IconProps } from "@artsy/icons/native"
import { Flex, Text } from "@artsy/palette-mobile"
import { FileDownload_attachment$data } from "__generated__/FileDownload_attachment.graphql"
import { Linking } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import AttachmentPreview, { AttachmentProps } from "./AttachmentPreview"

import { AttachmentContainer, AttachmentTextContainer } from "./PDFPreview"

export const NoBorderContainer = styled(Flex)`
  flex-direction: row;
`

interface Props extends AttachmentProps {
  attachment: FileDownload_attachment$data
  tiny?: boolean
  Icon?: React.FC<IconProps>
}

const downloadFile = (attachment: FileDownload_attachment$data) => {
  Linking.openURL(attachment.downloadURL)
}

export const FileDownload: React.FC<Props> = ({ attachment, tiny, Icon = DownloadIcon }) => {
  const Container = tiny ? NoBorderContainer : AttachmentContainer
  const iconSize = tiny ? "20px" : "40px"
  return (
    <AttachmentPreview attachment={attachment} onSelected={() => downloadFile(attachment)}>
      <Container alignItems="center">
        <Icon width={iconSize} height={iconSize} mr={1} my={0.5} />
        <AttachmentTextContainer>
          <Text variant="xs">{attachment.fileName}</Text>
        </AttachmentTextContainer>
      </Container>
    </AttachmentPreview>
  )
}

export const FileDownloadFragmentContainer = createFragmentContainer(FileDownload, {
  attachment: graphql`
    fragment FileDownload_attachment on Attachment {
      fileName
      downloadURL
      ...AttachmentPreview_attachment
    }
  `,
})

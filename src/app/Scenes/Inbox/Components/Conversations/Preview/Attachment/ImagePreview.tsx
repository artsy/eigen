import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import AttachmentPreview, { AttachmentProps } from "./AttachmentPreview"

import { ImagePreview_attachment$data } from "__generated__/ImagePreview_attachment.graphql"

const Image = styled(OpaqueImageView)`
  height: 250;
  flex: 1;
`

interface Props extends AttachmentProps {
  attachment: ImagePreview_attachment$data
}

export const ImagePreview: React.FC<Props> = ({ attachment, onSelected }) => (
  <AttachmentPreview attachment={attachment} onSelected={onSelected}>
    <Image imageURL={attachment.downloadURL} />
  </AttachmentPreview>
)

export default createFragmentContainer(ImagePreview, {
  attachment: graphql`
    fragment ImagePreview_attachment on Attachment {
      downloadURL
      ...AttachmentPreview_attachment
    }
  `,
})

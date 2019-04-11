import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import OpaqueImageView from "lib/Components/OpaqueImageView"
import AttachmentPreview, { AttachmentProps } from "./AttachmentPreview"

import { ImagePreview_attachment } from "__generated__/ImagePreview_attachment.graphql"

const Image = styled(OpaqueImageView)`
  height: 150;
  flex: 1;
`

interface Props extends AttachmentProps {
  attachment: ImagePreview_attachment
}

export const ImagePreview: React.SFC<Props> = ({ attachment, onSelected }) => (
  <AttachmentPreview attachment={attachment as any} onSelected={onSelected}>
    <Image imageURL={attachment.download_url} />
  </AttachmentPreview>
)

export default createFragmentContainer(ImagePreview, {
  attachment: graphql`
    fragment ImagePreview_attachment on Attachment {
      download_url
      ...AttachmentPreview_attachment
    }
  `,
})

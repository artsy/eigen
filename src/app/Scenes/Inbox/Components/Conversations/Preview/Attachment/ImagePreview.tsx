import { Image } from "@artsy/palette-mobile"
import { ImagePreview_attachment$data } from "__generated__/ImagePreview_attachment.graphql"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import AttachmentPreview, { AttachmentProps } from "./AttachmentPreview"

const ImageView = styled(Image)`
  height: 250px;
  flex: 1;
`

interface Props extends AttachmentProps {
  attachment: ImagePreview_attachment$data
}

export const ImagePreview: React.FC<Props> = ({ attachment, onSelected }) => (
  <AttachmentPreview attachment={attachment} onSelected={onSelected}>
    <ImageView src={attachment.downloadURL} />
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

import { Image } from "@artsy/palette-mobile"
import { ImagePreview_attachment$data } from "__generated__/ImagePreview_attachment.graphql"
import { createFragmentContainer, graphql } from "react-relay"

import AttachmentPreview, { AttachmentProps } from "./AttachmentPreview"

interface Props extends AttachmentProps {
  attachment: ImagePreview_attachment$data
}

const IMAGE_SIZE = 235

export const ImagePreview: React.FC<Props> = ({ attachment, onSelected }) => {
  return (
    <AttachmentPreview attachment={attachment} onSelected={onSelected}>
      <Image
        src={attachment.downloadURL}
        height={IMAGE_SIZE}
        width={IMAGE_SIZE}
        style={{ backgroundColor: "red", borderRadius: 10 }}
      />
    </AttachmentPreview>
  )
}

export default createFragmentContainer(ImagePreview, {
  attachment: graphql`
    fragment ImagePreview_attachment on Attachment {
      downloadURL

      ...AttachmentPreview_attachment
    }
  `,
})

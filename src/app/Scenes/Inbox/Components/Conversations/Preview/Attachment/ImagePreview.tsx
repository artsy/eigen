import { Image } from "@artsy/palette-mobile"
import { ImagePreview_attachment$data } from "__generated__/ImagePreview_attachment.graphql"
import { useMediaPreview } from "app/Scenes/Inbox/hooks/useMediaPreview"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import AttachmentPreview from "./AttachmentPreview"

interface Props {
  attachment: ImagePreview_attachment$data
  mimeType: string
  cacheKey: string
}

const IMAGE_SIZE = 235

export const ImagePreview: React.FC<Props> = ({ attachment, mimeType, cacheKey }) => {
  const { openPreview } = useMediaPreview(attachment.downloadURL, mimeType, cacheKey)

  return (
    <AttachmentPreview attachment={attachment} onSelected={openPreview}>
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

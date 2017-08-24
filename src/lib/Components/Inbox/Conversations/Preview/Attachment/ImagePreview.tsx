import * as React from "react"
import { TouchableHighlight } from "react-native"
import { createFragmentContainer, graphql } from "react-relay/compat"
import styled from "styled-components/native"

import colors from "../../../../../../data/colors"
import fonts from "../../../../../../data/fonts"

import OpaqueImageView from "../../../../OpaqueImageView"
import AttachmentPreview, { AttachmentProps } from "./AttachmentPreview"

const Image = styled(OpaqueImageView)`
  height: 150;
  flex: 1;
`

interface Props extends AttachmentProps, RelayProps {}

export const ImagePreview: React.SFC<Props> = ({ attachment, onSelected }) =>
  <AttachmentPreview attachment={attachment as any} onSelected={onSelected}>
    <Image imageURL={attachment.download_url} />
  </AttachmentPreview>

export default createFragmentContainer(
  ImagePreview,
  graphql`
    fragment ImagePreview_attachment on Attachment {
      download_url
      ...AttachmentPreview_attachment
    }
  `
)

interface RelayProps {
  attachment: {
    download_url?: string
  }
}

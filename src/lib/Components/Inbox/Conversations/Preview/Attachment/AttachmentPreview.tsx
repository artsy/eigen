import React from "react"
import { findNodeHandle } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import { AttachmentPreview_attachment } from "__generated__/AttachmentPreview_attachment.graphql"
import { color, Touchable } from "palette"

const Container = styled.View`
  flex-direction: row;
`

export interface AttachmentProps {
  // reactNodeHandle is passed to the native side to decide which UIView to show the
  // download progress bar on.
  onSelected?: (reactNodeHandle: number, attachmentID: string) => void
}

interface Props extends AttachmentProps {
  attachment: AttachmentPreview_attachment
}

export class AttachmentPreview extends React.Component<Props> {
  render() {
    const { attachment, children, onSelected } = this.props
    return (
      <Touchable
        underlayColor={color("black5")}
        onPress={() => onSelected?.(findNodeHandle(this)!, attachment.internalID)}
      >
        <Container>{children}</Container>
      </Touchable>
    )
  }
}

export default createFragmentContainer(AttachmentPreview, {
  attachment: graphql`
    fragment AttachmentPreview_attachment on Attachment {
      internalID
    }
  `,
})

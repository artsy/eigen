import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { TouchableHighlight } from "react-native"
import styled from "styled-components/native"

import colors from "lib/data/colors"

import { AttachmentPreview_attachment } from "__generated__/AttachmentPreview_attachment.graphql"

const Container = styled.View`
  flex-direction: row;
`

export interface AttachmentProps {
  /**
   * This callback is bound to the attachment preview component, meaning that `this` refers to the instance you can pass
   * to e.g. `findNodeHandle`.
   */
  onSelected?: (attachmentID: string) => void
}

interface Props extends AttachmentProps {
  attachment: AttachmentPreview_attachment
}

export class AttachmentPreview extends React.Component<Props> {
  render() {
    const { attachment, children, onSelected } = this.props
    return (
      <TouchableHighlight
        underlayColor={colors["gray-light"]}
        onPress={onSelected && onSelected.bind(this, attachment.internalID)}
      >
        <Container>{children}</Container>
      </TouchableHighlight>
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

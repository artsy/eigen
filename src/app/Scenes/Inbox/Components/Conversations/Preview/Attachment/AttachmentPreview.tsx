import { Touchable } from "@artsy/palette-mobile"
import { AttachmentPreview_attachment$data } from "__generated__/AttachmentPreview_attachment.graphql"
import { ThemeAwareClassTheme } from "app/Components/DarkModeClassTheme"
import React from "react"
import { findNodeHandle } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

const Container = styled.View`
  flex-direction: column;
  flex: 1;
  flex-grow: 1;
`

export interface AttachmentProps {
  // reactNodeHandle is passed to the native side to decide which UIView to show the
  // download progress bar on.
  onSelected?: (reactNodeHandle: number, attachmentID: string) => void
}

interface Props extends AttachmentProps {
  attachment: AttachmentPreview_attachment$data
}

export class AttachmentPreview extends React.Component<Props> {
  render() {
    const { attachment, children, onSelected } = this.props
    return (
      <ThemeAwareClassTheme>
        {({ color }) => (
          <Touchable
            accessibilityRole="button"
            underlayColor={color("mono5")}
            onPress={() => onSelected?.(findNodeHandle(this)!, attachment.internalID)}
          >
            <Container>{children}</Container>
          </Touchable>
        )}
      </ThemeAwareClassTheme>
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

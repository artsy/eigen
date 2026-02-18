import { Touchable } from "@artsy/palette-mobile"
import { AttachmentPreview_attachment$data } from "__generated__/AttachmentPreview_attachment.graphql"
import React, { useRef } from "react"
import { View, findNodeHandle } from "react-native"
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

export const AttachmentPreview: React.FC<React.PropsWithChildren<Props>> = ({
  attachment,
  children,
  onSelected,
}) => {
  const containerRef = useRef(null)

  const handlePress = () => {
    const nodeHandle = findNodeHandle(containerRef.current)
    if (nodeHandle) {
      onSelected?.(nodeHandle, attachment.internalID)
    }
  }

  return (
    <View ref={containerRef}>
      <Touchable accessibilityRole="button" underlayColor="mono5" onPress={handlePress}>
        <Container>{children}</Container>
      </Touchable>
    </View>
  )
}

export default createFragmentContainer(AttachmentPreview, {
  attachment: graphql`
    fragment AttachmentPreview_attachment on Attachment {
      internalID
    }
  `,
})

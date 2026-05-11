import { Touchable } from "@artsy/palette-mobile"
import { AttachmentPreview_attachment$data } from "__generated__/AttachmentPreview_attachment.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

const Container = styled.View`
  flex-direction: column;
  flex: 1;
  flex-grow: 1;
`

export interface AttachmentProps {
  onSelected?: () => void
}

interface Props extends AttachmentProps {
  attachment: AttachmentPreview_attachment$data
}

export const AttachmentPreview: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  onSelected,
}) => {
  return (
    <Touchable accessibilityRole="button" underlayColor="mono5" onPress={onSelected}>
      <Container>{children}</Container>
    </Touchable>
  )
}

export default createFragmentContainer(AttachmentPreview, {
  attachment: graphql`
    fragment AttachmentPreview_attachment on Attachment {
      internalID
    }
  `,
})

import * as React from "react"
import * as Relay from "react-relay"

import { TouchableHighlight } from "react-native"
import styled from "styled-components/native"

import colors from "../../../../../../data/colors"
import fonts from "../../../../../../data/fonts"

const Container = styled.View`flex-direction: row;`

export interface AttachmentProps {
  onSelected?: (attachmentID: string) => void
}

interface Props extends AttachmentProps, RelayProps {}

export const AttachmentPreview: React.SFC<Props> = ({ attachment, children, onSelected }) =>
  <TouchableHighlight underlayColor={colors["gray-light"]} onPress={() => onSelected && onSelected(attachment.id)}>
    <Container>
      {children}
    </Container>
  </TouchableHighlight>

export default Relay.createContainer(AttachmentPreview, {
  fragments: {
    attachment: () => Relay.QL`
      fragment on AttachmentType {
        id
      }
    `,
  },
})

interface RelayProps {
  attachment: {
    id: string
  }
}

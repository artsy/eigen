import * as React from "react"
import * as Relay from "react-relay"

import { TouchableHighlight } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../../data/colors"
import fonts from "../../../../../data/fonts"
import OpaqueImageView from "../../../OpaqueImageView"

const Container = styled.View`flexDirection: row;`

const VerticalLayout = styled.View`
  flex: 1
  flex-direction: column
`

const Image = styled(OpaqueImageView)`
  height: 150
  flex: 1
`

interface Props extends RelayProps {
  onSelected?: (attachmentID: string) => void
}

export class ImagePreview extends React.Component<Props, void> {
  onSelected() {
    if (this.props.onSelected) {
      this.props.onSelected(this.props.imageAttachment.id)
    }
  }

  render() {
    return (
      <TouchableHighlight underlayColor={colors["gray-light"]} onPress={this.onSelected.bind(this)}>
        <Container>
          <Image imageURL={this.props.imageAttachment.download_url} />
        </Container>
      </TouchableHighlight>
    )
  }
}

export default Relay.createContainer(ImagePreview, {
  fragments: {
    imageAttachment: () => Relay.QL`
      fragment on AttachmentType {
        id
        download_url
      }
    `,
  },
})

interface RelayProps {
  imageAttachment: {
    id: string
    download_url?: string
  }
}

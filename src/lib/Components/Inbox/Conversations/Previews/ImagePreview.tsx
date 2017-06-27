import * as React from "react"
import * as Relay from "react-relay"

import { TouchableHighlight } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../../data/colors"
import fonts from "../../../../../data/fonts"
import OpaqueImageView from "../../../OpaqueImageView"

const Container = styled.View`
  borderWidth: 1
  borderColor: ${colors["gray-regular"]}
  flexDirection: row
`

const VerticalLayout = styled.View`
  flex: 1
  flex-direction: column
`

const Image = styled(OpaqueImageView)`
  marginTop: 12
  marginLeft: 12
  marginBottom: 12
  width: 80
  height: 55
`

interface Props {
  url: string
  onSelected?: () => void
}

export default class ImagePreview extends React.Component<Props, any> {
  render() {
    return (
      <TouchableHighlight underlayColor={colors["gray-light"]} onPress={this.props.onSelected}>
        <Container>
          <Image skipGemini={true} imageURL={this.props.url} />
        </Container>
      </TouchableHighlight>
    )
  }
}

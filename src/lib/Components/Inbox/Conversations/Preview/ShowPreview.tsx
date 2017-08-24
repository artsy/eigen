import * as React from "react"
import { createFragmentContainer, graphql } from "react-relay/compat"

import { TouchableHighlight } from "react-native"

import { PreviewText as P, Subtitle } from "../../Typography"

import styled from "styled-components/native"
import colors from "../../../../../data/colors"
import fonts from "../../../../../data/fonts"
import OpaqueImageView from "../../../OpaqueImageView"

const Container = styled.View`
  border-width: 1;
  border-color: ${colors["gray-regular"]};
  flex-direction: row;
`

const VerticalLayout = styled.View`
  flex: 1;
  flex-direction: column;
`

const Image = styled(OpaqueImageView)`
  margin-top: 12;
  margin-left: 12;
  margin-bottom: 12;
  width: 80;
  height: 55;
`

const TextContainer = styled(VerticalLayout)`
  margin-left: 25;
  margin-top: 25;
  align-self: center;
`

const SerifText = styled(P)`
  font-size: 14;
`

const Title = styled.Text`
  font-family: ${fonts["garamond-italic"]};
  flex: 3;
  font-size: 14;
`

interface Props extends RelayProps {
  onSelected?: () => void
}

export class ShowPreview extends React.Component<Props, any> {
  render() {
    const show = this.props.show
    const name = show.fair ? show.fair.name : show.name
    return (
      <TouchableHighlight underlayColor={colors["gray-light"]} onPress={this.props.onSelected}>
        <Container>
          <Image imageURL={show.cover_image.url} />
          <TextContainer>
            <SerifText>
              {show.partner.name}
            </SerifText>
            <Title numberOfLines={1}>
              {name}
            </Title>
          </TextContainer>
        </Container>
      </TouchableHighlight>
    )
  }
}

export default createFragmentContainer(
  ShowPreview,
  graphql`
    fragment ShowPreview_show on Show {
      name
      cover_image {
        url
      }
      fair {
        name
      }
      partner {
        ... on Partner {
          name
        }
      }
    }
  `
)

interface RelayProps {
  show: {
    name: string | null
    cover_image: {
      url: string | null
    } | null
    fair: {
      name: string | null
    } | null
    partner: {
      name: string | null
    } | null
  }
}

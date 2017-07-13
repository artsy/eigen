import * as React from "react"
import * as Relay from "react-relay"

import { TouchableHighlight } from "react-native"

import { PreviewText as P, Subtitle } from "../../Typography"

import styled from "styled-components/native"
import colors from "../../../../../data/colors"
import fonts from "../../../../../data/fonts"
import OpaqueImageView from "../../../OpaqueImageView"

const Container = styled.View`
  borderWidth: 1;
  borderColor: ${colors["gray-regular"]};
  flexDirection: row;
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

const TextContainer = styled(VerticalLayout)`
  marginLeft: 25
  alignSelf: center
`

const SerifText = styled(P)`
  fontSize: 14
`

const TitleAndDate = styled.View`
  marginTop: 3
  flex-direction: row
`

const Title = styled.Text`
  font-family: ${fonts["garamond-italic"]}
  flex: 3
  font-size: 14
`

const Date = styled(SerifText)`
  flex: 1
`

interface Props extends RelayProps {
  onSelected?: () => void
}

export class ArtworkPreview extends React.Component<Props, any> {
  render() {
    const artwork = this.props.artwork

    return (
      <TouchableHighlight underlayColor={colors["gray-light"]} onPress={this.props.onSelected}>
        <Container>
          <Image imageURL={artwork.image.url} />
          <TextContainer>
            <SerifText>
              {artwork.artist_names}
            </SerifText>
            <TitleAndDate>
              <Title numberOfLines={1}>
                {artwork.title}
              </Title>
              {!!artwork.date && <Date>{`, ${artwork.date}`}</Date>}
            </TitleAndDate>
          </TextContainer>
        </Container>
      </TouchableHighlight>
    )
  }
}

export default Relay.createContainer(ArtworkPreview, {
  fragments: {
    artwork: () => Relay.QL`
      fragment on Artwork {
        title
        artist_names
        date
        image {
          url
        }
      }
    `,
  },
})

interface RelayProps {
  artwork: {
    title: string | null
    artist_names: string | null
    date: string | null
    image: {
      url: string | null
    } | null
  }
}

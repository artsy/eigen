import * as React from "react"
import * as Relay from "react-relay"

import { TouchableHighlight } from "react-native"

import { PreviewText as P, Subtitle } from "../Typography"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"
import OpaqueImageView from "../../OpaqueImageView"

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

const TextContainer = styled(VerticalLayout)`
  marginLeft: 25
  alignSelf: center
`

const SerifText = styled(P)`
  fontSize: 14
`

const TitleAndDate = styled(Subtitle)`
  marginTop: 3
`

interface Props extends RelayProps {
  onSelected?: () => void
}

export class ArtworkPreview extends React.Component<any, any> {
  render() {
    const artwork = this.props.artwork

    return (
      <TouchableHighlight underlayColor={colors["gray-light"]} onPress={this.props.onSelected}>
        <Container>
          <Image imageURL={artwork.image.url} />
          <TextContainer>
            <SerifText>{artwork.artist_names}</SerifText>
            <TitleAndDate>
              {artwork.title}
              {artwork.date && <SerifText>{`, ${artwork.date}`}</SerifText>}
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
    title: string
    artist_names: string
    date: string | null
    image: {
      url: string
    }
  }
}

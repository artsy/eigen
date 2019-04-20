import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { TouchableHighlight } from "react-native"

import { PreviewText as P, Subtitle } from "../../Typography"

import { Schema, Track, track as _track } from "../../../../utils/track"

import OpaqueImageView from "lib/Components/OpaqueImageView"
import { Colors } from "lib/data/colors"
import { Fonts } from "lib/data/fonts"
import styled from "styled-components/native"

import { ArtworkPreview_artwork } from "__generated__/ArtworkPreview_artwork.graphql"

const Container = styled.View`
  border-width: 1;
  border-color: ${Colors.GrayRegular};
  flex-direction: row;
`

const VerticalLayout = styled.View`
  flex: 1;
  flex-direction: column;
`

const Image = styled(OpaqueImageView)`
  margin-top: 12;
  margin-left: 12;
  margin-right: 12;
  margin-bottom: 12;
  width: 80;
  height: 55;
`

const TextContainer = styled(VerticalLayout)`
  align-self: center;
`

const SerifText = styled(P)`
  font-size: 14;
`

const Date = styled.Text`
  font-family: ${Fonts.GaramondRegular};
`

const TitleAndDate = styled.View`
  margin-top: 3;
  margin-right: 12;
  flex-direction: row;
  justify-content: flex-start;
`
interface Props {
  artwork: ArtworkPreview_artwork
  onSelected?: () => void
}

const track: Track<Props> = _track

@track()
export class ArtworkPreview extends React.Component<Props> {
  @track(props => ({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.ConversationAttachmentArtwork,
    owner_type: Schema.OwnerEntityTypes.Artwork,
    owner_id: props.artwork._id,
    owner_slug: props.artwork.gravityID,
  }))
  attachmentSelected() {
    this.props.onSelected()
  }

  render() {
    const artwork = this.props.artwork

    return (
      <TouchableHighlight
        underlayColor={Colors.GrayLight}
        onPress={this.props.onSelected && this.attachmentSelected.bind(this)}
      >
        <Container>
          <Image imageURL={artwork.image.url} />
          <TextContainer>
            <SerifText>{artwork.artist_names}</SerifText>
            <TitleAndDate>
              {/* Nested Text components are necessary for the correct behaviour on both short and long titles + dates */}
              <Subtitle numberOfLines={1} ellipsizeMode={"middle"}>
                {`${artwork.title}`}
                <Date>{`, ${artwork.date}`}</Date>
              </Subtitle>
            </TitleAndDate>
          </TextContainer>
        </Container>
      </TouchableHighlight>
    )
  }
}

export default createFragmentContainer(ArtworkPreview, {
  artwork: graphql`
    fragment ArtworkPreview_artwork on Artwork {
      gravityID
      _id
      title
      artist_names
      date
      image {
        url
      }
    }
  `,
})

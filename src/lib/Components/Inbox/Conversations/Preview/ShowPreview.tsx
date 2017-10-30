import * as React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { TouchableHighlight } from "react-native"

import { PreviewText as P, Subtitle } from "../../Typography"

import { Schema, Track, track as _track } from "../../../../utils/track"

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

const track: Track<Props, null, Schema.Entity> = _track

@track()
export class ShowPreview extends React.Component<Props, any> {
  @track((props, state) => ({
    action_type: Schema.ActionEventTypes.Tap,
    action_name: Schema.ActionEventNames.ConversationAttachmentShow,
    owner_type: Schema.OwnerEntityTypes.Show,
    owner_slug: props.show.id,
    owner_id: props.show._id,
  }))
  attachmentSelected() {
    this.props.onSelected()
  }

  render() {
    const show = this.props.show
    const name = show.fair ? show.fair.name : show.name
    return (
      <TouchableHighlight underlayColor={colors["gray-light"]} onPress={() => this.attachmentSelected()}>
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
      id
      _id
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
    id: string | null
    _id: string | null
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

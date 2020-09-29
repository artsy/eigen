import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { Schema, Track, track as _track } from "../../../../utils/track"

import { color, Flex, Text, Touchable } from "palette"

import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import colors from "lib/data/colors"
import styled from "styled-components/native"

import { ShowPreview_show } from "__generated__/ShowPreview_show.graphql"

const Container = styled.View`
  background-color: ${color("black100")};
  border-radius: 15;
  overflow: hidden;
  margin-bottom: 5;
`

const ImageContainer = styled(Flex)`
  background-color: ${color("black10")};
  padding: 10px;
  flex: 1;
`

const VerticalLayout = styled.View`
  flex: 1;
  flex-direction: column;
`

const TextContainer = styled(VerticalLayout)`
  align-self: flex-start;
  padding: 10px;
  flex-grow: 0;
`

interface Props {
  show: ShowPreview_show
  onSelected?: () => void
}

const track: Track<Props> = _track

@track()
export class ShowPreview extends React.Component<Props> {
  @track((props) => ({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.ConversationAttachmentShow,
    owner_type: Schema.OwnerEntityTypes.Show,
    owner_slug: props.show.slug,
    owner_id: props.show.internalID,
  }))
  attachmentSelected() {
    // @ts-ignore STRICTNESS_MIGRATION
    this.props.onSelected()
  }

  render() {
    const show = this.props.show
    const name = show.fair ? show.fair.name : show.name
    return (
      <Touchable
        underlayColor={colors["gray-light"]}
        onPress={() => this.attachmentSelected()}
        style={{ maxWidth: "66.67%", flex: 1 }}
      >
        <Container>
          <ImageContainer>
            <OpaqueImageView
              imageURL={
                // @ts-ignore STRICTNESS_MIGRATION
                show.coverImage.url
              }
              style={{ flex: 1 }}
              aspectRatio={show.coverImage?.aspectRatio}
            />
          </ImageContainer>
          <TextContainer>
            <Text variant="mediumText" color="white100">
              {name}
            </Text>
            <Text variant="small" color="white100" numberOfLines={1} ellipsizeMode={"middle"}>
              {
                // @ts-ignore STRICTNESS_MIGRATION
                show.partner.name
              }
            </Text>
          </TextContainer>
        </Container>
      </Touchable>
    )
  }
}

export default createFragmentContainer(ShowPreview, {
  show: graphql`
    fragment ShowPreview_show on Show {
      slug
      internalID
      name
      coverImage {
        url
        aspectRatio
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
  `,
})

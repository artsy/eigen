import React from "react"

import { Box, Serif, Spacer } from "@artsy/palette"
import { ShowHeader_show } from "__generated__/ShowHeader_show.graphql"
import { InvertedButton } from "lib/Components/Buttons"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { createFragmentContainer, graphql } from "react-relay"

import { Carousel } from "lib/Components/Carousel"
import styled from "styled-components/native"
import { Chip } from "./Components/Chip"

interface Props {
  show: ShowHeader_show
  onSaveShowPressed: () => Promise<void>
  onMoreInformationPressed: () => void
}

const ButtonWrapper = styled(Box)`
  margin-bottom: 20px;
`

export class ShowHeader extends React.Component<Props> {
  render() {
    const {
      show: { images, name, exhibition_period, status, description },
      onSaveShowPressed,
      onMoreInformationPressed,
    } = this.props
    return (
      <>
        <Carousel
          sources={(images || []).map(({ url: imageURL, aspect_ratio: aspectRatio }) => ({ imageURL, aspectRatio }))}
        />
        <Serif size="5t" weight="semibold" textAlign="center">
          {name}
        </Serif>
        <Serif size="3" textAlign="center">
          {exhibition_period}
        </Serif>
        <ButtonWrapper px={2}>
          <Chip>{status}</Chip>
          <Spacer m={2} />
          <InvertedButton
            text="Save"
            onPress={() => {
              onSaveShowPressed()
            }}
          />
          <Spacer m={2} />
          <Serif size="2">{description}</Serif>
          <Spacer m={1} />
          <CaretButton text="More Information" onPress={() => onMoreInformationPressed()} />
        </ButtonWrapper>
      </>
    )
  }
}

export const ShowHeaderContainer = createFragmentContainer(
  ShowHeader,
  graphql`
    fragment ShowHeader_show on Show {
      name
      description
      press_release
      exhibition_period
      status
      images {
        url
        aspect_ratio
      }
    }
  `
)

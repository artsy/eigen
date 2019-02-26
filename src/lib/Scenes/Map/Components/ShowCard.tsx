import { Box, color, Sans, Serif } from "@artsy/palette"
import React, { Component } from "react"
import styled from "styled-components/native"

const Background = styled(Box)`
  background: ${color("white100")};
`

interface ShowCardProps {
  title: string
  partnerName: string
  dates: string
  imageURL: string
  onSave?: () => void
}

export class ShowCard extends Component<ShowCardProps> {
  render() {
    const { title, partnerName, dates } = this.props
    return (
      <Background>
        <Box>
          <Sans size="3t" weight="medium">
            {title}
          </Sans>
          <Serif size="3t" color="black100">
            {partnerName}
          </Serif>
          <Sans size="3t" color="black60">
            {dates}
          </Sans>
        </Box>
      </Background>
    )
  }
}

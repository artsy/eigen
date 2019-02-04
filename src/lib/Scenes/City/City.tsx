import { Box, color, Flex, Serif } from "@artsy/palette"
import React, { Component } from "react"
import styled from "styled-components/native"
import { EventEmitter } from "../Map/EventEmitter"
import { Tab } from "../Map/types"
import { AllEvents } from "./Components/AllEvents"

interface State {
  shows: any[]
  fairs: any[]
  filter: Tab
}

export class CityView extends Component<null, State> {
  state = {
    shows: [],
    fairs: [],
    filter: { id: "all", text: "All events" },
  }

  componentWillMount() {
    EventEmitter.subscribe("map:change", ({ filter, city }) => {
      const { shows, fairs } = city
      console.log(city)

      this.setState({
        shows,
        fairs,
        title: filter.id === "all" ? "All events" : filter.text,
      })
    })
  }

  render() {
    return (
      <Box>
        <Flex py={3} alignItems="center">
          <Handle />
        </Flex>
        <Box px={3}>
          <Serif size="8">{this.state.title}</Serif>
        </Box>
      </Box>
    )
  }
}

const Handle = styled.View`
  width: 40px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${color("black30")};
`

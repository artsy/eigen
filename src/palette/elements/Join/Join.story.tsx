import { storiesOf } from "@storybook/react"
import React, { Component } from "react"
import { Box } from "../Box/Box"
import { Separator } from "../Separator/Separator"
import { Join } from "./Join"

const BlankFunction = () => {
  return null
}

const NonBlankFunction = () => {
  return <div>Non blank Function</div>
}

const BlankSFC: React.SFC = () => null

const NonBlankSFC: React.SFC = () => <div>Non blanks stateless component</div>

class BlankComponent extends Component {
  render() {
    return null
  }
}

class NonBlankComponent extends Component {
  render() {
    return <Box>Non Blank Component</Box>
  }
}

storiesOf("Components/Join", module)
  .add("with multiple components", () => {
    return (
      <Join separator={<Separator m={1} />}>
        <Box>Fist in the list</Box>
        <Box>Second in the list</Box>
      </Join>
    )
  })
  .add("with one component", () => {
    return (
      <Join separator={<Separator m={1} />}>
        <Box>Only one component here</Box>
      </Join>
    )
  })
  .add("with some of the children empty", () => {
    return (
      <Join separator={<Separator m={1} />}>
        <Box>Fist in the list</Box>
        <BlankFunction />
        <NonBlankFunction />
        <BlankSFC />
        <NonBlankSFC />
        <BlankComponent />
        <NonBlankComponent />
        <Box m="2" />
        <div>Some div with the content</div>
        <div />
        <Box>Another box with content</Box>
        <div />
      </Join>
    )
  })

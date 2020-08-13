import { storiesOf } from "@storybook/react"
import React from "react"
import styled from "styled-components"
import { Button } from "./Button"

const StyledButton = styled(Button)`
  border: 2px solid red;
`

storiesOf("Components/Button", module)
  .add("small", () => {
    return (
      <>
        <Button size="small" variant="primaryBlack" mr={1}>
          primaryBlack
        </Button>
        <Button size="small" variant="primaryWhite" mr={1}>
          primaryWhite
        </Button>
        <Button size="small" variant="secondaryGray" mr={1}>
          secondaryGray
        </Button>
        <Button size="small" variant="secondaryOutline" mr={1}>
          secondaryOutline
        </Button>
        <Button size="small" variant="noOutline">
          noOutline
        </Button>
      </>
    )
  })
  .add("medium", () => {
    return (
      <>
        <Button size="medium" variant="primaryBlack" mr={1}>
          primaryBlack
        </Button>
        <Button size="medium" variant="primaryWhite" mr={1}>
          primaryWhite
        </Button>
        <Button size="medium" variant="secondaryGray" mr={1}>
          secondaryGray
        </Button>
        <Button size="medium" variant="secondaryOutline" mr={1}>
          secondaryOutline
        </Button>
        <Button size="medium" variant="noOutline">
          noOutline
        </Button>
      </>
    )
  })
  .add("large", () => {
    return (
      <>
        <Button size="large" variant="primaryBlack" mr={1}>
          primaryBlack
        </Button>
        <Button size="large" variant="primaryWhite" mr={1}>
          primaryWhite
        </Button>
        <Button size="large" variant="secondaryGray" mr={1}>
          secondaryGray
        </Button>
        <Button size="large" variant="secondaryOutline" mr={1}>
          secondaryOutline
        </Button>
        <Button size="large" variant="noOutline">
          noOutline
        </Button>
      </>
    )
  })
  .add("styled(Button)", () => {
    return (
      <>
        <StyledButton size="large" variant="primaryBlack" mr={1}>
          primaryBlack
        </StyledButton>
        <StyledButton size="large" variant="primaryWhite" mr={1}>
          primaryWhite
        </StyledButton>
        <StyledButton size="large" variant="secondaryGray" mr={1}>
          secondaryGray
        </StyledButton>
        <StyledButton size="large" variant="secondaryOutline" mr={1}>
          secondaryOutline
        </StyledButton>
        <StyledButton size="large" variant="noOutline">
          noOutline
        </StyledButton>
      </>
    )
  })

import { storiesOf } from "@storybook/react"
import React from "react"
import { Button } from "../Button"
import { Modal } from "./Modal"

storiesOf("Components/Modal", module)
  .add(
    "Default",
    () => {
      return (
        <Modal show onClose={() => null}>
          Some example content
        </Modal>
      )
    },
    { chromatic: { delay: 500 } }
  )
  .add(
    "With title",
    () => {
      return (
        <Modal show title="Modal Title" onClose={() => null}>
          Some example content
        </Modal>
      )
    },
    { chromatic: { delay: 500 } }
  )
  .add(
    "With logo",
    () => {
      return (
        <Modal show title="Modal Title" hasLogo onClose={() => null}>
          Some example content
        </Modal>
      )
    },
    { chromatic: { delay: 500 } }
  )
  .add(
    "Modal with fixed button",
    () => {
      return (
        <Modal
          show
          title="Modal Title"
          onClose={() => null}
          FixedButton={<Button width="100%">Click me</Button>}
        >
          Some example content
        </Modal>
      )
    },
    { chromatic: { delay: 500 } }
  )
  .add(
    "Wide modal",
    () => {
      return (
        <Modal show title="Modal Title" isWide onClose={() => null}>
          Some example content
        </Modal>
      )
    },
    { chromatic: { delay: 500 } }
  )

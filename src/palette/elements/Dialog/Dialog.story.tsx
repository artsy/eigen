import { storiesOf } from "@storybook/react"
import React from "react"
import { Dialog } from "./Dialog"

storiesOf("Components/Dialog", module)
  .add(
    "Minimal",
    () => {
      return (
        <Dialog
          title="Here is a dialog which is modal"
          primaryCta={{
            action: () => ({}),
            text: "Continue",
          }}
        />
      )
    },
    { chromatic: { delay: 500 } }
  )
  .add(
    "With detail",
    () => {
      return (
        <Dialog
          title="Information"
          detail="This extra informaton is important."
          primaryCta={{
            action: () => ({}),
            text: "Continue",
          }}
        />
      )
    },
    { chromatic: { delay: 500 } }
  )
  .add(
    "With secondary Cta",
    () => {
      return (
        <Dialog
          title="Information"
          detail="This extra informaton is important."
          primaryCta={{
            action: () => ({}),
            text: "Continue",
          }}
          secondaryCta={{
            action: () => ({}),
            text: "Cancel",
          }}
        />
      )
    },
    { chromatic: { delay: 500 } }
  )

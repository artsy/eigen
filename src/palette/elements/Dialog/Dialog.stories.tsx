import { action } from "@storybook/addon-actions"
import { storiesOf } from "@storybook/react-native"
import React from "react"
import { useState } from "react"
import { withThemeV3 } from "storybook/decorators"
import { CenterView } from "storybook/helpers"
import { Dialog, DialogProps } from "."
import { Button } from "../Button/Button"

const DialogDemo: React.FC<Omit<DialogProps, "isVisible" | "primaryCta" | "title">> = (props) => {
  const [visible, setVisible] = useState(false)

  return (
    <CenterView>
      <Button onPress={() => setVisible(true)}>Show</Button>
      <Dialog
        isVisible={visible}
        title="Dialog Title"
        primaryCta={{
          text: "OK",
          onPress: () => setVisible(false),
        }}
        {...props}
      />
    </CenterView>
  )
}

storiesOf("Dialog", module)
  .addDecorator(withThemeV3)
  .add("Default", () => <DialogDemo />)
  .add("With secondary action", () => (
    <DialogDemo
      secondaryCta={{
        text: "Cancel",
        onPress: () => action(`tapped "Cancel" button`),
      }}
    />
  ))
  .add("With details", () => (
    <DialogDemo detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." />
  ))
  .add("With long details", () => (
    <DialogDemo
      detail={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.".repeat(
        100
      )}
    />
  ))
  .add("With background press handler", () => <DialogDemo onBackgroundPress={() => action("tapped background")} />)

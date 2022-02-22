import { action } from "@storybook/addon-actions"
import { storiesOf } from "@storybook/react-native"
import { Button } from "palette/elements/Button"
import React from "react"
import { withTheme } from "storybook/decorators"
import { DataList, List } from "storybook/helpers"
import { PopoverMessageItem, PopoverMessageType } from "./PopoverMessage"
import { usePopoverMessage } from "./popoverMessageHooks"

const variants: PopoverMessageType[] = ["default", "error", "info", "success"]

const PopoverMessage: React.FC<PopoverMessageItem & { label: string }> = (props) => {
  const { label, onPress, ...popoverMessageProps } = props
  const popoverMessage = usePopoverMessage()

  return (
    <Button
      onPress={() => {
        popoverMessage.show({
          ...popoverMessageProps,
          onPress: () => {
            onPress?.()
          },
        })
      }}
    >
      {label}
    </Button>
  )
}

storiesOf("Popover message", module)
  .addDecorator(withTheme)
  .add("Variants", () => (
    <DataList
      data={variants}
      renderItem={({ item: variant }) => (
        <PopoverMessage label={variant} title="Some title" message="Some message" type={variant} />
      )}
    />
  ))
  .add("Placements", () => (
    <List>
      <PopoverMessage label="Top" title="Some title" />
      <PopoverMessage label="bottom" title="Some title" placement="bottom" />
    </List>
  ))
  .add("Text", () => (
    <List>
      <PopoverMessage label="Only title" title="Some title" />
      <PopoverMessage label="With title and message" title="Some title" message="Some message" />
      <PopoverMessage
        label="With long message"
        title="Some title"
        message="Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
      />
    </List>
  ))
  .add("Miscellaneous", () => (
    <List>
      <PopoverMessage label="Auto close in 5 seconds" title="Some title" hideTimeout={5000} />
      <PopoverMessage
        label="Without auto close"
        title="Some title"
        message="You can tap on the message to hide it"
        autoHide={false}
      />
      <PopoverMessage
        label="With press hander"
        title="Tappable"
        onPress={() => action("item tapped")}
      />
      <PopoverMessage
        label="With undo action (only title)"
        title="Some title"
        onUndoPress={() => action("undo tapped")}
      />
      <PopoverMessage
        label="With undo action"
        title="Some title"
        message="Some message"
        onUndoPress={() => action("undo tapped")}
      />
    </List>
  ))

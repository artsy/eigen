import { Spacer } from "@artsy/palette-mobile"
import { storiesOf } from "@storybook/react-native"
import { PhoneInput } from "app/Components/Input/PhoneInput/PhoneInput"
import { List } from "storybook/helpers"

const phoneNumber = "124343434"

storiesOf("Input", module).add("PhoneInput", () => (
  <List contentContainerStyle={{ marginHorizontal: 20, alignItems: "stretch" }}>
    <PhoneInput
      title="Phone number (enabled)"
      value={phoneNumber}
      onChangeText={() => {
        console.log("onChangeText function")
      }}
      setValidation={() => {
        console.log("validation function")
      }}
    />
    <Spacer y={2} />
    <PhoneInput
      title="Phone number (disabled)"
      value={phoneNumber}
      onChangeText={() => {
        console.log("onChangeText function")
      }}
      setValidation={() => {
        console.log("validation function")
      }}
      disabled
    />
  </List>
))

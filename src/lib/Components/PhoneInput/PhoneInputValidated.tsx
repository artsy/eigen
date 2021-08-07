import React, { useRef, useState } from "react"
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import PhoneInput from "react-native-phone-number-input"

export const PhoneInputValidated: React.FC = () => {
  const [value, setValue] = useState("")
  const [formattedValue, setFormattedValue] = useState("")
  const [valid, setValid] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const phoneInput = useRef<PhoneInput>(null)
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View>
        <SafeAreaView>
          {!!showMessage && (
            <View>
              <Text>Value : {value}</Text>
              <Text>Formatted Value : {formattedValue}</Text>
              <Text>Valid : {valid ? "true" : "false"}</Text>
            </View>
          )}
          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode="DM"
            layout="first"
            onChangeText={(text) => {
              setValue(text)
            }}
            onChangeFormattedText={(text) => {
              setFormattedValue(text)
            }}
            withDarkTheme
            withShadow
            autoFocus
          />
          <TouchableOpacity
            onPress={() => {
              const checkValid = phoneInput.current?.isValidNumber(value)
              setShowMessage(true)
              setValid(checkValid ? checkValid : false)
            }}
          >
            <Text>Check</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </>
  )
}

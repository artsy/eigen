import { Flex, Input2, Separator } from "@artsy/palette-mobile"
import { Stack } from "app/Components/Stack"
import { getCurrentEmissionState, GlobalStore, unsafe__getEnvironment } from "app/store/GlobalStore"
import React, { useEffect, useState } from "react"
import { Alert, Text } from "react-native"
import {
  MyAccountFieldEditScreen,
  MyAccountFieldEditScreenProps,
} from "./Components/MyAccountFieldEditScreen"

export const MyAccountEditPassword: React.FC<{}> = ({}) => {
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")
  const [receivedErrorCurrent, setReceivedErrorCurrent] = useState<string | undefined>(undefined)
  const [receivedErrorNew, setReceivedErrorNew] = useState<string | undefined>(undefined)
  const [receivedErrorConfirm, setReceivedErrorConfirm] = useState<string | undefined>(undefined)

  // resetting the errors when user types
  useEffect(() => {
    setReceivedErrorCurrent(undefined)
  }, [currentPassword])
  useEffect(() => {
    setReceivedErrorNew(undefined)
  }, [newPassword])
  useEffect(() => {
    setReceivedErrorConfirm(undefined)
  }, [passwordConfirmation])

  const onSave: MyAccountFieldEditScreenProps["onSave"] = async () => {
    const { authenticationToken, userAgent } = getCurrentEmissionState()
    const { gravityURL } = unsafe__getEnvironment()
    if (newPassword !== passwordConfirmation) {
      setReceivedErrorConfirm("Password confirmation does not match")
      return
    }
    try {
      const res = await fetch(gravityURL + "/api/v1/me/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-ACCESS-TOKEN": authenticationToken,
          "User-Agent": userAgent,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      })
      const response = await res.json()

      if (res.status < 200 || res.status > 299 || response.error) {
        let message: string
        if (response.type === "param_error") {
          message = response.message
        } else if (typeof response.error === "string") {
          message = response.error
        } else {
          message = "Something went wrong."
        }

        // No way to know where the error is. We try to guess by checking the string.
        if (message.toLowerCase().match("current")) {
          setReceivedErrorCurrent(message)
        } else {
          setReceivedErrorNew(message)
        }
        return
      }

      // The user successfully updated their password
      Alert.alert(
        "Password Changed",
        "Your password has been changed successfully. Use your new password to log in.",
        [
          {
            text: "OK",
            onPress: () => GlobalStore.actions.auth.signOut(),
          },
        ],
        { cancelable: false }
      )
    } catch (error) {
      console.log(error)
      Alert.alert(typeof error === "string" ? error : "Something went wrong.")
    }
  }

  return (
    <MyAccountFieldEditScreen
      title="Password"
      canSave={Boolean(currentPassword && newPassword && passwordConfirmation)}
      onSave={onSave}
      contentContainerStyle={{ paddingHorizontal: 0 }}
    >
      <Flex mx={2}>
        <Input2
          autoComplete="password"
          autoFocus
          onChangeText={setCurrentPassword}
          secureTextEntry
          enableClearButton
          title="Current password"
          value={currentPassword}
          error={receivedErrorCurrent}
        />
      </Flex>
      <Separator mb={2} mt={4} />
      <Stack mx={2}>
        <Text>
          Password must include at least one uppercase letter, one lowercase letter, and one number.
        </Text>
        <Input2
          // TODO: Look into this with design

          onChangeText={setNewPassword}
          secureTextEntry
          enableClearButton
          title="New password"
          value={newPassword}
          error={receivedErrorNew}
        />
        <Input2
          onChangeText={setPasswordConfirmation}
          secureTextEntry
          enableClearButton
          title="Confirm new password"
          value={passwordConfirmation}
          error={receivedErrorConfirm}
        />
      </Stack>
    </MyAccountFieldEditScreen>
  )
}

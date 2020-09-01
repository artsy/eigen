import { Input } from "lib/Components/Input/Input"
import React, { useState } from "react"

import { Flex, Separator } from "palette"

import { Stack } from "lib/Components/Stack"
import { getCurrentEmissionState } from "lib/store/AppStore"
import { Alert, NativeModules } from "react-native"
import { MyAccountFieldEditScreen } from "./Components/MyAccountFieldEditScreen"

// related to threading, maybe it's UIKit counterpart isn't getting
// called on the main thread.
const alert: typeof Alert.alert = (...args) => {
  requestAnimationFrame(() => {
    Alert.alert(...args)
  })
}

export const MyAccountEditPassword: React.FC<{}> = ({}) => {
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")

  const onSave = async () => {
    const { gravityURL, authenticationToken, userAgent } = getCurrentEmissionState()
    if (newPassword !== passwordConfirmation) {
      return alert("Password confirmation does not match")
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
      // The user successfully updated their password
      if (response.error) {
        alert(typeof response.error === "string" ? response.error : "Something went wrong.")
      } else {
        alert(
          "Password Changed",
          "Your password has been changed successfully. Use your new password to log in.",
          [
            {
              text: "OK",
              onPress: () => NativeModules.ARNotificationsManager.postNotificationName("ARUserRequestedLogout", {}),
            },
          ],
          { cancelable: false }
        )
      }
    } catch (error) {
      console.log(error)
      alert(typeof error === "string" ? error : "Something went wrong.")
    }
  }

  return (
    <MyAccountFieldEditScreen
      title={"Full Name"}
      canSave={Boolean(currentPassword && newPassword && passwordConfirmation)}
      onSave={onSave}
      contentContainerStyle={{ paddingHorizontal: 0 }}
    >
      <Flex mx="2">
        <Input
          autoCompleteType="password"
          autoFocus
          onChangeText={setCurrentPassword}
          placeholder="Current password"
          secureTextEntry
          enableClearButton
          title="Current password"
          value={currentPassword}
        />
      </Flex>
      <Separator mb="2" mt="3" />
      <Stack mx="2">
        <Input
          description="Must include at least one uppercase letter, one lowercase letter, and one number."
          onChangeText={setNewPassword}
          placeholder="New password"
          secureTextEntry
          enableClearButton
          title="New password"
          value={newPassword}
        />
        <Input
          onChangeText={setPasswordConfirmation}
          placeholder="Confirm new password"
          secureTextEntry
          enableClearButton
          title="Confirm new password"
          value={passwordConfirmation}
        />
      </Stack>
    </MyAccountFieldEditScreen>
  )
}

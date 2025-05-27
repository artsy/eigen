import { OwnerType } from "@artsy/cohesion"
import { Flex, Input, Spacer, Text } from "@artsy/palette-mobile"
import { useAfterTransitionEnd } from "app/Scenes/MyAccount/utils/useFocusAfterTransitionEnd"
import { MyProfileScreenWrapper } from "app/Scenes/MyProfile/Components/MyProfileScreenWrapper"
import { getCurrentEmissionState, GlobalStore, unsafe__getEnvironment } from "app/store/GlobalStore"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import React, { useEffect, useRef, useState } from "react"
import { Alert } from "react-native"

export const MyAccountEditPassword: React.FC<{}> = ({}) => {
  const currentPasswordRef = useRef<Input>(null)

  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")
  const [receivedErrorCurrent, setReceivedErrorCurrent] = useState<string | undefined>(undefined)
  const [receivedErrorNew, setReceivedErrorNew] = useState<string | undefined>(undefined)
  const [receivedErrorConfirm, setReceivedErrorConfirm] = useState<string | undefined>(undefined)

  useAfterTransitionEnd(() => {
    currentPasswordRef.current?.focus()
  })

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

  const handleSave = async () => {
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

  const isValid = Boolean(currentPassword && newPassword && passwordConfirmation)

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.accountPassword,
      })}
    >
      <MyProfileScreenWrapper title="Password" onPress={handleSave} isValid={isValid}>
        <Flex>
          <Flex>
            <Input
              ref={currentPasswordRef}
              autoComplete="password"
              onChangeText={setCurrentPassword}
              secureTextEntry
              enableClearButton
              title="Current password"
              value={currentPassword}
              error={receivedErrorCurrent}
            />
          </Flex>

          <Spacer y={2} />

          <Text variant="sm-display">New password</Text>

          <Text variant="xs" color="mono60" mt={0.5}>
            Password must include at least one uppercase letter, one lowercase letter, and one
            number.
          </Text>

          <Input
            onChangeText={setNewPassword}
            secureTextEntry
            enableClearButton
            title="New password"
            value={newPassword}
            error={receivedErrorNew}
          />

          <Input
            onChangeText={setPasswordConfirmation}
            secureTextEntry
            enableClearButton
            title="Confirm new password"
            value={passwordConfirmation}
            error={receivedErrorConfirm}
          />
        </Flex>
      </MyProfileScreenWrapper>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

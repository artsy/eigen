import { Flex, Input, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { MyProfileScreenWrapper } from "app/Scenes/MyProfile/Components/MyProfileScreenWrapper"
import { getCurrentEmissionState, GlobalStore, unsafe__getEnvironment } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import React, { useEffect, useState } from "react"
import { Alert } from "react-native"

export const MyAccountEditPassword: React.FC<{}> = ({}) => {
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")
  const [receivedErrorCurrent, setReceivedErrorCurrent] = useState<string | undefined>(undefined)
  const [receivedErrorNew, setReceivedErrorNew] = useState<string | undefined>(undefined)
  const [receivedErrorConfirm, setReceivedErrorConfirm] = useState<string | undefined>(undefined)
  const navigation = useNavigation()
  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")

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

  useEffect(() => {
    if (!enableRedesignedSettings) {
      navigation.setOptions({
        headerRight: () => {
          return (
            <Touchable onPress={handleSave} disabled={!isValid}>
              <Text variant="xs" color={!!isValid ? "mono100" : "mono60"}>
                Save
              </Text>
            </Touchable>
          )
        },
      })
    }
  }, [isValid])

  if (enableRedesignedSettings) {
    return (
      <MyProfileScreenWrapper title="Password" onPress={handleSave} isValid={isValid}>
        <Content
          currentPassword={currentPassword}
          setCurrentPassword={setCurrentPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          passwordConfirmation={passwordConfirmation}
          setPasswordConfirmation={setPasswordConfirmation}
          receivedErrorCurrent={receivedErrorCurrent}
          receivedErrorNew={receivedErrorNew}
          receivedErrorConfirm={receivedErrorConfirm}
        />
      </MyProfileScreenWrapper>
    )
  }
  return (
    <Flex px={2}>
      <Content
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        passwordConfirmation={passwordConfirmation}
        setPasswordConfirmation={setPasswordConfirmation}
        receivedErrorCurrent={receivedErrorCurrent}
        receivedErrorNew={receivedErrorNew}
        receivedErrorConfirm={receivedErrorConfirm}
      />
    </Flex>
  )
}

// Move back inside MyAccountEditPassword once we clear AREnableRedesignedSettings ff
const Content: React.FC<{
  currentPassword: string
  setCurrentPassword: (value: string) => void
  newPassword: string
  setNewPassword: (value: string) => void
  passwordConfirmation: string
  setPasswordConfirmation: (value: string) => void
  receivedErrorCurrent: string | undefined
  receivedErrorNew: string | undefined
  receivedErrorConfirm: string | undefined
}> = ({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  passwordConfirmation,
  setPasswordConfirmation,
  receivedErrorCurrent,
  receivedErrorNew,
  receivedErrorConfirm,
}) => {
  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")

  return (
    <Flex>
      <Flex>
        <Input
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

      <Spacer y={2} />

      <Text variant="sm-display">New password</Text>

      <Text
        variant={!enableRedesignedSettings ? "sm-display" : "xs"}
        color={!enableRedesignedSettings ? "mono100" : "mono60"}
        mt={0.5}
      >
        Password must include at least one uppercase letter, one lowercase letter, and one number.
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
  )
}

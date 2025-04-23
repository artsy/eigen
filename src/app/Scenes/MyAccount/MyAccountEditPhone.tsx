import { Flex, SkeletonBox, Text, Touchable } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { MyAccountEditPhoneQuery } from "__generated__/MyAccountEditPhoneQuery.graphql"
import { MyAccountEditPhone_me$key } from "__generated__/MyAccountEditPhone_me.graphql"
import { INPUT_HEIGHT } from "app/Components/Input"
import { PhoneInput } from "app/Components/Input/PhoneInput/PhoneInput"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { MyProfileScreenWrapper } from "app/Scenes/MyProfile/Components/MyProfileScreenWrapper"
import { goBack } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { PlaceholderBox } from "app/utils/placeholders"
import React, { useEffect, useState } from "react"
import { PixelRatio } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { updateMyUserProfile } from "./updateMyUserProfile"

const MyAccountEditPhone: React.FC<{ me: MyAccountEditPhone_me$key }> = (props) => {
  const navigation = useNavigation()

  const me = useFragment(meFragment, props.me)

  const [phone, setPhone] = useState<string>(me.phone ?? "")
  const [receivedError, setReceivedError] = useState<string | undefined>(undefined)
  const [isValidNumber, setIsValidNumber] = useState<boolean>(false)

  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")

  useEffect(() => {
    const isValid = canSave()

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
  }, [navigation, phone, isValidNumber])

  const canSave = () => {
    if (!isValidNumber || phone.trim().length == 0) {
      return false
    } else {
      return true
    }
  }

  useEffect(() => {
    setReceivedError(undefined)
  }, [phone])

  const handleSave = async () => {
    try {
      await updateMyUserProfile({ phone })
      goBack()
    } catch (e: any) {
      setReceivedError(e)
    }
  }

  if (enableRedesignedSettings) {
    return (
      <MyProfileScreenWrapper title="Phone" onPress={handleSave} isValid={isValidNumber}>
        <Flex
          style={{
            // We are setting a fixed height here to prevent the input from growing in height
            // and pushing the save button when an error is present
            height: PixelRatio.getFontScale() * INPUT_HEIGHT + 15,
          }}
        >
          <PhoneInput
            setValidation={setIsValidNumber}
            enableClearButton
            value={phone}
            onChangeText={setPhone}
            autoFocus
            error={receivedError}
          />
        </Flex>
      </MyProfileScreenWrapper>
    )
  }
  return (
    <Flex p={2}>
      <PhoneInput
        setValidation={setIsValidNumber}
        enableClearButton
        value={phone}
        onChangeText={setPhone}
        autoFocus
        error={receivedError}
      />
    </Flex>
  )
}

const MyAccountEditPhonePlaceholder: React.FC<{}> = ({}) => {
  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")

  if (enableRedesignedSettings) {
    return (
      <MyProfileScreenWrapper title="Phone">
        <SkeletonBox height={40} />
      </MyProfileScreenWrapper>
    )
  }
  return (
    <Flex p={2}>
      <PlaceholderBox height={40} />
    </Flex>
  )
}

const meFragment = graphql`
  fragment MyAccountEditPhone_me on Me {
    phone
  }
`

const myAccountEditPhoneQuery = graphql`
  query MyAccountEditPhoneQuery {
    me {
      ...MyAccountEditPhone_me
    }
  }
`

export const MyAccountEditPhoneQueryRenderer: React.FC<{}> = withSuspense({
  Component: ({}) => {
    const data = useLazyLoadQuery<MyAccountEditPhoneQuery>(myAccountEditPhoneQuery, {})

    if (!data?.me) {
      return null
    }

    return <MyAccountEditPhone me={data?.me} />
  },
  LoadingFallback: MyAccountEditPhonePlaceholder,
  ErrorFallback: (fallbackProps) => {
    return (
      <LoadFailureView
        onRetry={fallbackProps.resetErrorBoundary}
        useSafeArea={false}
        error={fallbackProps.error}
        trackErrorBoundary={false}
      />
    )
  },
})

import { OwnerType } from "@artsy/cohesion"
import { Flex, SkeletonBox } from "@artsy/palette-mobile"
import { MyAccountEditPhoneQuery } from "__generated__/MyAccountEditPhoneQuery.graphql"
import { MyAccountEditPhone_me$key } from "__generated__/MyAccountEditPhone_me.graphql"
import { INPUT_HEIGHT } from "app/Components/Input"
import { PhoneInput } from "app/Components/Input/PhoneInput/PhoneInput"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { useAfterTransitionEnd } from "app/Scenes/MyAccount/utils/useFocusAfterTransitionEnd"
import { MyProfileScreenWrapper } from "app/Scenes/MyProfile/Components/MyProfileScreenWrapper"
import { goBack } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import React, { useEffect, useRef, useState } from "react"
import { PixelRatio } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { updateMyUserProfile } from "./updateMyUserProfile"

const MyAccountEditPhone: React.FC<{ me: MyAccountEditPhone_me$key }> = (props) => {
  const me = useFragment(meFragment, props.me)
  const phoneInputRef = useRef<any>(null)

  const [phone, setPhone] = useState<string>(me.phone ?? "")
  const [receivedError, setReceivedError] = useState<string | undefined>(undefined)
  const [isValidNumber, setIsValidNumber] = useState<boolean>(false)

  useAfterTransitionEnd(() => {
    phoneInputRef.current?.focus()
  })

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

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.accountPhoneNumber,
      })}
    >
      <MyProfileScreenWrapper title="Phone" onPress={handleSave} isValid={isValidNumber}>
        <Flex
          style={{
            // We are setting a fixed height here to prevent the input from growing in height
            // and pushing the save button when an error is present
            height: PixelRatio.getFontScale() * INPUT_HEIGHT + 15,
          }}
        >
          <PhoneInput
            ref={phoneInputRef as any}
            setValidation={setIsValidNumber}
            enableClearButton
            value={phone}
            onChangeText={setPhone}
            error={receivedError}
          />
        </Flex>
      </MyProfileScreenWrapper>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const MyAccountEditPhonePlaceholder: React.FC<{}> = ({}) => {
  return (
    <MyProfileScreenWrapper title="Phone">
      <SkeletonBox height={40} />
    </MyProfileScreenWrapper>
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

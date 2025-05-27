import { OwnerType } from "@artsy/cohesion"
import { Flex, Input, SkeletonBox } from "@artsy/palette-mobile"
import { MyAccountEditEmailQuery } from "__generated__/MyAccountEditEmailQuery.graphql"
import { MyAccountEditEmail_me$key } from "__generated__/MyAccountEditEmail_me.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { useToast } from "app/Components/Toast/toastHook"
import { useAfterTransitionEnd } from "app/Scenes/MyAccount/utils/useFocusAfterTransitionEnd"
import { MyProfileScreenWrapper } from "app/Scenes/MyProfile/Components/MyProfileScreenWrapper"
import { goBack } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import React, { useEffect, useRef, useState } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { string } from "yup"
import { updateMyUserProfile } from "./updateMyUserProfile"

interface MyAccountEditEmailProps {
  me: MyAccountEditEmail_me$key
}

export const MyAccountEditEmail: React.FC<MyAccountEditEmailProps> = (props) => {
  const me = useFragment(meFragment, props.me)
  const toast = useToast()
  const inputRef = useRef<Input>(null)

  const [email, setEmail] = useState<string>(me.email ?? "")

  const [receivedError, setReceivedError] = useState<string | undefined>(undefined)

  useAfterTransitionEnd(() => {
    inputRef.current?.focus()
  })

  useEffect(() => {
    setReceivedError(undefined)
  }, [email])

  const isEmailValid = Boolean(email && string().email().isValidSync(email))

  const handleSave = async () => {
    try {
      await updateMyUserProfile({ email })

      if (email !== me.email) {
        toast.show("Please confirm your new email for this update to take effect", "middle", {
          duration: "long",
        })
      }

      goBack()
    } catch (e: any) {
      setReceivedError(e)
    }
  }

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.accountEmail,
      })}
    >
      <MyProfileScreenWrapper title="Email" onPress={handleSave} isValid={isEmailValid}>
        <Input
          ref={inputRef}
          accessibilityLabel="email-input"
          enableClearButton
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          onSubmitEditing={handleSave}
          error={receivedError}
        />
      </MyProfileScreenWrapper>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const meFragment = graphql`
  fragment MyAccountEditEmail_me on Me {
    email
  }
`

const myAccountEditEmailQuery = graphql`
  query MyAccountEditEmailQuery {
    me {
      ...MyAccountEditEmail_me
    }
  }
`

const MyAccountEditEmailPlaceholder: React.FC<{}> = () => {
  return (
    <MyProfileScreenWrapper title="Email">
      <Flex p={2}>
        <SkeletonBox height={40} />
      </Flex>
    </MyProfileScreenWrapper>
  )
}

export const MyAccountEditEmailQueryRenderer: React.FC<{}> = withSuspense({
  Component: ({}) => {
    const data = useLazyLoadQuery<MyAccountEditEmailQuery>(myAccountEditEmailQuery, {})

    if (!data?.me) {
      return null
    }

    return <MyAccountEditEmail me={data?.me} />
  },
  LoadingFallback: MyAccountEditEmailPlaceholder,
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

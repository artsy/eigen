import { Flex, Input, Text, Touchable } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { MyAccountEditEmailQuery } from "__generated__/MyAccountEditEmailQuery.graphql"
import { MyAccountEditEmail_me$key } from "__generated__/MyAccountEditEmail_me.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { useToast } from "app/Components/Toast/toastHook"
import { goBack } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { PlaceholderBox } from "app/utils/placeholders"
import React, { useEffect, useRef, useState } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { string } from "yup"
import { MyAccountFieldEditScreen } from "./Components/MyAccountFieldEditScreen"
import { updateMyUserProfile } from "./updateMyUserProfile"

interface MyAccountEditEmailProps {
  me: MyAccountEditEmail_me$key
}

const MyAccountEditEmail: React.FC<MyAccountEditEmailProps> = (props) => {
  const me = useFragment(meFragment, props.me)

  const [email, setEmail] = useState<string>(me.email ?? "")

  const [receivedError, setReceivedError] = useState<string | undefined>(undefined)
  const navigation = useNavigation()

  useEffect(() => {
    setReceivedError(undefined)
  }, [email])

  const isEmailValid = Boolean(email && string().email().isValidSync(email))

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <Touchable onPress={handleSave} disabled={!isEmailValid}>
            <Text variant="xs" color={isEmailValid ? "black100" : "black60"}>
              Save
            </Text>
          </Touchable>
        )
      },
    })
  }, [navigation, email])

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

  const editScreenRef = useRef<MyAccountFieldEditScreen>(null)

  const toast = useToast()

  return (
    <>
      <Flex p={2}>
        <Input
          accessibilityLabel="email-input"
          enableClearButton
          value={email}
          onChangeText={setEmail}
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          onSubmitEditing={() => {
            if (isEmailValid) {
              editScreenRef.current?.save()
            }
          }}
          error={receivedError}
        />
      </Flex>
    </>
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
    <Flex p={2}>
      <PlaceholderBox height={40} />
    </Flex>
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

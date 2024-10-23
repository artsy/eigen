import { Flex, Input, Text, Touchable } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { MyAccountEditEmailQuery } from "__generated__/MyAccountEditEmailQuery.graphql"
import { MyAccountEditEmail_me$data } from "__generated__/MyAccountEditEmail_me.graphql"
import { useToast } from "app/Components/Toast/toastHook"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { PlaceholderBox } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import React, { useEffect, useRef, useState } from "react"
import { createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"
import { string } from "yup"
import {
  MyAccountFieldEditScreen,
  MyAccountFieldEditScreenPlaceholder,
} from "./Components/MyAccountFieldEditScreen"
import { updateMyUserProfile } from "./updateMyUserProfile"

const MyAccountEditEmail: React.FC<{ me: MyAccountEditEmail_me$data; relay: RelayProp }> = ({
  me,
  relay,
}) => {
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
      await updateMyUserProfile({ email }, relay.environment)

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
  )
}

const MyAccountEditEmailPlaceholder: React.FC<{}> = ({}) => {
  return (
    <MyAccountFieldEditScreenPlaceholder title="Email">
      <PlaceholderBox height={40} />
    </MyAccountFieldEditScreenPlaceholder>
  )
}

export const MyAccountEditEmailContainer = createFragmentContainer(MyAccountEditEmail, {
  me: graphql`
    fragment MyAccountEditEmail_me on Me {
      email
    }
  `,
})

export const MyAccountEditEmailQueryRenderer: React.FC<{}> = () => {
  return (
    <QueryRenderer<MyAccountEditEmailQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query MyAccountEditEmailQuery {
          me {
            ...MyAccountEditEmail_me
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: MyAccountEditEmailContainer,
        renderPlaceholder: () => <MyAccountEditEmailPlaceholder />,
      })}
      variables={{}}
    />
  )
}

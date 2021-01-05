import { MyAccountEditEmailQuery } from "__generated__/MyAccountEditEmailQuery.graphql"
import { Input } from "lib/Components/Input/Input"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Spacer, Text } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"
import { string } from "yup"
import { MyAccountEditEmail_me } from "../../../__generated__/MyAccountEditEmail_me.graphql"
import { MyAccountFieldEditScreen, MyAccountFieldEditScreenPlaceholder } from "./Components/MyAccountFieldEditScreen"
import { updateMyUserProfile } from "./updateMyUserProfile"

// TODO: This should be a dictionary with input name as key, message as value
interface FieldError {
  email?: string
  password?: string
  server?: string
}

const MyAccountEditEmail: React.FC<{ me: MyAccountEditEmail_me; relay: RelayProp }> = ({ me }) => {
  const [email, setEmail] = useState<string>(me.email ?? "")
  const [password, setPassword] = useState<string>("")

  const [receivedError, setReceivedError] = useState<FieldError | undefined>(undefined)

  useEffect(() => {
    setReceivedError(undefined)
  }, [email])

  const isEmailValid = Boolean(email && email !== me.email && string().email().isValidSync(email))
  const editScreenRef = useRef<MyAccountFieldEditScreen>(null)

  return (
    <MyAccountFieldEditScreen
      ref={editScreenRef}
      title={"Email"}
      canSave={isEmailValid}
      onSave={async (dismiss) => {
        try {
          await updateMyUserProfile({ email, password })
          dismiss()
        } catch (e) {
          if (e.fieldErrors) {
            // input specific errors
            const formattedErrors = formatGravityErrors(e.fieldErrors)
            setReceivedError(formattedErrors)
          } else {
            setReceivedError({
              server: e.message,
            })
          }
        }
      }}
    >
      <Input
        enableClearButton
        value={email}
        onChangeText={setEmail}
        autoFocus
        autoCapitalize="none"
        autoCorrect={false}
        autoCompleteType="off"
        title="Email"
        onSubmitEditing={() => {
          if (isEmailValid) {
            editScreenRef.current?.save()
          }
        }}
        error={receivedError?.email}
      />
      <Spacer my={0.5} />
      <Input
        autoCompleteType="password"
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        enableClearButton
        title="Confirm password"
        value={password}
        error={receivedError?.password}
      />
      <Text color="red100" variant="small" mt={1}>
        {receivedError?.server}
      </Text>
    </MyAccountFieldEditScreen>
  )
}

interface GravityFieldErrors {
  fieldErrors: GravityFieldError[]
}
interface GravityFieldError {
  name: "email" | "password" | "server"
  message: string
}

const formatGravityErrors = ({ fieldErrors }: GravityFieldErrors) => {
  const formatted: FieldError = {}
  fieldErrors.map((err) => {
    formatted[err.name] = err.message
  })
  return formatted
}

const MyAccountEditEmailPlaceholder: React.FC<{}> = ({}) => {
  return (
    <MyAccountFieldEditScreenPlaceholder title="Email">
      <PlaceholderBox height={40} />
    </MyAccountFieldEditScreenPlaceholder>
  )
}

const MyAccountEditEmailContainer = createFragmentContainer(MyAccountEditEmail, {
  me: graphql`
    fragment MyAccountEditEmail_me on Me {
      email
    }
  `,
})

export const MyAccountEditEmailQueryRenderer: React.FC<{}> = () => {
  return (
    <QueryRenderer<MyAccountEditEmailQuery>
      environment={defaultEnvironment}
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

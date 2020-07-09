import { MyAccountEditEmailQuery } from "__generated__/MyAccountEditEmailQuery.graphql"
import { Input } from "lib/Components/Input/Input"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React, { useRef, useState } from "react"
import { Alert } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"
import { string } from "yup"
import { MyAccountEditEmail_me } from "../../../__generated__/MyAccountEditEmail_me.graphql"
import { MyAccountFieldEditScreen, MyAccountFieldEditScreenPlaceholder } from "./Components/MyAccountFieldEditScreen"
import { updateMyUserProfile } from "./updateMyUserProfile"

const MyAccountEditEmail: React.FC<{ me: MyAccountEditEmail_me; relay: RelayProp }> = ({ me }) => {
  const [email, setEmail] = useState<string>(me.email ?? "")

  const isEmailValid = Boolean(
    email &&
      string()
        .email()
        .isValidSync(email)
  )

  const editScreenRef = useRef<MyAccountFieldEditScreen>(null)

  return (
    <MyAccountFieldEditScreen
      ref={editScreenRef}
      title={"Email"}
      canSave={isEmailValid}
      onSave={async dismiss => {
        try {
          await updateMyUserProfile({ email })
          dismiss()
        } catch (e) {
          Alert.alert(typeof e === "string" ? e : "Something went wrong.")
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
        onSubmitEditing={() => {
          if (isEmailValid) {
            editScreenRef.current?.save()
          }
        }}
      />
    </MyAccountFieldEditScreen>
  )
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

import { MyAccountEditEmailMutation } from "__generated__/MyAccountEditEmailMutation.graphql"
import { MyAccountEditEmailQuery } from "__generated__/MyAccountEditEmailQuery.graphql"
import { Input } from "lib/Components/Input/Input"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React, { useState } from "react"
import { commitMutation, createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"
import { string } from "yup"
import { MyAccountEditEmail_me } from "../../../__generated__/MyAccountEditEmail_me.graphql"
import { MyAccountFieldEditScreen, MyAccountFieldEditScreenPlaceholder } from "./Components/MyAccountFieldEditScreen"

const MyAccountEditEmail: React.FC<{ me: MyAccountEditEmail_me; relay: RelayProp }> = ({ me, relay }) => {
  const [email, setEmail] = useState<string>(me.email ?? "")

  const onSave = async () => {
    await new Promise((resolve, reject) =>
      commitMutation<MyAccountEditEmailMutation>(relay.environment, {
        onCompleted: resolve,
        mutation: graphql`
          mutation MyAccountEditEmailMutation($input: UpdateMyProfileInput!) {
            updateMyUserProfile(input: $input) {
              me {
                email
              }
            }
          }
        `,
        variables: {
          input: {
            email,
          },
        },
        onError: reject,
      })
    )
  }

  return (
    <MyAccountFieldEditScreen
      title={"Email"}
      canSave={string()
        .email()
        .isValidSync(email)}
      onSave={onSave}
    >
      <Input showClearButton value={email} onChangeText={setEmail} autoFocus />
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

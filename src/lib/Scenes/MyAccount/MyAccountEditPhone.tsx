import { MyAccountEditPhoneMutation } from "__generated__/MyAccountEditPhoneMutation.graphql"
import { MyAccountEditPhoneQuery } from "__generated__/MyAccountEditPhoneQuery.graphql"
import { Input } from "lib/Components/Input/Input"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React, { useState } from "react"
import { commitMutation, createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"
import { MyAccountEditPhone_me } from "../../../__generated__/MyAccountEditPhone_me.graphql"
import { MyAccountFieldEditScreen, MyAccountFieldEditScreenPlaceholder } from "./Components/MyAccountFieldEditScreen"

const MyAccountEditPhone: React.FC<{ me: MyAccountEditPhone_me; relay: RelayProp }> = ({ me, relay }) => {
  const [phone, setPhone] = useState<string>(me.phone ?? "")

  const onSave = async () => {
    await new Promise((resolve, reject) =>
      commitMutation<MyAccountEditPhoneMutation>(relay.environment, {
        onCompleted: resolve,
        mutation: graphql`
          mutation MyAccountEditPhoneMutation($input: UpdateMyProfileInput!) {
            updateMyUserProfile(input: $input) {
              me {
                phone
              }
            }
          }
        `,
        variables: {
          input: {
            phone,
          },
        },
        onError: e => {
          if (__DEV__) {
            console.log(e)
          }
          reject()
        },
      })
    )
  }

  return (
    <MyAccountFieldEditScreen title={"Phone"} canSave={!!phone.trim()} onSave={onSave}>
      <Input showClearButton value={phone} onChangeText={setPhone} autoFocus keyboardType="phone-pad" />
    </MyAccountFieldEditScreen>
  )
}

const MyAccountEditPhonePlaceholder: React.FC<{}> = ({}) => {
  return (
    <MyAccountFieldEditScreenPlaceholder title="Phone">
      <PlaceholderBox height={40} />
    </MyAccountFieldEditScreenPlaceholder>
  )
}

const MyAccountEditPhoneContainer = createFragmentContainer(MyAccountEditPhone, {
  me: graphql`
    fragment MyAccountEditPhone_me on Me {
      phone
    }
  `,
})

export const MyAccountEditPhoneQueryRenderer: React.FC<{}> = () => {
  return (
    <QueryRenderer<MyAccountEditPhoneQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyAccountEditPhoneQuery {
          me {
            ...MyAccountEditPhone_me
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: MyAccountEditPhoneContainer,
        renderPlaceholder: () => <MyAccountEditPhonePlaceholder />,
      })}
      variables={{}}
    />
  )
}

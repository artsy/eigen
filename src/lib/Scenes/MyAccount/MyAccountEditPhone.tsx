import { MyAccountEditPhoneQuery } from "__generated__/MyAccountEditPhoneQuery.graphql"
import { Input } from "lib/Components/Input/Input"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React, { useRef, useState } from "react"
import { Alert } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { MyAccountEditPhone_me } from "../../../__generated__/MyAccountEditPhone_me.graphql"
import { MyAccountFieldEditScreen, MyAccountFieldEditScreenPlaceholder } from "./Components/MyAccountFieldEditScreen"
import { updateMyUserProfile } from "./updateMyUserProfile"

const MyAccountEditPhone: React.FC<{ me: MyAccountEditPhone_me }> = ({ me }) => {
  const [phone, setPhone] = useState<string>(me.phone ?? "")
  const inputRef = useRef(null)

  return (
    <MyAccountFieldEditScreen
      title={"Phone"}
      canSave={!!phone.trim()}
      onSave={async dismiss => {
        try {
          await updateMyUserProfile({ phone })
          dismiss()
        } catch (e) {
          Alert.alert(typeof e === "string" ? e : "Something went wrong.")
        }
      }}
    >
      <Input
        enableClearButton
        value={phone}
        onChangeText={setPhone}
        autoFocus
        keyboardType="phone-pad"
        ref={inputRef}
      />
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

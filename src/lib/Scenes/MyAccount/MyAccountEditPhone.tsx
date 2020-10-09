import { MyAccountEditPhoneQuery } from "__generated__/MyAccountEditPhoneQuery.graphql"
import { Input } from "lib/Components/Input/Input"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React, { useEffect, useRef, useState } from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { MyAccountEditPhone_me } from "../../../__generated__/MyAccountEditPhone_me.graphql"
import { MyAccountFieldEditScreen, MyAccountFieldEditScreenPlaceholder } from "./Components/MyAccountFieldEditScreen"
import { updateMyUserProfile } from "./updateMyUserProfile"

const MyAccountEditPhone: React.FC<{ me: MyAccountEditPhone_me }> = ({ me }) => {
  const [phone, setPhone] = useState<string>(me.phone ?? "")
  const [receivedError, setReceivedError] = useState<string | undefined>(undefined)
  const inputRef = useRef(null)

  useEffect(() => {
    setReceivedError(undefined)
  }, [phone])

  return (
    <MyAccountFieldEditScreen
      title={"Phone"}
      canSave={!!phone.trim()}
      onSave={async (dismiss, alert) => {
        try {
          await updateMyUserProfile({ phone })
          dismiss()
        } catch (e) {
          setReceivedError(e)
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
        error={receivedError}
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

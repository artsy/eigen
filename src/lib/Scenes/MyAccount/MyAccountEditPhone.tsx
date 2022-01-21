import { MyAccountEditPhoneQuery } from "__generated__/MyAccountEditPhoneQuery.graphql"
import { PhoneInput } from "lib/Components/PhoneInput/PhoneInput"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React, { useEffect, useState } from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { MyAccountEditPhone_me } from "../../../__generated__/MyAccountEditPhone_me.graphql"
import { MyAccountFieldEditScreen, MyAccountFieldEditScreenPlaceholder } from "./Components/MyAccountFieldEditScreen"
import { updateMyUserProfile } from "./updateMyUserProfile"

const MyAccountEditPhone: React.FC<{ me: MyAccountEditPhone_me }> = ({ me }) => {
  const [phone, setPhone] = useState<string>(me.phone ?? "")
  const [receivedError, setReceivedError] = useState<string | undefined>(undefined)
  const [isValidNumber, setIsValidNumber] = useState<boolean>(false)

  const canSave = () => {
    if (!isValidNumber && !!phone.trim()) {
      return false
    } else {
      return true
    }
  }

  useEffect(() => {
    setReceivedError(undefined)
  }, [phone])

  return (
    <MyAccountFieldEditScreen
      title="Phone"
      canSave={canSave()}
      onSave={async (dismiss) => {
        try {
          await updateMyUserProfile({ phone })
          dismiss()
        } catch (e: any) {
          setReceivedError(e)
        }
      }}
    >
      <PhoneInput
        setValidation={setIsValidNumber}
        enableClearButton
        value={phone}
        onChangeText={setPhone}
        autoFocus
        error={receivedError}
      />
    </MyAccountFieldEditScreen>
  )
}

const MyAccountEditPhonePlaceholder: React.FC = () => {
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

export const MyAccountEditPhoneQueryRenderer: React.FC = () => {
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

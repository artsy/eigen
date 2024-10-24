import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { MyAccountEditPhoneQuery } from "__generated__/MyAccountEditPhoneQuery.graphql"
import { MyAccountEditPhone_me$data } from "__generated__/MyAccountEditPhone_me.graphql"
import { PhoneInput } from "app/Components/Input/PhoneInput/PhoneInput"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { PlaceholderBox } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import React, { useEffect, useState } from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { updateMyUserProfile } from "./updateMyUserProfile"

const MyAccountEditPhone: React.FC<{ me: MyAccountEditPhone_me$data }> = ({ me }) => {
  const navigation = useNavigation()

  const [phone, setPhone] = useState<string>(me.phone ?? "")
  const [receivedError, setReceivedError] = useState<string | undefined>(undefined)
  const [isValidNumber, setIsValidNumber] = useState<boolean>(false)

  useEffect(() => {
    const isValid = canSave()

    navigation.setOptions({
      headerRight: () => {
        return (
          <Touchable onPress={handleSave} disabled={!isValid}>
            <Text variant="xs" color={!!isValid ? "black100" : "black60"}>
              Save
            </Text>
          </Touchable>
        )
      },
    })
  }, [navigation, phone, isValidNumber])

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

  const handleSave = async () => {
    try {
      await updateMyUserProfile({ phone })
      goBack()
    } catch (e: any) {
      setReceivedError(e)
    }
  }

  return (
    <Flex p={2}>
      <PhoneInput
        setValidation={setIsValidNumber}
        enableClearButton
        value={phone}
        onChangeText={setPhone}
        autoFocus
        error={receivedError}
      />
    </Flex>
  )
}

const MyAccountEditPhonePlaceholder: React.FC<{}> = ({}) => {
  return <PlaceholderBox height={40} />
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
      environment={getRelayEnvironment()}
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

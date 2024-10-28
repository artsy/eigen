import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { MyAccountEditPhoneQuery } from "__generated__/MyAccountEditPhoneQuery.graphql"
import { MyAccountEditPhone_me$data } from "__generated__/MyAccountEditPhone_me.graphql"
import { PhoneInput } from "app/Components/Input/PhoneInput/PhoneInput"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { MyAccountFieldEditScreen } from "app/Scenes/MyAccount/Components/MyAccountFieldEditScreen"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { PlaceholderBox } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import React, { Fragment, useEffect, useState } from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { updateMyUserProfile } from "./updateMyUserProfile"

const MyAccountEditPhone: React.FC<{ me: MyAccountEditPhone_me$data }> = ({ me }) => {
  const navigation = useNavigation()
  const enableNewNavigation = useFeatureFlag("AREnableNewNavigation")

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
  const Wrapper = enableNewNavigation
    ? Fragment
    : ({ children }: { children: React.ReactNode }) => (
        <MyAccountFieldEditScreen title="Phone Number" canSave={canSave()} onSave={handleSave}>
          {children}
        </MyAccountFieldEditScreen>
      )

  return (
    <Wrapper>
      <Flex p={enableNewNavigation ? 2 : 0}>
        <PhoneInput
          setValidation={setIsValidNumber}
          enableClearButton
          value={phone}
          onChangeText={setPhone}
          autoFocus
          error={receivedError}
        />
      </Flex>
    </Wrapper>
  )
}

const MyAccountEditPhonePlaceholder: React.FC<{}> = ({}) => {
  const enableNewNavigation = useFeatureFlag("AREnableNewNavigation")
  const Wrapper = enableNewNavigation
    ? Fragment
    : ({ children }: { children: React.ReactNode }) => (
        <PageWithSimpleHeader title="Phone Number">{children}</PageWithSimpleHeader>
      )

  return (
    <Wrapper>
      <PlaceholderBox height={40} />
    </Wrapper>
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

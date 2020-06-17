import { Flex, Join, Sans, Separator } from "@artsy/palette"
import { MyAccountEditEmailMutation } from "__generated__/MyAccountEditEmailMutation.graphql"
import { MyAccountEditEmailQuery } from "__generated__/MyAccountEditEmailQuery.graphql"
import LoadingModal from "lib/Components/Modals/LoadingModal"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { Input } from "lib/Scenes/Search/Input"
import { PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React, { useEffect, useRef, useState } from "react"
import { Alert, InteractionManager, NativeModules, TouchableOpacity, View } from "react-native"
import { commitMutation, createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"
import { object, string } from "yup"
import { MyAccountEditEmail_me } from "../../../__generated__/MyAccountEditEmail_me.graphql"

const schema = object().shape({
  email: string()
    .email()
    .required(),
})

const MyAccountEditEmail: React.FC<{ me: MyAccountEditEmail_me; relay: RelayProp }> = ({ me, relay }) => {
  const [email, setEmail] = useState<string>(me.email || "")
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const navRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      NativeModules.ARSwitchBoardModule.updateShouldHideBackButton(true)
    }, 500)
  }, [])

  const onCompletedSave = () => {
    setIsSaving(false)
    SwitchBoard.dismissNavigationViewController(navRef.current!)
  }

  const onErrorSave = () => {
    InteractionManager.runAfterInteractions(() => {
      setIsSaving(false)
    })
  }

  const handleSave = () => {
    schema
      .isValid({
        email,
      })
      .then((isValid: boolean) => {
        if (!isValid) {
          return Alert.alert("Please add a valid email address")
        }
        setIsSaving(true)
        commitMutation<MyAccountEditEmailMutation>(relay.environment, {
          onCompleted: onCompletedSave,
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
          onError: onErrorSave,
        })
      })
  }

  const savingDisabled = Boolean(!email || email === me.email || isSaving)

  return (
    <Flex pt="2" ref={navRef}>
      <LoadingModal isVisible={isSaving} />
      <Join separator={<Separator my={2} />}>
        <Flex flexDirection="row" justifyContent="space-between" px={2}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => SwitchBoard.dismissNavigationViewController(navRef.current!)}>
              <Sans size="4" weight="medium" textAlign="left">
                Cancel
              </Sans>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Sans size="4" weight="medium">
              Email
            </Sans>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <TouchableOpacity disabled={savingDisabled} onPress={handleSave}>
              <Sans size="4" weight="medium" opacity={savingDisabled ? 0.3 : 1}>
                Save
              </Sans>
            </TouchableOpacity>
          </View>
        </Flex>
        <Flex px={2}>
          <Input showClearButton value={email} onChangeText={setEmail} autoFocus={false} onSubmitEditing={handleSave} />
        </Flex>
      </Join>
    </Flex>
  )
}

const MyAccountEditEmailPlaceholder: React.FC<{}> = ({}) => {
  return (
    <Flex pt="2">
      <Join separator={<Separator my={2} />}>
        <Sans size="4" weight="medium" textAlign="center">
          Email
        </Sans>
        <Flex px={2} py={1}>
          <PlaceholderText width={100 + Math.random() * 100} />
        </Flex>
      </Join>
    </Flex>
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

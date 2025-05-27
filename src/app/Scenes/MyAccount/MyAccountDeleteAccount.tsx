import { OwnerType } from "@artsy/cohesion"
import { GavelIcon, GenomeIcon } from "@artsy/icons/native"
import { Box, Button, Flex, Input, Spacer, Text } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { MyAccountDeleteAccountQuery } from "__generated__/MyAccountDeleteAccountQuery.graphql"
import { MyAccountDeleteAccount_me$data } from "__generated__/MyAccountDeleteAccount_me.graphql"
import { DeleteAccountInput } from "__generated__/deleteUserAccountMutation.graphql"
import { GlobalStore } from "app/store/GlobalStore"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import React, { useState } from "react"
import { Alert, InteractionManager, KeyboardAvoidingView, ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { deleteUserAccount } from "./deleteUserAccount"

const ICON_SIZE = 16

interface MyAccountDeleteAccountProps {
  me: MyAccountDeleteAccount_me$data
}

const MyAccountDeleteAccount: React.FC<MyAccountDeleteAccountProps> = ({ me: { hasPassword } }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [explanation, setExplanation] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const navigation = useNavigation()

  const enableDelete = hasPassword
    ? password.length > 0 && explanation.length > 0
    : explanation.length > 0

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.accountDeleteMyAccount,
      })}
    >
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView>
          <Box pr={2} pl={2}>
            <Text variant="lg-display" mt="6">
              Delete My Account
            </Text>
            <Spacer y={4} />
            <Text>Are you sure you want to delete your account?</Text>
            <Spacer y={2} />
            <Text>If you delete your account:</Text>
            <Spacer y={2} />
            <Flex flexDirection="row" alignItems="center" pr={1}>
              <Flex pb={1}>
                <GenomeIcon width={ICON_SIZE} height={ICON_SIZE} />
              </Flex>
              <Text variant="xs" color="mono100" px={1} pb="1px">
                You will lose all data on Artsy including all existing offers, inquiries and mesages
                with Galleries
              </Text>
            </Flex>
            <Spacer y={2} />
            <Flex flexDirection="row" alignItems="center" pr={1}>
              <Flex pb={1}>
                <GavelIcon width={ICON_SIZE} height={ICON_SIZE} />
              </Flex>
              <Text variant="xs" color="mono100" px={1} pb="1px">
                You won’t have access to any exclusive Artsy benefits, such as Artsy Curated
                Auctions, Private Sales, etc
              </Text>
            </Flex>
            <Spacer y={4} />
            <Input
              multiline
              placeholder="Please share with us why you are leaving"
              onChangeText={setExplanation}
              defaultValue={explanation}
              error={!hasPassword ? error : undefined}
            />
            <Spacer y={4} />
            <Text variant="xs" color="mono100" pb="1px">
              After you submit your request, we will disable your account. It may take up to 7 days
              to fully delete and remove all of your data.
            </Text>
            <Spacer y={2} />
            {!!hasPassword && (
              <>
                <Input
                  secureTextEntry
                  placeholder="Enter your password to continue"
                  onChangeText={setPassword}
                  defaultValue={password}
                  error={error}
                />
                <Spacer y={2} />
              </>
            )}
            <Button
              block
              disabled={!enableDelete}
              loading={loading}
              onPress={async () => {
                try {
                  setLoading(true)
                  setError("")
                  const input: DeleteAccountInput = {
                    explanation,
                    password,
                  }
                  const result = await deleteUserAccount(input)
                  const mutationError =
                    result.deleteMyAccountMutation?.userAccountOrError?.mutationError

                  //  Failed to request account deletion
                  if (mutationError?.message) {
                    setError(mutationError?.message)
                    return
                  }
                  //  Account deleted request submitted successfully
                  Alert.alert(
                    "Account deletion request submitted!",
                    "It may take up to 7 days to fully delete and remove all of your data."
                  )
                  InteractionManager.runAfterInteractions(() => {
                    GlobalStore.actions.auth.signOut()
                  })
                } catch (e: any) {
                  setError("Something went wrong")
                } finally {
                  setLoading(false)
                }
              }}
            >
              Delete My Account
            </Button>
            <Spacer y={1} />
            <Button block variant="outline" onPress={() => navigation.goBack()}>
              Cancel
            </Button>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const MyAccountDeleteAccountFragmentContainer = createFragmentContainer(
  MyAccountDeleteAccount,
  {
    me: graphql`
      fragment MyAccountDeleteAccount_me on Me {
        hasPassword
      }
    `,
  }
)

export const MyAccountDeleteAccountQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<MyAccountDeleteAccountQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query MyAccountDeleteAccountQuery {
          me {
            ...MyAccountDeleteAccount_me
          }
        }
      `}
      variables={{}}
      render={renderWithLoadProgress(MyAccountDeleteAccountFragmentContainer)}
    />
  )
}

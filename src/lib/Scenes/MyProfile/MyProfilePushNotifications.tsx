// tslint:disable:no-empty
import { Box, Button, color, Flex, Join, Sans, Separator } from "@artsy/palette"
import { MyProfilePushNotificationsMutation } from "__generated__/MyProfilePushNotificationsMutation.graphql"
import { updateMyUserProfileMutation } from "__generated__/updateMyUserProfileMutation.graphql"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import colors from "lib/data/colors"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import useAppState from "lib/utils/useAppState"
import React, { useCallback, useState } from "react"
import { Alert, Linking, RefreshControl, ScrollView, Switch, View } from "react-native"
import { commitMutation, createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { MyProfilePushNotifications_me } from "../../../__generated__/MyProfilePushNotifications_me.graphql"
import { MyProfilePushNotificationsQuery } from "../../../__generated__/MyProfilePushNotificationsQuery.graphql"

import { NativeModules } from "react-native"

interface SwitchMenuProps {
  onChange: (value: boolean) => void
  value: boolean
  title: string
  description: string
}

export type PushNotificationPermissions =
  | "receiveLotOpeningSoonNotification"
  | "receiveNewSalesNotification"
  | "receiveNewWorksNotification"
  | "receiveOutbidNotification"
  | "receivePromotionNotification"
  | "receivePurchaseNotification"
  | "receiveSaleOpeningClosingNotification"

export const SwitchMenu = ({ onChange, value, title, description }: SwitchMenuProps) => (
  <Flex flexDirection="row" alignItems="flex-start" flexShrink={0} my={1}>
    <Flex style={{ width: "80%" }}>
      <Sans size="4t" color="black100">
        {title}
      </Sans>
      <Sans size="3t" color={colors["gray-semibold"]} py={0.5}>
        {description}
      </Sans>
    </Flex>
    <Flex style={{ width: "20%" }} alignItems="flex-end">
      <Switch
        trackColor={{ false: color("black10"), true: color("black100") }}
        onValueChange={onChange}
        value={value}
      />
    </Flex>
  </Flex>
)

export const MyProfilePushNotifications: React.FC<{
  me: MyProfilePushNotifications_me
  relay: RelayRefetchProp
}> = ({ me, relay }) => {
  // TODO: This will be replaced with a custom hook to get the permission
  const [hasPushNotificationsEnabled] = useState<boolean>(true)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  const permissions = NativeModules.ARPermissions
  console.log("Logging permissions")
  console.log(NativeModules)
  console.log(permissions)

  NativeModules.ARPermissions.fetchNotificationPermissions((_, result) => {
    console.log("logging result")
    console.log(result)
  })

  const onForeground = useCallback(async () => {
    try {
      // Enable all push notification options if the user enabled push notifications
      if (hasPushNotificationsEnabled) {
        await updateMyProfilePushNotifications({
          receiveLotOpeningSoonNotification: true,
          receiveNewSalesNotification: true,
          receiveNewWorksNotification: true,
          receiveOutbidNotification: true,
          receivePromotionNotification: true,
          receivePurchaseNotification: true,
          receiveSaleOpeningClosingNotification: true,
        })
      }
    } catch (error) {
      Alert.alert(typeof error === "string" ? error : "Something went wrong.")
    }
  }, [hasPushNotificationsEnabled])

  useAppState({ onForeground })

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    relay.refetch(() => {
      setIsRefreshing(false)
    })
  }, [])

  const updateNotificationPermission = async (notificationType: PushNotificationPermissions, value: boolean) => {
    try {
      await updateMyProfilePushNotifications({ ...me, [notificationType]: value })
    } catch (error) {
      Alert.alert(typeof error === "string" ? error : "Something went wrong.")
    }
  }

  // Render turn on notifications banner
  const renderAllowPushNotificationsBanner = () => {
    return (
      <>
        <Flex py={3} px={2} backgroundColor={colors["gray-light"]} alignItems="center">
          <Sans size="4t" weight="medium" color="black">
            Turn on notifications
          </Sans>
          <Sans size="3t" color={colors["gray-semibold"]} marginTop="1" marginBottom="2">
            To receive push notifications from Artsy, you’ll need enable them in your iOS Settings. Tap Notifications,
            and then toggle “Allow Notifications” on.
          </Sans>
          <Button
            size="large"
            onPress={() => {
              // TODO: CHECK THE DEEP LINK WITH THE TEAM
              Linking.openURL("App-prefs:NOTIFICATIONS_ID")
            }}
          >
            Open settings
          </Button>
        </Flex>
        <Separator />
      </>
    )
  }

  // Render list of enabled push notification permissions
  const renderContent = () => (
    <View
      style={{ opacity: hasPushNotificationsEnabled ? 1 : 0.5 }}
      pointerEvents={hasPushNotificationsEnabled ? "auto" : "none"}
    >
      <Join separator={<Separator my={1} />}>
        <Box py={1} px={2}>
          <Sans size="4t" color="black100" weight="medium" py={1}>
            Purchase Updates
          </Sans>
          <SwitchMenu
            title="Messages"
            description="Messages from sellers on your inquiries"
            value={!!me.receivePurchaseNotification}
            onChange={value => {
              updateNotificationPermission("receivePurchaseNotification", value)
            }}
          />
          <SwitchMenu
            title="Outbid Alerts"
            description="Alerts for when you’ve been outbid"
            value={!!me.receiveOutbidNotification}
            onChange={value => {
              updateNotificationPermission("receiveOutbidNotification", value)
            }}
          />
        </Box>
        <Box py={1} px={2}>
          <Sans size="4t" color="black100" weight="medium" py={1}>
            Reminders
          </Sans>
          <SwitchMenu
            title="Lot Opening Soon"
            description="Your lots that are opening for live bidding soon"
            value={!!me.receiveLotOpeningSoonNotification}
            onChange={value => {
              updateNotificationPermission("receiveLotOpeningSoonNotification", value)
            }}
          />
          <SwitchMenu
            title="Auctions Starting and Closing"
            description="Your registered auctions that are starting or closing soon"
            value={!!me.receiveSaleOpeningClosingNotification}
            onChange={value => {
              updateNotificationPermission("receiveSaleOpeningClosingNotification", value)
            }}
          />
        </Box>
        <Box py={1} px={2}>
          <Sans size="4t" color="black100" weight="medium" py={1}>
            Recommendations
          </Sans>
          <SwitchMenu
            title="New Works for You"
            description="New works added by artists you follow"
            value={!!me.receiveNewWorksNotification}
            onChange={value => {
              updateNotificationPermission("receiveNewWorksNotification", value)
            }}
          />
          <SwitchMenu
            title="New Auctions for You"
            description="New auctions with artists you follow"
            value={!!me.receiveNewSalesNotification}
            onChange={value => {
              updateNotificationPermission("receiveNewSalesNotification", value)
            }}
          />
          <SwitchMenu
            title="Promotions"
            description="Updates on Artsy’s latest campaigns and special offers."
            value={!!me.receivePromotionNotification}
            onChange={value => {
              updateNotificationPermission("receivePromotionNotification", value)
            }}
          />
        </Box>
      </Join>
    </View>
  )

  return (
    <PageWithSimpleHeader title="Push Notifications">
      <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
        {!!hasPushNotificationsEnabled && renderAllowPushNotificationsBanner()}
        {renderContent()}
      </ScrollView>
    </PageWithSimpleHeader>
  )
}

export const updateMyProfilePushNotifications = async (input: updateMyUserProfileMutation["variables"]["input"]) => {
  await new Promise((resolve, reject) =>
    commitMutation<MyProfilePushNotificationsMutation>(defaultEnvironment, {
      onCompleted: resolve,
      mutation: graphql`
        mutation MyProfilePushNotificationsMutation($input: UpdateMyProfileInput!) {
          updateMyUserProfile(input: $input) {
            me {
              receiveLotOpeningSoonNotification
              receiveNewSalesNotification
              receiveNewWorksNotification
              receiveOutbidNotification
              receivePromotionNotification
              receivePurchaseNotification
              receiveSaleOpeningClosingNotification
            }
          }
        }
      `,
      variables: {
        input,
      },
      optimisticResponse: {
        updateMyUserProfile: {
          me: {
            ...(input as any),
          },
        },
      },
      onError: e => {
        // try to ge a user-facing error message
        try {
          const message = JSON.parse(JSON.stringify(e))?.res?.json?.errors?.[0]?.message ?? ""
          // should be like "https://api.artsy.net/api/v1/me?email=david@artsymail.com - {"error": "User-facing error message"}"
          if (typeof message === "string") {
            const jsonString = message.match(/http.* (\{.*)$/)?.[1]
            if (jsonString) {
              const json = JSON.parse(jsonString)
              if (typeof json?.error === "string") {
                reject(json.error)
                return
              }
            }
          }
        } catch (e) {
          // fall through
        }
        reject("Something went wrong")
      },
    })
  )
}

const MyProfilePushNotificationsContainer = createRefetchContainer(
  MyProfilePushNotifications,
  {
    me: graphql`
      fragment MyProfilePushNotifications_me on Me {
        receiveLotOpeningSoonNotification
        receiveNewSalesNotification
        receiveNewWorksNotification
        receiveOutbidNotification
        receivePromotionNotification
        receivePurchaseNotification
        receiveSaleOpeningClosingNotification
      }
    `,
  },
  graphql`
    query MyProfilePushNotificationsRefetchQuery {
      me {
        ...MyProfilePushNotifications_me
      }
    }
  `
)

export const MyProfilePushNotificationsQueryRenderer: React.FC<{}> = ({}) => {
  return (
    <QueryRenderer<MyProfilePushNotificationsQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyProfilePushNotificationsQuery {
          me {
            ...MyProfilePushNotifications_me
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: MyProfilePushNotificationsContainer,
        // TODO: Adjust Placeholder
        renderPlaceholder: () => (
          <Sans size="3t" color={colors["gray-semibold"]} marginTop="1" marginBottom="2">
            Loading
          </Sans>
        ),
      })}
      variables={{}}
    />
  )
}

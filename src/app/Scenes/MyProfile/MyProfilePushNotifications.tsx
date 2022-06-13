import { MyProfilePushNotifications_me$data } from "__generated__/MyProfilePushNotifications_me.graphql"
import { MyProfilePushNotificationsQuery } from "__generated__/MyProfilePushNotificationsQuery.graphql"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { SwitchMenu } from "app/Components/SwitchMenu"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { defaultEnvironment } from "app/relay/createEnvironment"
import {
  getNotificationPermissionsStatus,
  PushAuthorizationStatus,
} from "app/utils/PushNotification"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import useAppState from "app/utils/useAppState"
import { debounce } from "lodash"
import { Box, Button, Flex, Join, Sans, Separator } from "palette"
import React, { useCallback, useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { updateMyUserProfile } from "../MyAccount/updateMyUserProfile"

const INSTRUCTIONS = Platform.select({
  ios: `To receive push notifications from Artsy, you will need to enable them in your iOS Settings. Tap 'Artsy' and
  toggle 'Allow Notifications' on.`,
  android: `To receive push notifications from Artsy, you will need to enable them in your device settings.
  Go to 'Apps', Tap on 'Artsy' to access Artsy specific settings, Tap on 'Notifications' and toggle 'Show Notifications' on.`,
  default: "",
})

export type UserPushNotificationSettings =
  | "receiveLotOpeningSoonNotification"
  | "receiveNewSalesNotification"
  | "receiveNewWorksNotification"
  | "receiveOutbidNotification"
  | "receivePromotionNotification"
  | "receivePurchaseNotification"
  | "receiveSaleOpeningClosingNotification"
  | "receiveOrderNotification"

export const OpenSettingsBanner = () => (
  <>
    <Flex py={3} px={2} backgroundColor="black5" alignItems="center">
      <Sans size="4t" weight="medium" color="black">
        Artsy would like to send you notifications
      </Sans>
      <Sans size="3t" textAlign="center" color="black60" marginTop="1" marginBottom="2">
        {INSTRUCTIONS}
      </Sans>
      <Button
        size="large"
        onPress={Platform.select({
          ios: () => {
            Linking.openURL("App-prefs:NOTIFICATIONS_ID")
          },
          android: () => Linking.openSettings(),
        })}
      >
        Open settings
      </Button>
    </Flex>
    <Separator />
  </>
)

export const AllowPushNotificationsBanner = () => (
  <>
    <Flex py={3} px={2} backgroundColor="black5" alignItems="center">
      <Sans size="4t" weight="medium" color="black">
        Artsy would like to send you notifications
      </Sans>
      <Sans size="3t" textAlign="center" color="black60" marginTop="1" marginBottom="2">
        We need your permission to send push notifications, which may include alerts, artwork
        reminders or purchase updates.
      </Sans>
      <Button
        size="large"
        onPress={() => {
          LegacyNativeModules.ARTemporaryAPIModule.requestDirectNotificationPermissions()
        }}
      >
        Enable
      </Button>
    </Flex>
    <Separator />
  </>
)

const NotificationPermissionsBox = ({
  children,
  title,
  isLoading,
}: {
  children: React.ReactNode
  title: string
  isLoading: boolean
}) => (
  <Box py={1} px={2}>
    <Sans size="4t" color={isLoading ? "black60" : "black100"} weight="medium" py={1}>
      {title}
    </Sans>
    {children}
  </Box>
)

export const MyProfilePushNotifications: React.FC<{
  me: MyProfilePushNotifications_me$data
  relay: RelayRefetchProp
  isLoading: boolean
}> = ({ me, relay, isLoading = false }) => {
  const [notificationAuthorizationStatus, setNotificationAuthorizationStatus] =
    useState<PushAuthorizationStatus>(PushAuthorizationStatus.NotDetermined)
  const [userNotificationSettings, setUserNotificationSettings] =
    useState<MyProfilePushNotifications_me$data>(me)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  useEffect(() => {
    getPermissionStatus()
  }, [])

  const onForeground = useCallback(() => {
    getPermissionStatus()
  }, [])

  useAppState({ onForeground })

  const getPermissionStatus = async () => {
    const status = await getNotificationPermissionsStatus()
    setNotificationAuthorizationStatus(status)
  }

  const onRefresh = useCallback(() => {
    if (relay) {
      setIsRefreshing(true)
      relay.refetch(() => {
        setIsRefreshing(false)
      })
    }
  }, [])

  const handleUpdateUserNotificationSettings = useCallback(
    async (notificationType: UserPushNotificationSettings, value: boolean) => {
      try {
        const updatedUserNotificationSettings = {
          ...userNotificationSettings,
          [notificationType]: value,
        }
        setUserNotificationSettings(updatedUserNotificationSettings)
        await updateNotificationPermissions(updatedUserNotificationSettings)
      } catch (error) {
        setUserNotificationSettings(userNotificationSettings)
        Alert.alert(typeof error === "string" ? error : "Something went wrong.")
      }
    },
    [userNotificationSettings]
  )

  const updateNotificationPermissions = useCallback(
    debounce(async (updatedPermissions: MyProfilePushNotifications_me$data) => {
      await updateMyUserProfile(updatedPermissions)
    }, 500),
    []
  )

  // Render list of enabled push notification permissions
  const renderContent = () => (
    <View
      style={{
        opacity: notificationAuthorizationStatus === PushAuthorizationStatus.Authorized ? 1 : 0.5,
      }}
      pointerEvents={
        notificationAuthorizationStatus === PushAuthorizationStatus.Authorized ? "auto" : "none"
      }
    >
      <Join separator={<Separator my={1} />}>
        <NotificationPermissionsBox title="Purchase Updates" isLoading={isLoading}>
          <SwitchMenu
            title="Messages"
            description="Messages from sellers on your inquiries"
            value={!!userNotificationSettings.receivePurchaseNotification}
            disabled={isLoading}
            onChange={(value) => {
              handleUpdateUserNotificationSettings("receivePurchaseNotification", value)
            }}
          />
          <SwitchMenu
            title="Outbid Alerts"
            description="Alerts for when you've been outbid"
            value={!!userNotificationSettings.receiveOutbidNotification}
            disabled={isLoading}
            onChange={(value) => {
              handleUpdateUserNotificationSettings("receiveOutbidNotification", value)
            }}
          />
          <SwitchMenu
            title="Order Updates"
            description="An order you've placed has an update"
            value={!!userNotificationSettings.receiveOrderNotification}
            disabled={isLoading}
            onChange={(value) => {
              handleUpdateUserNotificationSettings("receiveOrderNotification", value)
            }}
          />
        </NotificationPermissionsBox>
        <NotificationPermissionsBox title="Reminders" isLoading={isLoading}>
          <SwitchMenu
            title="Lot Opening Soon"
            description="Your lots that are opening for live bidding soon"
            value={!!userNotificationSettings.receiveLotOpeningSoonNotification}
            disabled={isLoading}
            onChange={(value) => {
              handleUpdateUserNotificationSettings("receiveLotOpeningSoonNotification", value)
            }}
          />
          <SwitchMenu
            title="Auctions Starting and Closing"
            description="Your registered auctions that are starting or closing soon"
            value={!!userNotificationSettings.receiveSaleOpeningClosingNotification}
            disabled={isLoading}
            onChange={(value) => {
              handleUpdateUserNotificationSettings("receiveSaleOpeningClosingNotification", value)
            }}
          />
        </NotificationPermissionsBox>
        <NotificationPermissionsBox title="Recommendations" isLoading={isLoading}>
          <SwitchMenu
            title="New Works for You"
            description="New works added by artists you follow"
            value={!!userNotificationSettings.receiveNewWorksNotification}
            disabled={isLoading}
            onChange={(value) => {
              handleUpdateUserNotificationSettings("receiveNewWorksNotification", value)
            }}
          />
          <SwitchMenu
            title="New Auctions for You"
            description="New auctions with artists you follow"
            value={!!userNotificationSettings.receiveNewSalesNotification}
            disabled={isLoading}
            onChange={(value) => {
              handleUpdateUserNotificationSettings("receiveNewSalesNotification", value)
            }}
          />
          <SwitchMenu
            title="Promotions"
            description="Updates on Artsy's latest campaigns and special offers."
            value={!!userNotificationSettings.receivePromotionNotification}
            disabled={isLoading}
            onChange={(value) => {
              handleUpdateUserNotificationSettings("receivePromotionNotification", value)
            }}
          />
        </NotificationPermissionsBox>
      </Join>
    </View>
  )

  return (
    <PageWithSimpleHeader
      title="Push Notifications"
      right={isLoading ? <ActivityIndicator style={{ marginRight: 5 }} /> : null}
    >
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {notificationAuthorizationStatus === PushAuthorizationStatus.Denied && (
          <OpenSettingsBanner />
        )}
        {notificationAuthorizationStatus === PushAuthorizationStatus.NotDetermined &&
          Platform.OS === "ios" && <AllowPushNotificationsBanner />}
        {renderContent()}
      </ScrollView>
    </PageWithSimpleHeader>
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
        receiveOrderNotification
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
        renderPlaceholder: () => (
          <MyProfilePushNotifications isLoading me={{} as any} relay={null as any} />
        ),
      })}
      variables={{}}
    />
  )
}

import { OwnerType } from "@artsy/cohesion"
import { Box, Button, Flex, Join, Separator, Text } from "@artsy/palette-mobile"
import { MyProfilePushNotificationsQuery } from "__generated__/MyProfilePushNotificationsQuery.graphql"
import {
  MyProfilePushNotifications_me$data,
  MyProfilePushNotifications_me$key,
} from "__generated__/MyProfilePushNotifications_me.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { SwitchMenu } from "app/Components/SwitchMenu"
import { updateMyUserProfile } from "app/Scenes/MyAccount/updateMyUserProfile"
import { MyProfileScreenWrapper } from "app/Scenes/MyProfile/Components/MyProfileScreenWrapper"
import {
  getNotificationPermissionsStatus,
  PushAuthorizationStatus,
} from "app/utils/PushNotification"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { PlaceholderBox } from "app/utils/placeholders"
import { requestSystemPermissions } from "app/utils/requestPushNotificationsPermission"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import useAppState from "app/utils/useAppState"
import { debounce } from "lodash"
import React, { useCallback, useEffect, useState } from "react"
import { Alert, Linking, Platform, RefreshControl, ScrollView } from "react-native"
import { graphql, useLazyLoadQuery, useRefetchableFragment } from "react-relay"

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
  | "receivePartnerOfferNotification"

export const OpenSettingsBanner = () => (
  <>
    <Flex py={4} px={2} backgroundColor="mono5" alignItems="center">
      <Text variant="sm-display" weight="medium" color="mono100">
        Artsy would like to send you notifications
      </Text>
      <Text variant="sm" textAlign="center" color="mono60" marginTop={1} marginBottom={2}>
        {INSTRUCTIONS}
      </Text>
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
    <Flex py={4} px={2} backgroundColor="mono5" alignItems="center">
      <Text variant="sm-display" weight="medium" color="mono100">
        Artsy would like to send you notifications
      </Text>
      <Text variant="sm" textAlign="center" color="mono60" marginTop={1} marginBottom={2}>
        We need your permission to send push notifications, which may include alerts, artwork
        reminders or purchase updates.
      </Text>
      <Button
        size="large"
        onPress={() => {
          requestSystemPermissions()
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
    <Text variant="sm-display" color={isLoading ? "mono60" : "mono100"} weight="medium" py={1}>
      {title}
    </Text>
    {children}
  </Box>
)

const MyProfilePushNotificationsPlaceholder: React.FC<{}> = () => {
  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")

  if (enableRedesignedSettings) {
    return (
      <MyProfileScreenWrapper
        title="Notifications"
        contentContainerStyle={{ paddingHorizontal: 0 }}
      >
        <Flex>
          <Content
            userNotificationSettings={
              {
                id: "1",
                receiveLotOpeningSoonNotification: false,
                receiveNewSalesNotification: false,
                receiveNewWorksNotification: false,
                receiveOrderNotification: false,
                receiveOutbidNotification: false,
                receivePartnerOfferNotification: false,
                receivePartnerShowNotification: false,
                receivePromotionNotification: false,
                receivePurchaseNotification: false,
                receiveSaleOpeningClosingNotification: false,
                receiveViewingRoomNotification: false,
              } as MyProfilePushNotifications_me$data
            }
            isLoading={true}
            handleUpdateUserNotificationSettings={() => {}}
            notificationAuthorizationStatus={PushAuthorizationStatus.NotDetermined}
          />
        </Flex>
      </MyProfileScreenWrapper>
    )
  }

  return (
    <Flex p={2}>
      <PlaceholderBox height={40} />
      <Separator my={1} />
      <PlaceholderBox height={40} />
      <Separator my={1} />
      <PlaceholderBox height={40} />
    </Flex>
  )
}

export const MyProfilePushNotifications: React.FC<{
  me: MyProfilePushNotifications_me$key
  isLoading?: boolean
}> = ({ me, isLoading = false }) => {
  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")

  const [notificationAuthorizationStatus, setNotificationAuthorizationStatus] =
    useState<PushAuthorizationStatus>(PushAuthorizationStatus.NotDetermined)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  const [fragmentData, refetch] = useRefetchableFragment<
    MyProfilePushNotificationsQuery,
    MyProfilePushNotifications_me$key
  >(meFragment, me)

  const [userNotificationSettings, setUserNotificationSettings] = useState(fragmentData)

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
    setIsRefreshing(true)
    refetch({}, { fetchPolicy: "store-and-network" })
    setIsRefreshing(false)
  }, [refetch])

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

  if (enableRedesignedSettings) {
    return (
      <ProvideScreenTrackingWithCohesionSchema
        info={screen({
          context_screen_owner_type: OwnerType.accountNotifications,
        })}
      >
        <MyProfileScreenWrapper
          title="Notifications"
          contentContainerStyle={{
            // Override the default paddingHorizontal of MyProfileScreenWrapper
            paddingHorizontal: 0,
          }}
          RefreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        >
          {notificationAuthorizationStatus === PushAuthorizationStatus.Denied && (
            <OpenSettingsBanner />
          )}
          {notificationAuthorizationStatus === PushAuthorizationStatus.NotDetermined &&
            Platform.OS === "ios" && <AllowPushNotificationsBanner />}
          <Content
            userNotificationSettings={userNotificationSettings}
            isLoading={isLoading}
            handleUpdateUserNotificationSettings={handleUpdateUserNotificationSettings}
            notificationAuthorizationStatus={notificationAuthorizationStatus}
          />
        </MyProfileScreenWrapper>
      </ProvideScreenTrackingWithCohesionSchema>
    )
  }

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.accountNotifications,
      })}
    >
      <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
        {notificationAuthorizationStatus === PushAuthorizationStatus.Denied && <OpenSettingsBanner />}
        {notificationAuthorizationStatus === PushAuthorizationStatus.NotDetermined &&
          Platform.OS === "ios" && <AllowPushNotificationsBanner />}
        <Content
          userNotificationSettings={userNotificationSettings}
          isLoading={isLoading}
          handleUpdateUserNotificationSettings={handleUpdateUserNotificationSettings}
          notificationAuthorizationStatus={notificationAuthorizationStatus}
        />
      </ScrollView>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const Content: React.FC<{
  userNotificationSettings: MyProfilePushNotifications_me$data
  isLoading: boolean
  handleUpdateUserNotificationSettings: (
    notificationType: UserPushNotificationSettings,
    value: boolean
  ) => void
  notificationAuthorizationStatus: PushAuthorizationStatus
}> = ({
  userNotificationSettings,
  isLoading,
  handleUpdateUserNotificationSettings,
  notificationAuthorizationStatus,
}) => {
  const enablePartnerOffersNotificationSwitch = useFeatureFlag(
    "AREnablePartnerOffersNotificationSwitch"
  )

  return (
    <Flex
      opacity={notificationAuthorizationStatus === PushAuthorizationStatus.Authorized ? 1 : 0.5}
      pointerEvents={
        notificationAuthorizationStatus === PushAuthorizationStatus.Authorized ? "auto" : "none"
      }
    >
      <Join separator={<Separator my={1} />}>
        {!!enablePartnerOffersNotificationSwitch && (
          <NotificationPermissionsBox title="Gallery Offers" isLoading={isLoading}>
            <SwitchMenu
              title="Offers on Saved Artworks"
              description="Offers from galleries on artworks you saved"
              value={!!userNotificationSettings.receivePartnerOfferNotification}
              disabled={isLoading}
              onChange={(value) => {
                handleUpdateUserNotificationSettings("receivePartnerOfferNotification", value)
              }}
            />
          </NotificationPermissionsBox>
        )}
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
            testID="newWorksSwitch"
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
    </Flex>
  )
}

const meFragment = graphql`
  fragment MyProfilePushNotifications_me on Me
  @refetchable(queryName: "MyProfilePushNotificationsRefetchQuery") {
    receiveLotOpeningSoonNotification
    receiveNewSalesNotification
    receiveNewWorksNotification
    receiveOutbidNotification
    receivePromotionNotification
    receivePurchaseNotification
    receiveSaleOpeningClosingNotification
    receiveOrderNotification
    receiveViewingRoomNotification
    receivePartnerShowNotification
    receivePartnerOfferNotification
  }
`

export const MyProfilePushNotificationsQueryRenderer: React.FC<{}> = withSuspense({
  Component: ({}) => {
    const data = useLazyLoadQuery<MyProfilePushNotificationsQuery>(
      graphql`
        query MyProfilePushNotificationsQuery {
          me {
            ...MyProfilePushNotifications_me
          }
        }
      `,
      {}
    )

    if (!data.me) {
      return null
    }

    return <MyProfilePushNotifications me={data.me} />
  },
  LoadingFallback: MyProfilePushNotificationsPlaceholder,
  ErrorFallback: (fallbackProps) => {
    return (
      <LoadFailureView
        onRetry={fallbackProps.resetErrorBoundary}
        useSafeArea={false}
        error={fallbackProps.error}
        trackErrorBoundary={false}
      />
    )
  },
})

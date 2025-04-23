import { ActionType, OwnerType } from "@artsy/cohesion"
import { BagIcon, CreditCardIcon, FilterIcon, LockIcon, MobileIcon } from "@artsy/icons/native"
import {
  Button,
  Flex,
  Join,
  LinkText,
  Screen,
  Separator,
  Spacer,
  Text,
  Touchable,
  useColor,
  useSpace,
} from "@artsy/palette-mobile"
import { MenuItem } from "app/Components/MenuItem"
import { presentEmailComposer } from "app/NativeModules/presentEmailComposer"
import { MyProfileHeader } from "app/Scenes/MyProfile/Components/MyProfileHeader"
import { GlobalStore } from "app/store/GlobalStore"
import { useSetDevMode } from "app/system/devTools/useSetDevMode"
import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { compact } from "lodash"
import { Alert, ScrollView } from "react-native"
import DeviceInfo from "react-native-device-info"
import { useTracking } from "react-tracking"

type MenuItemT = {
  title: string
  href?: string
  ownerType?: OwnerType
  onPress?: () => void
}

export const MyProfileSettings: React.FC = () => {
  const supportsDarkMode = useFeatureFlag("ARDarkModeSupport")
  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")
  const color = useColor()
  const space = useSpace()
  const appVersion = DeviceInfo.getVersion()
  const { updateTapCount } = useSetDevMode()
  const { value: userIsDev } = GlobalStore.useAppState((store) => store.artsyPrefs.userIsDev)
  const tracking = useTracking()
  const separatorColor = color("mono5")

  if (enableRedesignedSettings) {
    return (
      <Screen.ScrollView>
        <MyProfileHeader />

        <Text variant="lg-display" px={2} mt={4}>
          Profile
        </Text>
        <Join separator={<Spacer y={4} />}>
          <>
            <Text variant="xs" color="mono60" px={2} mt={2}>
              Transactions
            </Text>

            <MenuItem title="Your Orders" href="/orders" icon={<BagIcon />} />
          </>

          <>
            <Text variant="xs" color="mono60" px={2}>
              Account
            </Text>

            <MenuItem title="Login and security" href="my-account" icon={<LockIcon />} />
            <MenuItem title="Payments" href="my-profile/payment" icon={<CreditCardIcon />} />
            <MenuItem
              title="Notifications"
              href="my-profile/push-notifications"
              icon={<MobileIcon />}
            />
            <MenuItem
              title="Preferences"
              // Jira ticket: ONYX-1642
              href="my-profile/preferences"
              icon={<FilterIcon />}
            />
          </>

          <>
            <Text variant="xs" color="mono60" px={2}>
              Support
            </Text>

            <MenuItem
              title="Help Center"
              onPress={() => {
                navigate("help.artsy.net")
              }}
            />
            <MenuItem
              title="Send Feedback"
              onPress={() =>
                presentEmailComposer("support@artsy.net", "Feedback from the Artsy app")
              }
            />
          </>

          <>
            <Text variant="xs" color="mono60" px={2}>
              Legal
            </Text>

            <MenuItem
              title="Terms and Conditions"
              onPress={() => {
                // TODO: add new route
                // Jira ONYX - 1642
                navigate("my-profile/terms-and-conditions")
              }}
            />
            <MenuItem
              title="Privacy"
              onPress={() => {
                navigate("my-profile/terms-and-conditions")
              }}
            />
          </>

          <Flex justifyContent="center" px={2} pb={2}>
            <LinkText onPress={confirmLogout} variant="sm">
              Log Out
            </LinkText>
            <Spacer y={4} />
            <Touchable onPress={() => updateTapCount((count) => count + 1)}>
              <Text variant="xs" color={userIsDev ? "devpurple" : "mono60"}>
                Version: {appVersion}
              </Text>
            </Touchable>
          </Flex>
        </Join>
      </Screen.ScrollView>
    )
  }

  const ACCOUNT_MENU_ITEMS: MenuItemT[] = compact([
    {
      title: "Edit Profile",
      href: "my-profile/edit",
      ownerType: OwnerType.accountSettings,
    },
    {
      title: "Account Settings",
      href: "my-account",
      ownerType: OwnerType.accountSettings,
    },
    {
      title: "Payment",
      href: "my-profile/payment",
      ownerType: OwnerType.accountPayment,
    },
    {
      title: "Push Notifications",
      href: "my-profile/push-notifications",
      ownerType: OwnerType.accountNotifications,
    },
    {
      title: "Send Feedback",
      onPress: () => {
        presentEmailComposer("support@artsy.net", "Feedback from the Artsy app")
      },
    },
    {
      title: "Personal Data Request",
      href: "privacy-request",
      ownerType: OwnerType.accountPersonalDataRequest,
    },
    {
      title: "Recently Viewed",
      href: "recently-viewed",
      ownerType: OwnerType.recentlyViewed,
    },
    supportsDarkMode && {
      title: "Dark Mode",
      href: "/settings/dark-mode",
      ownerType: OwnerType.accountDarkMode,
    },
    {
      title: "About",
      href: "about",
      ownerType: OwnerType.about,
    },
  ])

  return (
    <ScrollView
      contentContainerStyle={{ paddingTop: space(2), backgroundColor: color("background") }}
    >
      <Text variant="xs" color="mono60" px={2}>
        Settings
      </Text>
      <Spacer y={2} />
      {ACCOUNT_MENU_ITEMS.map((item, index) => {
        return (
          <MenuItem
            key={index}
            title={item.title}
            href={item.href}
            onPress={() => {
              item.onPress?.()
              if (item.ownerType) {
                tracking.trackEvent(
                  tracks.trackMenuTap({
                    subject: item.title,
                    ownerType: item.ownerType,
                    position: index,
                  })
                )
              }
            }}
          />
        )
      })}

      <Spacer y={4} />

      <Text variant="xs" color="mono60" px={2}>
        Transactions
      </Text>

      <Spacer y={2} />

      <MenuItem
        title="Order History"
        href="/orders"
        onPress={() => {
          tracking.trackEvent(
            tracks.trackMenuTap({
              subject: "Order History",
              ownerType: OwnerType.ordersHistory,
              position: ACCOUNT_MENU_ITEMS.length + 1,
            })
          )
        }}
      />
      <Separator my={1} borderColor={separatorColor} />

      <Flex flexDirection="row" alignItems="center" justifyContent="center" py="7.5px" px={2}>
        <Button variant="fillDark" haptic onPress={confirmLogout} block>
          Log Out
        </Button>
      </Flex>
      <Spacer y={1} />
    </ScrollView>
  )
}

export function confirmLogout() {
  Alert.alert("Log out?", "Are you sure you want to log out?", [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Log out",
      style: "destructive",
      onPress: () => GlobalStore.actions.auth.signOut(),
    },
  ])
}

const tracks = {
  trackMenuTap: ({
    ownerType,
    position,
    subject,
  }: {
    ownerType: OwnerType
    position: number
    subject: string
  }) => ({
    action_type: ActionType.tappedMenuItemGroup,
    subject,
    context_module: ownerType,
    context_screen_owner_type: OwnerType.account,
    position,
  }),
}

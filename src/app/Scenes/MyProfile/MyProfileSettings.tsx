import {
  ActionType,
  ContextModule,
  OwnerType,
  TappedEditedProfile,
  TappedMyCollection,
} from "@artsy/cohesion"
import { BagIcon, CreditCardIcon, FilterIcon, LockIcon, MobileIcon } from "@artsy/icons/native"
import { Flex, Join, LinkText, Screen, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import * as Sentry from "@sentry/react-native"
import { MenuItem } from "app/Components/MenuItem"
import { UserAccountHeaderQueryRenderer } from "app/Scenes/MyProfile/Components/UserAccountHeader/UserAccountHeader"
import { GlobalStore } from "app/store/GlobalStore"
import { useSetDevMode } from "app/system/devTools/useSetDevMode"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { presentEmailComposer } from "app/utils/email/presentEmailComposer"
import { Alert } from "react-native"
import DeviceInfo from "react-native-device-info"
import { useTracking } from "react-tracking"

export const MyProfileSettings: React.FC = () => {
  const appVersion = DeviceInfo.getVersion()
  const { updateTapCount } = useSetDevMode()
  const { value: userIsDev } = GlobalStore.useAppState((store) => store.artsyPrefs.userIsDev)
  const tracking = useTracking()

  return (
    <Screen>
      <Screen.Body fullwidth>
        <Sentry.TimeToInitialDisplay record>
          <Screen.ScrollView>
            <UserAccountHeaderQueryRenderer
              showBorder
              showMyCollectionPreview
              tappable
              showCompleteProfile
              onAvatarPress={() => {
                tracking.trackEvent(tracks.trackTappedEditedProfile())
              }}
              onCardPress={() => {
                tracking.trackEvent(tracks.trackTappedMyCollection())
              }}
            />

            <Text variant="lg-display" px={2} mt={4}>
              Account
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

                <MenuItem title="Login and Security" href="my-account" icon={<LockIcon />} />
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
                    navigate("https://support.artsy.net/")
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
                    navigate("my-profile/terms-and-conditions")
                  }}
                />
                <MenuItem
                  title="Privacy"
                  onPress={() => {
                    navigate("my-profile/privacy")
                  }}
                />
              </>

              <Flex justifyContent="center" px={2} pb={2}>
                <LinkText onPress={confirmLogout} variant="sm">
                  Log out
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
        </Sentry.TimeToInitialDisplay>
      </Screen.Body>
    </Screen>
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
  trackTappedMyCollection: (): TappedMyCollection => ({
    action: ActionType.tappedMyCollection,
    context_module: ContextModule.collectorProfileCard,
    context_screen: OwnerType.profile,
  }),
  trackTappedEditedProfile: (): TappedEditedProfile => ({
    action: ActionType.tappedEditedProfile,
    context_module: ContextModule.collectorProfileCard,
    context_screen: OwnerType.profile,
  }),
}

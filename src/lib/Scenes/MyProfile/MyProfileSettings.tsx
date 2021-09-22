import { MyProfile_me } from "__generated__/MyProfile_me.graphql"
import { MyProfileSettings_me } from "__generated__/MyProfileSettings_me.graphql"
import { MyProfileSettingsQuery } from "__generated__/MyProfileSettingsQuery.graphql"
import { LoadFailureView } from "lib/Components/LoadFailureView"
import { MenuItem } from "lib/Components/MenuItem"
import { presentEmailComposer } from "lib/NativeModules/presentEmailComposer"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { GlobalStore, useFeatureFlag } from "lib/store/GlobalStore"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Button, Flex, Sans, Separator, Spacer, useColor } from "palette"
import React, { useCallback, useRef, useState } from "react"
import { Alert, FlatList, RefreshControl, ScrollView } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { SmallTileRailContainer } from "../Home/Components/SmallTileRail"

const MyProfileSettings: React.FC<{ me: MyProfileSettings_me; relay: RelayRefetchProp }> = ({ me, relay }) => {
  const showOrderHistory = useFeatureFlag("AREnableOrderHistoryOption")
  const showSavedAddresses = useFeatureFlag("AREnableSavedAddresses")
  const showSavedSearchV2 = useFeatureFlag("AREnableSavedSearchV2")
  const listRef = useRef<FlatList<any>>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    relay.refetch(() => {
      setIsRefreshing(false)
      listRef.current?.scrollToOffset({ offset: 0, animated: false })
    })
  }, [])

  const color = useColor()
  const separatorColor = color("black5")

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
      <Sans size="8" mx="2" mt="6">
        {"Settings"}
      </Sans>
      <Spacer mt={3} mb={2} />
      <SectionHeading title="FAVORITES" />
      <Spacer my={1} />
      {!!showSavedSearchV2 && (
        <>
          <MenuItem title="Saved Alerts" onPress={() => navigate("my-profile/saved-search-alerts")} />
          <Separator my={1} borderColor={separatorColor} />
        </>
      )}
      <MenuItem
        title="Follows"
        onPress={() =>
          navigate("favorites", {
            passProps: {
              enableMyCollection: me.labFeatures.includes("My Collection"),
            },
          })
        }
      />
      <Separator my={1} borderColor={separatorColor} />

      <Spacer my={2} />
      <SectionHeading title="ACCOUNT SETTINGS" />
      <Spacer my={1} />
      <MenuItem title="Account" onPress={() => navigate("my-account")} />
      <Separator my={1} borderColor={separatorColor} />
      {!!showOrderHistory && (
        <>
          <MenuItem title="Order History" onPress={() => navigate("/orders")} />
          <Separator my={1} borderColor={separatorColor} />
        </>
      )}
      <MenuItem title="Payment" onPress={() => navigate("my-profile/payment")} />
      <Separator my={1} borderColor={separatorColor} />

      {!!showSavedAddresses && (
        <>
          <MenuItem title="Saved Addresses" onPress={() => navigate("my-profile/saved-addresses")} />
          <Separator my={1} borderColor={separatorColor} />
        </>
      )}

      <MenuItem title="Push Notifications" onPress={() => navigate("my-profile/push-notifications")} />
      <Separator my={1} borderColor={separatorColor} />

      <MenuItem
        title="Send Feedback"
        onPress={() => presentEmailComposer("support@artsy.net", "Feedback from the Artsy app")}
      />
      <Separator my={1} borderColor={separatorColor} />

      <MenuItem title="Personal Data Request" onPress={() => navigate("privacy-request")} />
      <Separator my={1} borderColor={separatorColor} />

      <MenuItem title="About" onPress={() => navigate("about")} />
      <Separator my={1} borderColor={separatorColor} />

      <Flex flexDirection="row" alignItems="center" justifyContent="center" py={7.5} px="2" pr="15px">
        <Button variant="primaryBlack" haptic onPress={confirmLogout} block>
          Log Out{" "}
        </Button>
      </Flex>
      <Spacer mb={1} />
    </ScrollView>
  )
}

export const MyProfileSettingsPlaceholder: React.FC<{}> = () => {
  const color = useColor()
  const separatorColor = color("black5")
  // random num between 100 and 150
  const randomWidth = () => Math.floor(Math.random() * (150 - 100 + 1)) + 100
  return (
    <Flex ml={20}>
      <Sans size="8" mx="2" mt="6">
        {"Settings"}
      </Sans>
      <Spacer mt={3} mb={2} />
      <SectionHeading title="FAVORITES" />
      <Spacer my={1} />
      <PlaceholderText width={randomWidth()} />
      <Separator my={1} borderColor={separatorColor} />
      <PlaceholderText width={randomWidth()} />
      <Separator my={1} borderColor={separatorColor} />

      <Spacer my={2} />
      <SectionHeading title="ACCOUNT SETTINGS" />
      <Spacer my={1} />
      <PlaceholderText width={randomWidth()} />
      <Separator my={1} borderColor={separatorColor} />
      <PlaceholderText width={randomWidth()} />
      <Separator my={1} borderColor={separatorColor} />
      <PlaceholderText width={randomWidth()} />
      <Separator my={1} borderColor={separatorColor} />

      <PlaceholderText width={randomWidth()} />
      <Separator my={1} borderColor={separatorColor} />

      <PlaceholderText width={randomWidth()} />

      <Separator my={1} borderColor={separatorColor} />

      <PlaceholderText width={randomWidth()} />
      <Separator my={1} borderColor={separatorColor} />

      <PlaceholderText width={randomWidth()} />
      <Separator my={1} borderColor={separatorColor} />
      <Spacer mb={1} />
      <Flex flexDirection="row" alignItems="center" justifyContent="center" py={7.5} px="2" pr="15px">
        <Button variant="primaryBlack" haptic onPress={confirmLogout} block>
          Log Out{" "}
        </Button>
      </Flex>
      <Spacer mb={1} />
    </Flex>
  )
}

const SectionHeading: React.FC<{ title: string }> = ({ title }) => (
  <Sans size="3" color="black100" mb="1" mx="2">
    {title}
  </Sans>
)

export const MyProfileSettingsContainer = createRefetchContainer(
  MyProfileSettings,
  {
    me: graphql`
      fragment MyProfileSettings_me on Me {
        labFeatures
      }
    `,
  },
  graphql`
    query MyProfileSettingsRefetchQuery {
      me {
        ...MyProfileSettings_me
      }
    }
  `
)

export const MyProfileSettingsQueryRenderer: React.FC<{}> = ({}) => (
  // TODO:- Add Screen Tracking For MyProfileSettings
  <QueryRenderer<MyProfileSettingsQuery>
    environment={defaultEnvironment}
    query={graphql`
      query MyProfileSettingsQuery {
        me @optionalField {
          ...MyProfileSettings_me
        }
      }
    `}
    render={renderWithPlaceholder({
      Container: MyProfileSettingsContainer,
      renderPlaceholder: () => <MyProfileSettingsPlaceholder />,
      renderFallback: ({ retry }) => <FailedScreen retry={retry} />,
    })}
    variables={{}}
  />
)

export function confirmLogout() {
  Alert.alert("Log out?", "Are you sure you want to log out?", [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Log out",
      style: "destructive",
      onPress: () => GlobalStore.actions.signOut(),
    },
  ])
}

const FailedScreen: React.FC<{ retry: (() => void) | null }> = ({ retry }) => {
  const screenHeight = useScreenDimensions().height
  return (
    <Flex flex={1}>
      <LoadFailureView onRetry={retry || undefined} />
      <Flex position={"absolute"} top={screenHeight / 1.5} bottom={0} left={0} right={0}>
        <Spacer mb={1} />
        <Flex flexDirection="row" alignItems="center" justifyContent="center" py={7.5} px="2" pr="15px">
          <Button variant="primaryBlack" haptic onPress={confirmLogout} block>
            Log Out{" "}
          </Button>
        </Flex>
        <Spacer mb={1} />
      </Flex>
    </Flex>
  )
}

/*
 * TODO: Marked For Deletion. Remove when MyCollections is released
 */
export const OldMyProfileSettings: React.FC<{ me: MyProfile_me; relay: RelayRefetchProp }> = ({ me, relay }) => {
  const showOrderHistory = useFeatureFlag("AREnableOrderHistoryOption")
  const showSavedAddresses = useFeatureFlag("AREnableSavedAddresses")
  const showSavedSearchV2 = useFeatureFlag("AREnableSavedSearchV2")
  const listRef = useRef<FlatList<any>>(null)
  const recentlySavedArtworks = extractNodes(me?.followsAndSaves?.artworksConnection)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    relay.refetch(() => {
      setIsRefreshing(false)
      listRef.current?.scrollToOffset({ offset: 0, animated: false })
    })
  }, [])

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
      <Sans size="8" mx="2" mt="3">
        {me?.name}
      </Sans>
      <Separator my={2} />
      <SectionHeading title="Favorites" />
      {!!showSavedSearchV2 && (
        <MenuItem title="Saved Alerts" onPress={() => navigate("my-profile/saved-search-alerts")} />
      )}
      <MenuItem title="Saves and follows" onPress={() => navigate("favorites")} />
      {!!recentlySavedArtworks.length && (
        <SmallTileRailContainer artworks={recentlySavedArtworks} listRef={listRef} contextModule={null as any} />
      )}
      <Separator mt={3} mb={2} />
      <SectionHeading title="Account Settings" />
      <MenuItem title="Account" onPress={() => navigate("my-account")} />
      {!!showOrderHistory && <MenuItem title="Order History" onPress={() => navigate("/orders")} />}
      <MenuItem title="Payment" onPress={() => navigate("my-profile/payment")} />

      <MenuItem title="Push notifications" onPress={() => navigate("my-profile/push-notifications")} />

      {!!showSavedAddresses && (
        <MenuItem title="Saved Addresses" onPress={() => navigate("my-profile/saved-addresses")} />
      )}
      <MenuItem
        title="Send feedback"
        onPress={() => presentEmailComposer("support@artsy.net", "Feedback from the Artsy app")}
      />
      <MenuItem title="Personal data request" onPress={() => navigate("privacy-request")} />
      <MenuItem title="About" onPress={() => navigate("about")} />
      <MenuItem title="Log out" onPress={confirmLogout} chevron={null} />
      <Spacer mb={1} />
    </ScrollView>
  )
}

import { OwnerType } from "@artsy/cohesion"
import { MyProfile_me } from "__generated__/MyProfile_me.graphql"
import { MyProfileSettingsQuery } from "__generated__/MyProfileSettingsQuery.graphql"
import { MenuItem } from "lib/Components/MenuItem"
import { presentEmailComposer } from "lib/NativeModules/presentEmailComposer"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { GlobalStore, useFeatureFlag } from "lib/store/GlobalStore"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "lib/utils/track"
import { screen } from "lib/utils/track/helpers"
import { times } from "lodash"
import { Button, Flex, Join, Sans, Separator, Spacer, useColor } from "palette"
import React, { useCallback, useRef, useState } from "react"
import { Alert, FlatList, RefreshControl, ScrollView } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { SmallTileRailContainer } from "../Home/Components/SmallTileRail"

const MyProfileSettings: React.FC<{ me: MyProfile_me; relay: RelayRefetchProp }> = ({ me, relay }) => {
  const shouldDisplayMyCollection = me?.labFeatures?.includes("My Collection")
  if (shouldDisplayMyCollection) {
    return <NewMyProfileSettings me={me} relay={relay} />
  }
  return <OldMyProfileSettings me={me} relay={relay} />
}

export const MyProfileSettingsPlaceholder: React.FC<{}> = () => (
  <Flex pt="3" px="2">
    <Join separator={<Separator my={2} />}>
      <PlaceholderText width={100 + Math.random() * 100} marginTop={15} />
      <Flex>
        <PlaceholderText width={100 + Math.random() * 100} />
        <PlaceholderText width={100 + Math.random() * 100} marginTop={15} />
        <Flex flexDirection="row" py={2}>
          {times(3).map((index: number) => (
            <Flex key={index} marginRight={1}>
              <PlaceholderBox height={120} width={120} />
              <PlaceholderText marginTop={20} key={index} width={40 + Math.random() * 80} />
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Flex>
        <PlaceholderText width={100 + Math.random() * 100} />
        {times(3).map((index: number) => (
          <Flex key={index} py={1}>
            <PlaceholderText width={200 + Math.random() * 100} />
          </Flex>
        ))}
      </Flex>
    </Join>
  </Flex>
)

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
        name
        labFeatures
        createdAt
        followsAndSaves {
          artworksConnection(first: 10, private: true) {
            edges {
              node {
                id
                ...SmallTileRail_artworks
              }
            }
          }
        }
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
  <ProvideScreenTrackingWithCohesionSchema info={screen({ context_screen_owner_type: OwnerType.profile })}>
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
      })}
      variables={{}}
    />
  </ProvideScreenTrackingWithCohesionSchema>
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

/*
 * Marked For Deletion. Remove when MyCollections is released
 */
const OldMyProfileSettings: React.FC<{ me: MyProfile_me; relay: RelayRefetchProp }> = ({ me, relay }) => {
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

/**
 * To Replace OldMyProfileSettings
 */
const NewMyProfileSettings: React.FC<{ me: MyProfile_me; relay: RelayRefetchProp }> = ({ me, relay }) => {
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

      <MenuItem title="Push notifications" onPress={() => navigate("my-profile/push-notifications")} />
      <Separator my={1} borderColor={separatorColor} />

      {!!showSavedAddresses && (
        <>
          <MenuItem title="Saved Addresses" onPress={() => navigate("my-profile/saved-addresses")} />
          <Separator my={1} borderColor={separatorColor} />
        </>
      )}
      <MenuItem
        title="Send feedback"
        onPress={() => presentEmailComposer("support@artsy.net", "Feedback from the Artsy app")}
      />
      <Separator my={1} borderColor={separatorColor} />

      <MenuItem title="Personal data request" onPress={() => navigate("privacy-request")} />
      <Separator my={1} borderColor={separatorColor} />

      <MenuItem title="About" onPress={() => navigate("about")} />
      <Separator my={1} borderColor={separatorColor} />

      <Flex flexDirection="row" alignItems="center" justifyContent="center" py={7.5} px="2" pr="15px">
        <Button variant="fillDark" haptic onPress={confirmLogout} minWidth={"100%"}>
          Log Out{" "}
        </Button>
      </Flex>
      <Spacer mb={1} />
    </ScrollView>
  )
}

import { MyProfile_me } from "__generated__/MyProfile_me.graphql"
import { MyProfileQuery } from "__generated__/MyProfileQuery.graphql"
import { MenuItem } from "lib/Components/MenuItem"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { presentEmailComposer } from "lib/NativeModules/presentEmailComposer"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { times } from "lodash"
import { Flex, Join, Sans, Separator, Spacer } from "palette"
import React, { useCallback, useRef, useState } from "react"
import { Alert, FlatList, RefreshControl, ScrollView } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { SmallTileRailContainer } from "../Home/Components/SmallTileRail"

const MyProfile: React.FC<{ me: MyProfile_me; relay: RelayRefetchProp }> = ({ me, relay }) => {
  const listRef = useRef<FlatList<any>>(null)

  const recentlySavedArtworks = extractNodes(me.followsAndSaves?.artworksConnection)
  const shouldDisplayMyCollection = me.labFeatures?.includes("My Collection")
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
        {me.name}
      </Sans>
      <Separator my="2" />
      <SectionHeading title="Favorites" />
      {!!shouldDisplayMyCollection && (
        <MenuItem isBeta={true} title="My Collection" onPress={() => navigate("my-collection")} />
      )}
      <MenuItem title="Saves and follows" onPress={() => navigate("favorites")} />
      {!!recentlySavedArtworks.length && (
        <SmallTileRailContainer artworks={recentlySavedArtworks} listRef={listRef} contextModule={null as any} />
      )}
      <Separator mt="3" mb="2" />
      <SectionHeading title="Account Settings" />
      <MenuItem title="Account" onPress={() => navigate("my-account")} />
      <MenuItem title="Payment" onPress={() => navigate("my-profile/payment")} />
      <MenuItem title="Push notifications" onPress={() => navigate("my-profile/push-notifications")} />
      <MenuItem
        title="Send feedback"
        onPress={() => {
          presentEmailComposer("support@artsy.net", "Feedback from the Artsy app")
        }}
      />
      <MenuItem title="Personal data request" onPress={() => navigate("privacy-request")} />
      <MenuItem title="About" onPress={() => navigate("about")} />
      <MenuItem title="Log out" onPress={confirmLogout} chevron={null} />
      <Spacer mb="1" />
    </ScrollView>
  )
}

export const MyProfilePlaceholder: React.FC<{}> = () => (
  <Flex pt="3" px="2">
    <Join separator={<Separator my="2" />}>
      <PlaceholderText width={100 + Math.random() * 100} marginTop={15} />
      <Flex>
        <PlaceholderText width={100 + Math.random() * 100} />
        <PlaceholderText width={100 + Math.random() * 100} marginTop={15} />
        <Flex flexDirection="row" py="2">
          {times(3).map((index: number) => (
            <Flex key={index} marginRight="1">
              <PlaceholderBox height={120} width={120} />
              <PlaceholderText marginTop={20} key={index} width={40 + Math.random() * 80} />
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Flex>
        <PlaceholderText width={100 + Math.random() * 100} />
        {times(3).map((index: number) => (
          <Flex key={index} py="1">
            <PlaceholderText width={200 + Math.random() * 100} />
          </Flex>
        ))}
      </Flex>
    </Join>
  </Flex>
)

const SectionHeading: React.FC<{ title: string }> = ({ title }) => (
  <Sans size="3" color="black60" mb="1" mx="2">
    {title}
  </Sans>
)

export const MyProfileContainer = createRefetchContainer(
  MyProfile,
  {
    me: graphql`
      fragment MyProfile_me on Me {
        name
        labFeatures
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
    query MyProfileRefetchQuery {
      me {
        ...MyProfile_me
      }
    }
  `
)

export const MyProfileQueryRenderer: React.FC<{}> = ({}) => {
  return (
    <QueryRenderer<MyProfileQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyProfileQuery {
          me {
            ...MyProfile_me
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: MyProfileContainer,
        renderPlaceholder: () => <MyProfilePlaceholder />,
      })}
      variables={{}}
    />
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
      onPress: () => LegacyNativeModules.ARNotificationsManager.postNotificationName("ARUserRequestedLogout", {}),
    },
  ])
}

import { Flex, Join, Sans, Separator } from "@artsy/palette"
import { MyProfile_me } from "__generated__/MyProfile_me.graphql"
import { MyProfileQuery } from "__generated__/MyProfileQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { times } from "lodash"
import React, { useCallback, useRef, useState } from "react"
import { FlatList, NativeModules, RefreshControl, ScrollView } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { SmallTileRailContainer } from "../Home/Components/SmallTileRail"
import { MyProfileMenuItem } from "./Components/MyProfileMenuItem"
import { confirmLogout, SettingsOld } from "./SettingsOld"

const MyProfile: React.FC<{ me: MyProfile_me; relay: RelayRefetchProp }> = ({ me, relay }) => {
  const navRef = useRef(null)
  const listRef = useRef<FlatList<any>>()
  const recentlySavedArtworks = extractNodes(me.followsAndSaves?.artworksConnection)
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
      <Flex pt="3" ref={navRef}>
        <Join separator={<Separator my={2} />}>
          <Sans size="8" mx="2">
            {me.name}
          </Sans>
          <Flex>
            <SectionHeading title="Favorites" />
            <MyProfileMenuItem
              title="Saves and Follows"
              onPress={() => SwitchBoard.presentNavigationViewController(navRef.current!, "favorites")}
            />
            {!!recentlySavedArtworks.length && (
              <SmallTileRailContainer artworks={recentlySavedArtworks} listRef={listRef} contextModule={null as any} />
            )}
          </Flex>
          <Flex>
            <SectionHeading title="Account Settings" />
            <MyProfileMenuItem
              title="Account"
              onPress={() => SwitchBoard.presentNavigationViewController(navRef.current!, "my-account")}
            />
            <MyProfileMenuItem
              title="Payment"
              onPress={() => SwitchBoard.presentNavigationViewController(navRef.current!, "my-profile/payment")}
            />
            <MyProfileMenuItem
              title="Send Feedback"
              onPress={() => {
                SwitchBoard.presentEmailComposer(navRef.current!, "feedback@artsy.net", "Feedback from the Artsy app")
              }}
            />
            <MyProfileMenuItem
              title="Personal Data Request"
              onPress={() => SwitchBoard.presentNavigationViewController(navRef.current!, "privacy-request")}
            />
            <MyProfileMenuItem title="Log out" onPress={confirmLogout} endComponent={null} />
          </Flex>
        </Join>
      </Flex>
    </ScrollView>
  )
}

export const MyProfilePlaceholder: React.FC<{}> = () => (
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
  <Sans size="3" color="black60" mb="1" mx="2">
    {title}
  </Sans>
)

const MyProfileContainer = createRefetchContainer(
  MyProfile,
  {
    me: graphql`
      fragment MyProfile_me on Me {
        name
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
  return NativeModules.Emission.options.AROptionsEnableNewProfileTab ? (
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
  ) : (
    <SettingsOld />
  )
}

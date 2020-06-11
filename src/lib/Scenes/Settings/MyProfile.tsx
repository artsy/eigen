import { ChevronIcon, color, Flex, Join, Sans, Separator } from "@artsy/palette"
import { MyProfile_me } from "__generated__/MyProfile_me.graphql"
import { MyProfileQuery } from "__generated__/MyProfileQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React, { useCallback, useRef, useState } from "react"
import { FlatList, NativeModules, RefreshControl, ScrollView, TouchableHighlight } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { SmallTileRailContainer } from "../Home/Components/SmallTileRail"
import { confirmLogout, SettingsOld } from "./SettingsOld"

function extractNodes<Node extends object>(
  connection: { readonly edges?: ReadonlyArray<{ readonly node?: Node | null } | null> | null } | undefined | null
): Node[] {
  return connection?.edges?.map(edge => edge?.node!) ?? []
}

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
            <Row
              title="Saves and Follows"
              onPress={() => SwitchBoard.presentNavigationViewController(navRef.current!, "favorites")}
            />
            {!!recentlySavedArtworks.length && (
              <SmallTileRailContainer artworks={recentlySavedArtworks} listRef={listRef} contextModule={null as any} />
            )}
          </Flex>
          <Flex>
            <SectionHeading title="Account Settings" />
            <Row
              title="Account"
              onPress={() => SwitchBoard.presentNavigationViewController(navRef.current!, "my-account")}
            />
            <Row
              title="Send Feedback"
              onPress={() => {
                SwitchBoard.presentEmailComposer(navRef.current!, "feedback@artsy.net", "Feedback from the Artsy app")
              }}
            />
            <Row
              title="Personal Data Request"
              onPress={() => SwitchBoard.presentNavigationViewController(navRef.current!, "privacy-request")}
            />
            <Row title="Log out" onPress={confirmLogout} hideChevron />
          </Flex>
        </Join>
      </Flex>
    </ScrollView>
  )
}

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
        renderPlaceholder: () => <Sans size="3">placeholder</Sans>,
      })}
      variables={{}}
    />
  ) : (
    <SettingsOld />
  )
}

const Row: React.FC<{ title: string; onPress?: () => void; hideChevron?: boolean }> = ({
  title,
  onPress,
  hideChevron,
}) => (
  <TouchableHighlight onPress={onPress} underlayColor={color("black5")}>
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center" py="1" px="2">
      <Sans size="4">{title}</Sans>
      {!hideChevron && <ChevronIcon direction="right" fill="black60" />}
    </Flex>
  </TouchableHighlight>
)

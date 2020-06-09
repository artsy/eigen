import { ChevronIcon, color, Flex, Join, Sans, Separator } from "@artsy/palette"
import { MyProfile_homePage } from "__generated__/MyProfile_homePage.graphql"
import { MyProfile_me } from "__generated__/MyProfile_me.graphql"
import { MyProfileQuery } from "__generated__/MyProfileQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React, { useRef } from "react"
import { NativeModules, TouchableHighlight } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { confirmLogout, SettingsOld } from "./SettingsOld"

const MyProfile: React.FC<{ me: MyProfile_me; homePage: MyProfile_homePage }> = ({ me, homePage }) => {
  const navRef = useRef(null)
  return (
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
        </Flex>
        <Flex>
          <SectionHeading title="Account Settings" />
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
  )
}

const SectionHeading: React.FC<{ title: string }> = ({ title }) => (
  <Sans size="3" color="black60" mb="1" mx="2">
    {title}
  </Sans>
)

const MyProfileContainer = createFragmentContainer(MyProfile, {
  homePage: graphql`
    fragment MyProfile_homePage on HomePage {
      artworkModules(
        maxRails: 1
        order: [SAVED_WORKS]
        # LIVE_AUCTIONS and CURRENT_FAIRS both have their own modules, below.
        exclude: [
          ACTIVE_BIDS
          CURRENT_FAIRS
          FOLLOWED_ARTIST
          FOLLOWED_ARTISTS
          FOLLOWED_GALLERIES
          FOLLOWED_GENES
          GENERIC_GENES
          LIVE_AUCTIONS
          POPULAR_ARTISTS
          RECENTLY_VIEWED_WORKS
          RECOMMENDED_WORKS
          RELATED_ARTISTS
          SIMILAR_TO_RECENTLY_VIEWED
        ]
      ) {
        ...ArtworkRail_rail
      }
    }
  `,
  me: graphql`
    fragment MyProfile_me on Me {
      name
    }
  `,
})

export const MyProfileQueryRenderer: React.FC<{}> = ({}) => {
  return NativeModules.Emission.options.AROptionsEnableNewProfileTab ? (
    <QueryRenderer<MyProfileQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyProfileQuery {
          me {
            ...MyProfile_me
          }
          homePage {
            ...MyProfile_homePage
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
  <TouchableHighlight onPress={onPress} underlayColor={color("black10")}>
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center" py="1" px="2">
      <Sans size="4">{title}</Sans>
      {!hideChevron && <ChevronIcon direction="right" fill="black60" />}
    </Flex>
  </TouchableHighlight>
)

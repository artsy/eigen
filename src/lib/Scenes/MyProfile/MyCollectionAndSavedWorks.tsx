import React from "react"
import { ViewProps } from "react-native"

import { MyProfile_me } from "__generated__/MyProfile_me.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { navigate } from "lib/navigation/navigate"
import { Box, Sans, SettingsIcon as _SettingsIcon, useColor, useSpace } from "palette"
import { FavoriteArtworksQueryRenderer } from "../Favorites/FavoriteArtworks"
import { MyCollectionQueryRenderer } from "../MyCollection/MyCollection"

export enum Tab {
  collection = "My Collection",
  savedWorks = "Saved Works",
}

interface Props extends ViewProps {
  initialTab: Tab
  me: MyProfile_me
}

export const MyCollectionAndSavedWorks: React.FC<Props> = ({ initialTab = Tab.collection, me }) => {
  return (
    <StickyTabPage
      disableBackButtonUpdate
      tabs={[
        {
          title: Tab.collection,
          content: <MyCollectionQueryRenderer />,
          initial: initialTab === Tab.collection,
          superscript: "Beta",
        },
        {
          title: Tab.savedWorks,
          content: <FavoriteArtworksQueryRenderer />,
          initial: initialTab === Tab.savedWorks,
        },
      ]}
      staticHeaderContent={<MyProfileHeader name={me.name} createdAt={me.createdAt} />}
    />
  )
}

export const MyProfileHeader: React.FC<{ name: string | null; createdAt: string | null }> = ({ name, createdAt }) => {
  const space = useSpace()
  const color = useColor()
  return (
    <>
      <FancyModalHeader
        rightButtonText="Settings"
        hideBottomDivider
        onRightButtonPress={() => {
          navigate("/my-profile/settings")
        }}
      ></FancyModalHeader>
      <Box px={space(2)} pb={space(6)}>
        <Sans size="8" color={color("black100")}>
          {name}
        </Sans>
        {!!createdAt && (
          <Sans size="2" color={color("black60")}>{`Member since ${new Date(createdAt).getFullYear()}`}</Sans>
        )}
      </Box>
    </>
  )
}

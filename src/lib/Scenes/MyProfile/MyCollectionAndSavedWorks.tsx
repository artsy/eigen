import React from "react"
import { View, ViewProps } from "react-native"

import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { SettingsIcon as _SettingsIcon } from "palette"
import { FavoriteArtworksQueryRenderer } from "../Favorites/FavoriteArtworks"
import { MyCollectionQueryRenderer } from "../MyCollection/MyCollection"
import { MyProfileHeaderFragmentContainer } from "./MyProfileHeader"

export enum Tab {
  collections = "Collections",
  savedWorks = "Saved Works",
}

interface Props extends ViewProps {
  initialTab: Tab
}

export const MyCollectionAndSavedWorks: React.FC<Props> = ({ initialTab = Tab.collections }) => {
  return (
    <View style={{ flex: 1 }}>
      <StickyTabPage
        tabs={[
          {
            title: Tab.collections,
            content: <MyCollectionQueryRenderer />,
            initial: initialTab === Tab.collections,
          },
          {
            title: Tab.savedWorks,
            content: <FavoriteArtworksQueryRenderer />,
            initial: initialTab === Tab.savedWorks,
          },
        ]}
        staticHeaderContent={<MyProfileHeaderFragmentContainer />}
      />
    </View>
  )
}

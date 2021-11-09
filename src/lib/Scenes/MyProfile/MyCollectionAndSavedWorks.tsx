import AsyncStorage from "@react-native-community/async-storage"
import { MyCollectionAndSavedWorks_me } from "__generated__/MyCollectionAndSavedWorks_me.graphql"
import { MyCollectionAndSavedWorksQuery } from "__generated__/MyCollectionAndSavedWorksQuery.graphql"
import { Image } from "lib/Components/Bidding/Elements/Image"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { useFeatureFlag } from "lib/store/GlobalStore"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { DateTime } from "luxon"
import { Avatar, Box, Button, Flex, Sans, useColor } from "palette"
import React, { useEffect, useState } from "react"
import { createFragmentContainer, QueryRenderer } from "react-relay"
import { graphql } from "relay-runtime"
import { FavoriteArtworksQueryRenderer } from "../Favorites/FavoriteArtworks"
import { MyCollectionQueryRenderer } from "../MyCollection/MyCollection"
import { MyProfileEditFormModalFragmentContainer } from "./MyProfileEditFormModal"

export enum Tab {
  collection = "My Collection",
  savedWorks = "Saved Works",
}

export const MyCollectionAndSavedWorks: React.FC<{ me: NonNullable<MyCollectionAndSavedWorks_me> }> = ({ me }) => {
  return (
    <StickyTabPage
      disableBackButtonUpdate
      tabs={[
        {
          title: Tab.collection,
          content: <MyCollectionQueryRenderer />,
          initial: true,
        },
        {
          title: Tab.savedWorks,
          content: <FavoriteArtworksQueryRenderer />,
          initial: false,
        },
      ]}
      staticHeaderContent={<MyProfileHeader me={me} />}
    />
  )
}

export const LOCAL_PROFILE_ICON_PATH_KEY = "LOCAL_PROFILE_ICON_PATH_KEY"
export const LOCAL_PROFILE_ICON_EXPIRE_AT_KEY = "LOCAL_PROFILE_ICON_EXPIRE_AT_KEY"

export const MyProfileHeader: React.FC<{ me: NonNullable<MyCollectionAndSavedWorks_me> }> = ({ me }) => {
  const color = useColor()

  const [showModal, setShowModal] = useState(false)
  const [localImagePath, setLocalImagePath] = useState<string>("")

  const setProfileIconHandler = (profileIconPath: string) => {
    setLocalImagePath(profileIconPath)
    const dateToExpire = DateTime.fromISO(new Date().toISOString()).plus({ minutes: 2 }).toISO()
    AsyncStorage.multiSet([
      [LOCAL_PROFILE_ICON_PATH_KEY, profileIconPath],
      [LOCAL_PROFILE_ICON_EXPIRE_AT_KEY, dateToExpire],
    ])
  }

  useEffect(() => {
    AsyncStorage.multiGet([LOCAL_PROFILE_ICON_PATH_KEY, LOCAL_PROFILE_ICON_EXPIRE_AT_KEY]).then(
      ([localProfileImagePath, addedAt]) => {
        const now = DateTime.fromISO(new Date().toISOString()).toISO()
        const expired = addedAt[1] ? now > addedAt[1] : true
        if (!expired && localProfileImagePath[1]) {
          setLocalImagePath(localProfileImagePath[1])
        }
      }
    )
  }, [])

  const userProfileImage = localImagePath || me.icon?.url

  const showIconAndBio = useFeatureFlag("AREnableVisualProfileIconAndBio")

  return (
    <>
      <MyProfileEditFormModalFragmentContainer
        me={me}
        visible={showModal}
        onDismiss={() => setShowModal(false)}
        setProfileIconLocally={setProfileIconHandler}
      />
      <FancyModalHeader
        rightButtonText="Settings"
        hideBottomDivider
        onRightButtonPress={() => {
          navigate("/my-profile/settings")
        }}
      />
      <Flex flexDirection="row" alignItems="center" px={2}>
        {!!showIconAndBio && (
          <Box
            height="99"
            width="99"
            borderRadius="50"
            backgroundColor={color("black10")}
            justifyContent="center"
            alignItems="center"
          >
            {!!userProfileImage ? (
              <Avatar src={userProfileImage} size="md" />
            ) : (
              <Image source={require("../../../../images/profile_placeholder_avatar.webp")} />
            )}
          </Box>
        )}
        <Box px={2} flexShrink={1} pb={!showIconAndBio ? 6 : undefined}>
          <Sans size="10" color={color("black100")}>
            {me?.name}
          </Sans>
          {!!me?.createdAt && (
            <Sans size="2" color={color("black60")}>{`Member since ${new Date(me?.createdAt).getFullYear()}`}</Sans>
          )}
        </Box>
      </Flex>
      {!!me?.bio && showIconAndBio && (
        <Sans size="2" color={color("black100")} px={2} pt={2}>
          {me?.bio}
        </Sans>
      )}
      {showIconAndBio && (
        <Flex p={2}>
          <Button
            variant="outline"
            size="small"
            flex={1}
            onPress={() => {
              setShowModal(true)
            }}
          >
            Edit Profile
          </Button>
        </Flex>
      )}
    </>
  )
}

export const MyCollectionAndSavedWorksFragmentContainer = createFragmentContainer(MyCollectionAndSavedWorks, {
  me: graphql`
    fragment MyCollectionAndSavedWorks_me on Me {
      name
      bio
      icon {
        url(version: "thumbnail")
      }
      createdAt
      ...MyProfileEditFormModal_me
    }
  `,
})

export const MyCollectionAndSavedWorksQueryRenderer: React.FC<{}> = ({}) => (
  <QueryRenderer<MyCollectionAndSavedWorksQuery>
    environment={defaultEnvironment}
    query={graphql`
      query MyCollectionAndSavedWorksQuery {
        me @optionalField {
          ...MyCollectionAndSavedWorks_me
        }
      }
    `}
    render={renderWithLoadProgress(MyCollectionAndSavedWorksFragmentContainer)}
    variables={{}}
  />
)

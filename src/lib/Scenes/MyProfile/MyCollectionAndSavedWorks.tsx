import { MyCollectionAndSavedWorks_me } from "__generated__/MyCollectionAndSavedWorks_me.graphql"
import { MyCollectionAndSavedWorksQuery } from "__generated__/MyCollectionAndSavedWorksQuery.graphql"
import { Image } from "lib/Components/Bidding/Elements/Image"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Avatar, Box, Button, Flex, Join, Sans, Spacer, useColor, useSpace } from "palette"
import React, { useState } from "react"
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

export const MyProfileHeader: React.FC<{ me: NonNullable<MyCollectionAndSavedWorks_me> }> = ({ me }) => {
  const space = useSpace()
  const color = useColor()

  const [showModal, setShowModal] = useState(false)
  const [profileIcon, setProfileIcon] = useState<string>()

  const setProfileIconHandler = (profileIconPath: string) => {
    const profileIconUrl = me?.icon?.imageURL || profileIconPath
    setProfileIcon(profileIconUrl)
  }

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
      <Join separator={<Spacer py={space(1)} />}>
        <Flex flexDirection="row" alignItems="center" px={2}>
          <Box
            height="99"
            width="99"
            borderRadius="50"
            backgroundColor={color("black10")}
            justifyContent="center"
            alignItems="center"
          >
            {!!profileIcon ? (
              <Avatar src={profileIcon} size="md" />
            ) : (
              <Image source={require("../../../../images/profile_placeholder_avatar.webp")} />
            )}
          </Box>
          <Box px={2} flexShrink={1}>
            <Sans size="10" color={color("black100")}>
              {me?.name}
            </Sans>
            {!!me?.createdAt && (
              <Sans size="2" color={color("black60")}>{`Member since ${new Date(me?.createdAt).getFullYear()}`}</Sans>
            )}
          </Box>
        </Flex>
        <Sans size="2" color={color("black100")} px={2}>
          {me?.bio}
        </Sans>
        <Flex px={2} pb={2}>
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
      </Join>
    </>
  )
}

export const MyCollectionAndSavedWorksFragmentContainer = createFragmentContainer(MyCollectionAndSavedWorks, {
  me: graphql`
    fragment MyCollectionAndSavedWorks_me on Me {
      name
      bio
      icon {
        internalID
        imageURL
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

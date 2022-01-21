import { MyCollectionAndSavedWorks_me } from "__generated__/MyCollectionAndSavedWorks_me.graphql"
import { MyCollectionAndSavedWorksQuery } from "__generated__/MyCollectionAndSavedWorksQuery.graphql"
import { Image } from "lib/Components/Bidding/Elements/Image"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { LocalImage, retrieveLocalImages, storeLocalImages } from "lib/utils/LocalImageStore"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Avatar, Box, BriefcaseIcon, Button, Flex, Join, MapPinIcon, MuseumIcon, Sans, Spacer, useColor } from "palette"
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

export const MyCollectionAndSavedWorks: React.FC<{ me?: MyCollectionAndSavedWorks_me }> = ({
  me,
}) => {
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

export const MyProfileHeader: React.FC<{ me?: MyCollectionAndSavedWorks_me }> = ({ me }) => {
  const color = useColor()

  const [showModal, setShowModal] = useState(false)
  const [localImage, setLocalImage] = useState<LocalImage | null>(null)

  const setProfileIconHandler = (path: string) => {
    const profileIcon: LocalImage = {
      path,
      width: 100, // don't care about aspect ratio for profile images
      height: 100,
    }
    setLocalImage(profileIcon)
    storeLocalImages([profileIcon], LOCAL_PROFILE_ICON_PATH_KEY)
  }

  useEffect(() => {
    retrieveLocalImages(LOCAL_PROFILE_ICON_PATH_KEY).then((images) => {
      if (images && images.length > 0) {
        setLocalImage(images[0])
      }
    })
  }, [])

  const userProfileImagePath = localImage?.path || me?.icon?.url

  const showIconAndBio = useFeatureFlag("AREnableVisualProfileIconAndBio")

  const showCollectorProfile = useFeatureFlag("AREnableCollectorProfile")

  return (
    <>
      {!!me && (
        <MyProfileEditFormModalFragmentContainer
          me={me}
          visible={showModal}
          onDismiss={() => setShowModal(false)}
          setProfileIconLocally={setProfileIconHandler}
          localImage={localImage}
        />
      )}
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
            {!!userProfileImagePath ? (
              <Avatar src={userProfileImagePath} size="md" />
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
            <Sans size="2" color={color("black60")}>{`Member since ${new Date(
              me?.createdAt
            ).getFullYear()}`}</Sans>
          )}
        </Box>
      </Flex>

      {showCollectorProfile && (
        <Flex px={2} mt={2}>
          <Join separator={<Spacer my={0.5} />}>
            {!!me?.location?.display && (
              <Flex flexDirection="row" alignItems="flex-end">
                <MapPinIcon width={14} height={14} />
                <Sans size="2" color={color("black100")} px={0.5}>
                  {me.location.display}
                </Sans>
              </Flex>
            )}

            {!!me?.profession && (
              <Flex flexDirection="row" alignItems="flex-end">
                <BriefcaseIcon width={14} height={14} />
                <Sans size="2" color={color("black100")} px={0.5}>
                  {me.profession}
                </Sans>
              </Flex>
            )}

            {!!me?.otherRelevantPosition && (
              <Flex flexDirection="row" alignItems="flex-end">
                <MuseumIcon width={14} height={14} />
                <Sans size="2" color={color("black100")} px={0.5}>
                  {me?.otherRelevantPosition}
                </Sans>
              </Flex>
            )}
          </Join>
        </Flex>
      )}
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


export const MyCollectionAndSavedWorksFragmentContainer = createFragmentContainer(
  MyCollectionAndSavedWorks,
  {
    me: graphql`
      fragment MyCollectionAndSavedWorks_me on Me {
        name
        bio
        location {
          display
        }
        otherRelevantPosition
        profession
        icon {
          url(version: "thumbnail")
        }
        createdAt
        ...MyProfileEditFormModal_me
      }
    `,
  }
)

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

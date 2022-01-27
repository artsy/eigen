import { OwnerType } from "@artsy/cohesion"
import { MyCollectionAndSavedWorks_me } from "__generated__/MyCollectionAndSavedWorks_me.graphql"
import { MyCollectionAndSavedWorksQuery } from "__generated__/MyCollectionAndSavedWorksQuery.graphql"
import { Image } from "lib/Components/Bidding/Elements/Image"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { LocalImage, retrieveLocalImages, storeLocalImages } from "lib/utils/LocalImageStore"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "lib/utils/track"
import { screen } from "lib/utils/track/helpers"
import {
  Avatar,
  Box,
  BriefcaseIcon,
  Button,
  Flex,
  Join,
  MapPinIcon,
  MuseumIcon,
  Spacer,
  Text,
  useColor,
} from "palette"
import React, { useEffect, useState } from "react"
import { createRefetchContainer, QueryRenderer, RelayRefetchProp } from "react-relay"
import { graphql } from "relay-runtime"
import { FavoriteArtworksQueryRenderer } from "../Favorites/FavoriteArtworks"
import { MyCollectionPlaceholder, MyCollectionQueryRenderer } from "../MyCollection/MyCollection"
import { MyProfileEditFormModal } from "./MyProfileEditFormModal"

export enum Tab {
  collection = "My Collection",
  savedWorks = "Saved Works",
}

export const MyCollectionAndSavedWorks: React.FC<{
  me?: MyCollectionAndSavedWorks_me
  relay: RelayRefetchProp
}> = ({ me, relay }) => {
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
      staticHeaderContent={<MyProfileHeader me={me} relay={relay} />}
    />
  )
}

export const LOCAL_PROFILE_ICON_PATH_KEY = "LOCAL_PROFILE_ICON_PATH_KEY"

export const MyProfileHeader: React.FC<{
  me?: MyCollectionAndSavedWorks_me
  relay: RelayRefetchProp
}> = ({ me, relay }) => {
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

  const showCollectorProfile = useFeatureFlag("AREnableCollectorProfile")

  return (
    <>
      {!!me && (
        <MyProfileEditFormModal
          me={me}
          visible={showModal}
          onDismiss={() => setShowModal(false)}
          setProfileIconLocally={setProfileIconHandler}
          localImage={localImage}
          refetchProfileIdentification={() => {
            relay.refetch({}, null, null, { force: true })
          }}
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
        <Box px={2} flexShrink={1}>
          <Text variant="xl" color={color("black100")}>
            {me?.name}
          </Text>
          {!!me?.createdAt && (
            <Text variant="xs" color={color("black60")}>{`Member since ${new Date(
              me?.createdAt
            ).getFullYear()}`}</Text>
          )}
        </Box>
      </Flex>

      {showCollectorProfile && (
        <Flex px={2} mt={2}>
          <Join separator={<Spacer my={0.5} />}>
            {!!me?.location?.display && (
              <Flex flexDirection="row" alignItems="flex-end">
                <MapPinIcon width={14} height={14} />
                <Text variant="xs" color={color("black100")} px={0.5}>
                  {me.location.display}
                </Text>
              </Flex>
            )}

            {!!me?.profession && (
              <Flex flexDirection="row" alignItems="flex-end">
                <BriefcaseIcon width={14} height={14} />
                <Text variant="xs" color={color("black100")} px={0.5}>
                  {me.profession}
                </Text>
              </Flex>
            )}

            {!!me?.otherRelevantPositions && (
              <Flex flexDirection="row" alignItems="flex-end">
                <MuseumIcon width={14} height={14} />
                <Text variant="xs" color={color("black100")} px={0.5}>
                  {me?.otherRelevantPositions}
                </Text>
              </Flex>
            )}
          </Join>
        </Flex>
      )}
      {!!me?.bio && (
        <Text variant="xs" color={color("black100")} px={2} pt={2}>
          {me?.bio}
        </Text>
      )}
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
    </>
  )
}

export const MyCollectionAndSavedWorksFragmentContainer = createRefetchContainer(
  MyCollectionAndSavedWorks,
  {
    me: graphql`
      fragment MyCollectionAndSavedWorks_me on Me
      @argumentDefinitions(enableCollectorProfile: { type: "Boolean", defaultValue: false }) {
        name
        bio
        location {
          display
        }
        otherRelevantPositions
        profession
        icon {
          url(version: "thumbnail")
        }
        createdAt
        ...MyProfileEditFormModal_me @arguments(enableCollectorProfile: $enableCollectorProfile)
      }
    `,
  },
  graphql`
    query MyCollectionAndSavedWorksRefetchQuery($enableCollectorProfile: Boolean!) {
      me {
        ...MyProfileEditFormModal_me @arguments(enableCollectorProfile: $enableCollectorProfile)
      }
    }
  `
)

export const MyCollectionAndSavedWorksScreenQuery = graphql`
  query MyCollectionAndSavedWorksQuery {
    me @optionalField {
      ...MyCollectionAndSavedWorks_me
    }
  }
`

export const MyCollectionAndSavedWorksQueryRenderer: React.FC<{}> = ({}) => {
  const enableCollectorProfile = useFeatureFlag("AREnableCollectorProfile")

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.profile })}
    >
      <QueryRenderer<MyCollectionAndSavedWorksQuery>
        environment={defaultEnvironment}
        query={graphql`
          query MyCollectionAndSavedWorksQuery($enableCollectorProfile: Boolean!) {
            me @optionalField {
              ...MyCollectionAndSavedWorks_me
                @arguments(enableCollectorProfile: $enableCollectorProfile)
            }
          }
        `}
        render={renderWithPlaceholder({
          Container: MyCollectionAndSavedWorksFragmentContainer,
          renderPlaceholder: () => <MyCollectionPlaceholder />,
        })}
        variables={{
          enableCollectorProfile,
        }}
      />
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

import { OwnerType } from "@artsy/cohesion"
import { useNavigation } from "@react-navigation/native"
<<<<<<< HEAD:src/app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks.tsx
import { MyProfileHeaderMyCollectionAndSavedWorks_me } from "__generated__/MyProfileHeaderMyCollectionAndSavedWorks_me.graphql"
import { MyProfileHeaderMyCollectionAndSavedWorksQuery } from "__generated__/MyProfileHeaderMyCollectionAndSavedWorksQuery.graphql"
import { Image } from "app/Components/Bidding/Elements/Image"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { useFeatureFlag } from "app/store/GlobalStore"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
=======
import { CollectorProfileHeaderMyCollectionAndSavedWorks_me } from "__generated__/CollectorProfileHeaderMyCollectionAndSavedWorks_me.graphql"
import { CollectorProfileHeaderMyCollectionAndSavedWorksQuery } from "__generated__/CollectorProfileHeaderMyCollectionAndSavedWorksQuery.graphql"
import { Image } from "lib/Components/Bidding/Elements/Image"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "lib/utils/track"
import { screen } from "lib/utils/track/helpers"
>>>>>>> 7abc6c353 (Rename everywhere):src/app/Scenes/CollectorProfile/CollectorProfileHeaderMyCollectionAndSavedWorks.tsx
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
import React, { useContext } from "react"
import { createRefetchContainer, QueryRenderer } from "react-relay"
import { graphql } from "relay-runtime"
import { FavoriteArtworksQueryRenderer } from "../Favorites/FavoriteArtworks"
import { MyCollectionPlaceholder, MyCollectionQueryRenderer } from "../MyCollection/MyCollection"
import { CollectorProfileContext } from "./CollectorProfileProvider"
import { normalizeCollectorProfileBio } from "./utils"

const ICON_SIZE = 14

export enum Tab {
  collection = "My Collection",
  savedWorks = "Saved Works",
}

export const CollectorProfileHeaderMyCollectionAndSavedWorks: React.FC<{
  me: CollectorProfileHeaderMyCollectionAndSavedWorks_me
}> = ({ me }) => {
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
      staticHeaderContent={<CollectorProfileHeader me={me} />}
    />
  )
}

export const LOCAL_PROFILE_ICON_PATH_KEY = "LOCAL_PROFILE_ICON_PATH_KEY"

<<<<<<< HEAD:src/app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks.tsx
export const MyProfileHeader: React.FC<{ me: MyProfileHeaderMyCollectionAndSavedWorks_me }> = ({
  me,
}) => {
=======
export const CollectorProfileHeader: React.FC<{
  me: CollectorProfileHeaderMyCollectionAndSavedWorks_me
}> = ({ me }) => {
  const iconSize = ICON_SIZE * PixelRatio.getFontScale()
>>>>>>> 7abc6c353 (Rename everywhere):src/app/Scenes/CollectorProfile/CollectorProfileHeaderMyCollectionAndSavedWorks.tsx
  const color = useColor()
  const navigation = useNavigation()

  const showCollectorProfile = useFeatureFlag("AREnableCollectorProfile")

  const { localImage } = useContext(CollectorProfileContext)

  const userProfileImagePath = localImage || me?.icon?.url

  return (
    <>
      <FancyModalHeader
        rightButtonText="Settings"
        hideBottomDivider
        onRightButtonPress={() => {
          navigate("/collector-profile/settings")
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
              <Flex flexDirection="row" alignItems="center">
                <MapPinIcon width={ICON_SIZE} height={ICON_SIZE} />
                <Text variant="xs" color={color("black100")} px={0.5} pb="1px">
                  {me.location.display}
                </Text>
              </Flex>
            )}

            {!!me?.profession && (
              <Flex flexDirection="row" alignItems="center">
                <BriefcaseIcon width={ICON_SIZE} height={ICON_SIZE} />
                <Text variant="xs" color={color("black100")} px={0.5} pb="1px">
                  {me.profession}
                </Text>
              </Flex>
            )}

            {!!me?.otherRelevantPositions && (
              <Flex flexDirection="row" alignItems="center">
                <MuseumIcon width={ICON_SIZE} height={ICON_SIZE} />
                <Text variant="xs" color={color("black100")} px={0.5} pb="1px">
                  {me?.otherRelevantPositions}
                </Text>
              </Flex>
            )}
          </Join>
        </Flex>
      )}
      {!!me?.bio && (
        <Text variant="xs" color={color("black100")} px={2} pt={2}>
          {normalizeCollectorProfileBio(me?.bio)}
        </Text>
      )}
      <Flex p={2}>
        <Button
          variant="outline"
          size="small"
          flex={1}
          onPress={() => {
            navigation.navigate("CollectorProfileEditForm")
          }}
        >
          Edit Profile
        </Button>
      </Flex>
    </>
  )
}

export const CollectorProfileHeaderMyCollectionAndSavedWorksFragmentContainer =
  createRefetchContainer(
    CollectorProfileHeaderMyCollectionAndSavedWorks,
    {
      me: graphql`
        fragment CollectorProfileHeaderMyCollectionAndSavedWorks_me on Me {
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
        }
      `,
    },
    graphql`
      query CollectorProfileHeaderMyCollectionAndSavedWorksRefetchQuery {
        me {
          ...CollectorProfileHeaderMyCollectionAndSavedWorks_me
        }
      }
    `
  )

export const CollectorProfileHeaderMyCollectionAndSavedWorksScreenQuery = graphql`
  query CollectorProfileHeaderMyCollectionAndSavedWorksQuery {
    me @optionalField {
      ...CollectorProfileHeaderMyCollectionAndSavedWorks_me
    }
  }
`

export const CollectorProfileHeaderMyCollectionAndSavedWorksQueryRenderer: React.FC<{}> = ({}) => {
  const enableCollectorProfile = useFeatureFlag("AREnableCollectorProfile")

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.profile })}
    >
      <QueryRenderer<CollectorProfileHeaderMyCollectionAndSavedWorksQuery>
        environment={defaultEnvironment}
        query={CollectorProfileHeaderMyCollectionAndSavedWorksScreenQuery}
        render={renderWithPlaceholder({
          Container: CollectorProfileHeaderMyCollectionAndSavedWorksFragmentContainer,
          renderPlaceholder: () => <MyCollectionPlaceholder />,
        })}
        variables={{ enableCollectorProfile }}
      />
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

import { ActionType, ContextModule, OwnerType, TappedCompleteYourProfile } from "@artsy/cohesion"
import {
  BellIcon,
  Button,
  Flex,
  HeartIcon,
  Image,
  MapPinIcon,
  MultiplePersonsIcon,
  PersonIcon,
  SettingsIcon,
  ShieldFilledIcon,
  SimpleMessage,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Text,
  Touchable,
  useColor,
  useSpace,
  VerifiedPersonIcon,
} from "@artsy/palette-mobile"
import { MyProfileHeaderQuery } from "__generated__/MyProfileHeaderQuery.graphql"
import { MyProfileHeader_me$key } from "__generated__/MyProfileHeader_me.graphql"
import { navigate } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { TouchableOpacity } from "react-native"
import { fetchQuery, graphql, useFragment, useLazyLoadQuery } from "react-relay"
interface MyProfileHeaderProps {
  meProp: MyProfileHeader_me$key
}

export const MyProfileHeader: React.FC<MyProfileHeaderProps> = ({ meProp }) => {
  const me = useFragment<MyProfileHeader_me$key>(myProfileHeaderFragment, meProp)
  const enableFavoritesTab = useFeatureFlag("AREnableFavoritesTab")

  const space = useSpace()
  const color = useColor()

  if (!me) {
    return null
  }

  const isProfileComplete =
    !!me.location?.display && !!me.profession && !!me.icon?.url && !!me.isIdentityVerified

  return (
    <Flex justifyContent="center" alignItems="center" gap={0.5} py={1} px={2}>
      <Flex position="absolute" top={space(1)} right={space(2)}>
        <Touchable
          aria-label="Open settings"
          accessibilityRole="button"
          haptic
          hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
          onPress={() => navigate("/my-profile/settings")}
          style={{ height: "100%" }}
        >
          <SettingsIcon width={24} height={24} />
        </Touchable>
      </Flex>

      {/* Avatar */}
      <Flex height={70} width={70} borderRadius={35} backgroundColor={color("mono10")}>
        <TouchableOpacity
          onPress={() => {
            navigate("/my-profile/edit")
          }}
          testID="profile-image"
          style={{
            height: 70,
            width: 70,
            borderRadius: 35,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!!me?.icon?.url ? (
            <Flex overflow="hidden" borderRadius={35}>
              <Image src={me.icon.url} height={70} width={70} performResize={false} />
            </Flex>
          ) : (
            <PersonIcon width={24} height={24} />
          )}
        </TouchableOpacity>
      </Flex>

      {/* Information */}
      <Flex>
        <Flex flexDirection="row" justifyContent="center" alignItems="center" gap={0.5}>
          <Text variant="md" color={color("mono100")}>
            {me.name}
          </Text>

          {!!me.collectorProfile.confirmedBuyerAt && <VerifiedPersonIcon />}
          {!!me.isIdentityVerified && <ShieldFilledIcon />}
        </Flex>

        {!!me?.location?.display && (
          <Flex flexDirection="row" justifyContent="center" alignItems="center">
            <MapPinIcon />
            <Text variant="xs" ml={0.5}>
              {me.location.display}
            </Text>
          </Flex>
        )}

        {!isProfileComplete && (
          <>
            <Spacer y={2} />
            <Flex alignItems="center">
              <Button
                variant="outline"
                size="small"
                onPress={() => {
                  tracks.tappedCompleteMyProfile({ id: me.internalID })
                  navigate("/complete-my-profile", { passProps: { meKey: me } })
                }}
              >
                Complete My Profile
              </Button>
            </Flex>
          </>
        )}
      </Flex>

      {/* Activity */}

      {!enableFavoritesTab && (
        <>
          <Spacer y={1} />
          <Flex flexDirection="row" px={2} alignSelf="stretch" justifyContent="space-between">
            <Flex flex={1}>
              <Touchable onPress={() => navigate("favorites/saves")}>
                <Flex justifyContent="center" alignItems="center">
                  <Text variant="sm-display" weight="medium">
                    {me.counts.savedArtworks ?? "0"}
                  </Text>
                  <Flex flexDirection="row" alignItems="center" gap={0.5}>
                    <HeartIcon />
                    <Text variant="xs">Save{me.counts.savedArtworks !== 1 ? "s" : ""}</Text>
                  </Flex>
                </Flex>
              </Touchable>
            </Flex>

            <Flex flex={1}>
              <Touchable onPress={() => navigate("favorites")}>
                <Flex justifyContent="center" alignItems="center">
                  <Text variant="sm-display" weight="medium">
                    {me.counts.followedArtists ?? "0"}
                  </Text>
                  <Flex flexDirection="row" alignItems="center" gap={0.5}>
                    <MultiplePersonsIcon />
                    <Text variant="xs">Follow{me.counts.followedArtists !== 1 ? "s" : ""}</Text>
                  </Flex>
                </Flex>
              </Touchable>
            </Flex>

            <Flex flex={1}>
              <Touchable onPress={() => navigate("favorites/alerts")}>
                <Flex justifyContent="center" alignItems="center">
                  <Text variant="sm-display" weight="medium">
                    {me.counts.savedSearches ?? "0"}
                  </Text>
                  <Flex flexDirection="row" alignItems="center" gap={0.5}>
                    <BellIcon />
                    <Text variant="xs">Alert{me.counts.savedSearches !== 1 ? "s" : ""}</Text>
                  </Flex>
                </Flex>
              </Touchable>
            </Flex>
          </Flex>
        </>
      )}
    </Flex>
  )
}

const MyProfileHeaderPlaceholder: React.FC<{}> = () => {
  const enableFavoritesTab = useFeatureFlag("AREnableFavoritesTab")

  return (
    <Skeleton>
      <Flex justifyContent="center" alignItems="center" gap={0.5} py={1} px={2}>
        <SkeletonBox width={70} height={70} borderRadius={35}></SkeletonBox>

        <Flex>
          <SkeletonText>Collector Name</SkeletonText>

          <Spacer y={0.5} />

          <Flex flexDirection="row" justifyContent="center" alignItems="center">
            <SkeletonBox width={18} height={18} borderRadius={9} />
            <SkeletonText variant="xs" ml={0.5}>
              New York, NY
            </SkeletonText>
          </Flex>
        </Flex>

        <Spacer y={1} />

        <Flex flexDirection="row" justifyContent="center" alignItems="center">
          <SkeletonBox width={140} height={36} borderRadius={18} />
        </Flex>

        {!enableFavoritesTab && (
          <>
            <Spacer y={1} />
            <Flex flexDirection="row" px={2} alignSelf="stretch" justifyContent="space-between">
              <Flex flex={1}>
                <Flex justifyContent="center" alignItems="center" gap={0.5}>
                  <Flex>
                    <SkeletonText variant="sm-display">20</SkeletonText>
                  </Flex>
                  <Flex flexDirection="row" alignItems="center" gap={0.5}>
                    <SkeletonBox width={18} height={18} borderRadius={9} />
                    <SkeletonText variant="xs">Saves</SkeletonText>
                  </Flex>
                </Flex>
              </Flex>

              <Flex flex={1}>
                <Flex justifyContent="center" alignItems="center" gap={0.5}>
                  <Flex>
                    <SkeletonText variant="sm-display">20</SkeletonText>
                  </Flex>
                  <Flex flexDirection="row" alignItems="center" gap={0.5}>
                    <SkeletonBox width={18} height={18} borderRadius={9} />
                    <SkeletonText variant="xs">Saves</SkeletonText>
                  </Flex>
                </Flex>
              </Flex>

              <Flex flex={1}>
                <Flex justifyContent="center" alignItems="center" gap={0.5}>
                  <Flex>
                    <SkeletonText variant="sm-display">20</SkeletonText>
                  </Flex>
                  <Flex flexDirection="row" alignItems="center" gap={0.5}>
                    <SkeletonBox width={18} height={18} borderRadius={9} />
                    <SkeletonText variant="xs">Saves</SkeletonText>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </>
        )}
      </Flex>
    </Skeleton>
  )
}

const myProfileHeaderFragment = graphql`
  fragment MyProfileHeader_me on Me {
    ...useCompleteMyProfileSteps_me

    internalID
    name
    location {
      display
    }
    profession
    icon {
      url(version: "thumbnail")
    }
    isIdentityVerified
    counts @required(action: NONE) {
      followedArtists
      savedArtworks
      savedSearches
    }
    collectorProfile @required(action: NONE) {
      confirmedBuyerAt
    }
  }
`

export const MyProfileHeaderScreenQuery = graphql`
  query MyProfileHeaderQuery {
    me {
      ...MyProfileHeader_me
    }
  }
`

export const fetchProfileData = async () => {
  return fetchQuery<MyProfileHeaderQuery>(getRelayEnvironment(), MyProfileHeaderScreenQuery, {})
}

export const MyProfileHeaderQueryRenderer = withSuspense({
  Component: (props) => {
    const data = useLazyLoadQuery<MyProfileHeaderQuery>(
      MyProfileHeaderScreenQuery,
      {},
      {
        fetchPolicy: "store-and-network",
      }
    )

    if (!data.me) {
      return <SimpleMessage m={2}>Failed to load profile. Please check back later.</SimpleMessage>
    }

    return <MyProfileHeader meProp={data.me} {...props} />
  },
  LoadingFallback: MyProfileHeaderPlaceholder,
  ErrorFallback: () => {
    return <SimpleMessage m={2}>Failed to load profile. Please check back later.</SimpleMessage>
  },
})

const tracks = {
  tappedCompleteMyProfile: ({ id }: { id: string }): TappedCompleteYourProfile => ({
    action: ActionType.tappedCompleteYourProfile,
    context_module: ContextModule.collectorProfile,
    context_screen_owner_type: OwnerType.profile,
    context_screen_owner_id: id,
    user_id: id,
  }),
}

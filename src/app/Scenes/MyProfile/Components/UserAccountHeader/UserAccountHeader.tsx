import {
  BriefcaseIcon,
  InstitutionIcon,
  MapPinIcon,
  PersonIcon,
  ShieldIcon,
} from "@artsy/icons/native"
import {
  Button,
  Flex,
  Image,
  Join,
  SkeletonBox,
  Spacer,
  Text,
  useColor,
} from "@artsy/palette-mobile"
import {
  UserAccountHeaderQuery,
  UserAccountHeaderQuery$data,
} from "__generated__/UserAccountHeaderQuery.graphql"
import {
  UserAccountHeader_me$data,
  UserAccountHeader_me$key,
} from "__generated__/UserAccountHeader_me.graphql"
import { MyCollectionPreview } from "app/Scenes/MyProfile/Components/UserAccountHeader/MyCollectionPreview"
import { ProfileErrorMessage } from "app/Scenes/MyProfile/Components/UserAccountHeader/ProfileErrorMessage"
import { RouterLink } from "app/system/navigation/RouterLink"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

const PROFILE_IMAGE_SIZE = 70
interface UserAccountHeaderProps extends UserAccountHeaderQRProps {
  meProp: UserAccountHeaderQuery$data["me"]
}
export const UserAccountHeader: React.FC<UserAccountHeaderProps> = ({
  meProp,
  showBorder,
  showMyCollectionPreview,
  showCompleteProfile,
  tappable,
}) => {
  const me = useFragment<UserAccountHeader_me$key>(userAccountHeaderFragment, meProp)

  const color = useColor()

  if (!me) {
    return ProfileErrorMessage
  }

  const isProfileComplete =
    !!me.location?.display && !!me.profession && !!me.icon?.url && !!me.isIdentityVerified

  return (
    <RouterLink
      to="/my-collection"
      testID="account-card"
      disablePrefetch={!tappable}
      hasChildTouchable={!tappable}
    >
      <AccountCardWapper showBorder={showBorder} scrollEnabled={!tappable}>
        <Join separator={<Spacer y={2} />}>
          {/* Avatar */}
          <RouterLink to="/my-profile/edit">
            <Flex
              height={PROFILE_IMAGE_SIZE}
              width={PROFILE_IMAGE_SIZE}
              borderRadius={PROFILE_IMAGE_SIZE / 2}
              backgroundColor={color("mono5")}
              borderWidth={me?.icon?.url ? undefined : 1}
              borderColor={me?.icon?.url ? undefined : color("mono10")}
              alignItems="center"
              justifyContent="center"
            >
              {me?.icon?.url ? (
                <Flex overflow="hidden" borderRadius={PROFILE_IMAGE_SIZE / 2}>
                  <Image
                    src={me.icon.url}
                    height={PROFILE_IMAGE_SIZE}
                    width={PROFILE_IMAGE_SIZE}
                    performResize={false}
                    testID="profile-image"
                  />
                </Flex>
              ) : (
                <PersonIcon width={18} height={18} />
              )}
              {!!me.isIdentityVerified && (
                <Flex
                  width={22}
                  height={22}
                  borderRadius={11}
                  backgroundColor="blue100"
                  alignItems="center"
                  justifyContent="center"
                  position="absolute"
                  right={0}
                  bottom={0}
                  testID="identity-verified-icon"
                >
                  <ShieldIcon fill="mono0" />
                </Flex>
              )}
            </Flex>
          </RouterLink>

          <>
            {/* Name */}
            <Text variant="lg-display" color="mono100">
              {me.name}
            </Text>

            <Spacer y={1} />

            {/* Information */}
            <Flex flexDirection="row" flexWrap="wrap" justifyContent="center">
              <Join separator={<Spacer x={2} />}>
                {!!me?.location?.display && (
                  <Flex flexDirection="row" justifyContent="center" alignItems="center">
                    <MapPinIcon />
                    <Text variant="xs" ml={0.5}>
                      {me.location.display}
                    </Text>
                  </Flex>
                )}
                {!!me?.profession && (
                  <Flex flexDirection="row" justifyContent="center" alignItems="center">
                    <BriefcaseIcon />
                    <Text variant="xs" ml={0.5}>
                      {me.profession}
                    </Text>
                  </Flex>
                )}
                {!!me?.otherRelevantPositions && (
                  <Flex flexDirection="row" justifyContent="center" alignItems="center">
                    <InstitutionIcon />
                    <Text variant="xs" ml={0.5}>
                      {me.otherRelevantPositions}
                    </Text>
                  </Flex>
                )}
              </Join>
            </Flex>
          </>

          {!!showMyCollectionPreview && <MyCollectionPreview me={me} />}

          {!!showCompleteProfile && (
            <CompleteProfileButton me={me} isProfileComplete={isProfileComplete} />
          )}
        </Join>
      </AccountCardWapper>
    </RouterLink>
  )
}

const CompleteProfileButton: React.FC<{
  me: UserAccountHeader_me$data
  isProfileComplete: boolean
}> = ({ me, isProfileComplete }) => {
  if (isProfileComplete) {
    return (
      <RouterLink hasChildTouchable to="/my-collection">
        <Button
          variant="outline"
          size="small"
          haptic
          accessibilityLabel="View Full Profile"
          testID="view-full-profile-button"
        >
          View Full Profile
        </Button>
      </RouterLink>
    )
  }

  return (
    <RouterLink hasChildTouchable to="/complete-my-profile" navigationProps={{ meKey: me }}>
      <Button
        variant="outline"
        size="small"
        haptic
        accessibilityLabel="Complete Profile"
        testID="complete-profile-button"
      >
        Complete Profile
      </Button>
    </RouterLink>
  )
}

interface UserAccountHeaderQRProps {
  showBorder?: boolean
  showCompleteProfile?: boolean
  showMyCollectionPreview?: boolean
  tappable?: boolean
}

export const UserAccountHeaderQueryRenderer: React.FC<UserAccountHeaderQRProps> = withSuspense({
  Component: (props) => {
    const data = useLazyLoadQuery<UserAccountHeaderQuery>(
      UserAccountHeaderScreenQuery,
      {},
      {
        fetchPolicy: "store-and-network",
      }
    )

    if (!data.me) {
      return ProfileErrorMessage
    }

    return <UserAccountHeader meProp={data.me} {...props} />
  },
  LoadingFallback: (props) => <Placeholder showBorder={props.showBorder} />,
  ErrorFallback: () => {
    return ProfileErrorMessage
  },
})

export const UserAccountHeaderScreenQuery = graphql`
  query UserAccountHeaderQuery {
    me {
      ...UserAccountHeader_me
    }
  }
`

const userAccountHeaderFragment = graphql`
  fragment UserAccountHeader_me on Me {
    ...useCompleteMyProfileSteps_me
    ...MyCollectionPreview_me

    internalID
    name
    location {
      display
    }
    profession
    otherRelevantPositions
    icon {
      url(version: "thumbnail")
    }
    isIdentityVerified
    collectorProfile @required(action: NONE) {
      confirmedBuyerAt
    }
  }
`

const Placeholder: React.FC<{ showBorder?: boolean }> = ({ showBorder }) => {
  return (
    <AccountCardWapper showBorder={showBorder}>
      <SkeletonBox
        height={PROFILE_IMAGE_SIZE}
        width={PROFILE_IMAGE_SIZE}
        borderRadius={PROFILE_IMAGE_SIZE / 2}
        backgroundColor="mono5"
        alignItems="center"
        justifyContent="center"
      />

      <Spacer y={2} />

      <SkeletonBox height={24} width={160} />

      <Spacer y={2} />

      <SkeletonBox height={20} width={230} />
    </AccountCardWapper>
  )
}

const AccountCardWapper: React.FC<{
  showBorder?: boolean
  scrollEnabled?: boolean
}> = ({ children, showBorder, scrollEnabled }) => {
  return (
    <Flex
      minHeight={200}
      backgroundColor="mono0"
      borderRadius={20}
      borderColor={showBorder ? "mono10" : undefined}
      borderWidth={showBorder ? 1 : undefined}
      alignItems="center"
      justifyContent="center"
      p={2}
      m={showBorder ? 2 : undefined}
      pointerEvents={scrollEnabled ? "box-none" : undefined}
    >
      {children}
    </Flex>
  )
}

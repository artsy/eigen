import {
  MapPinIcon,
  PersonIcon,
  ShieldIcon,
  BriefcaseIcon,
  InstitutionIcon,
} from "@artsy/icons/native"
import { Flex, Text, Image, useColor, Join, Spacer, Button, Spinner } from "@artsy/palette-mobile"
import { UserAccountHeaderQuery } from "__generated__/UserAccountHeaderQuery.graphql"
import { UserAccountHeader_me$key } from "__generated__/UserAccountHeader_me.graphql"
import { MyCollectionPreview } from "app/Scenes/MyProfile/Components/UserAccountHeader/MyCollectionPreview"
import { ProfileErrorMessage } from "app/Scenes/MyProfile/Components/UserAccountHeader/ProfileErrorMessage"
import { RouterLink } from "app/system/navigation/RouterLink"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface UserAccountHeaderProps {
  meProps: UserAccountHeader_me$key
}
export const UserAccountHeader: React.FC<UserAccountHeaderProps> = ({ meProps }) => {
  const me = useFragment<UserAccountHeader_me$key>(userAccountHeaderFragment, meProps)

  const color = useColor()

  if (!me) {
    return ProfileErrorMessage
  }

  const isProfileComplete =
    !!me.location?.display && !!me.profession && !!me.icon?.url && !!me.isIdentityVerified

  return (
    <RouterLink to="/my-collection" testID="account-card">
      <AccountCardWapper>
        <Join separator={<Spacer y={2} />}>
          {/* Avatar */}
          <Flex
            height={70}
            width={70}
            borderRadius={35}
            backgroundColor={color("mono5")}
            borderWidth={me?.icon?.url ? undefined : 1}
            borderColor={me?.icon?.url ? undefined : color("mono10")}
            alignItems="center"
            justifyContent="center"
          >
            {me?.icon?.url ? (
              <Flex overflow="hidden" borderRadius={35}>
                <Image
                  src={me.icon.url}
                  height={70}
                  width={70}
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

          {/* Name */}
          <Text variant="lg-display" color={color("mono100")}>
            {me.name}
          </Text>

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

          <MyCollectionPreview me={me} />

          {isProfileComplete ? (
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
          ) : (
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
          )}
        </Join>
      </AccountCardWapper>
    </RouterLink>
  )
}

export const userAccountHeaderQueryVariables = { count: 4 }

export const UserAccountHeaderQueryRenderer = withSuspense({
  Component: (props) => {
    const data = useLazyLoadQuery<UserAccountHeaderQuery>(
      UserAccountHeaderScreenQuery,
      userAccountHeaderQueryVariables,
      {
        fetchPolicy: "store-and-network",
      }
    )

    if (!data.me) {
      return ProfileErrorMessage
    }

    return <UserAccountHeader meProps={data.me} {...props} />
  },
  LoadingFallback: () => <Placeholder />,
  ErrorFallback: () => {
    return ProfileErrorMessage
  },
})

export const UserAccountHeaderScreenQuery = graphql`
  query UserAccountHeaderQuery($count: Int!) {
    me {
      ...UserAccountHeader_me @arguments(count: $count)
      ...MyCollectionPreview_me @arguments(count: $count)
    }
  }
`

const userAccountHeaderFragment = graphql`
  fragment UserAccountHeader_me on Me @argumentDefinitions(count: { type: "Int" }) {
    ...useCompleteMyProfileSteps_me
    ...MyCollectionPreview_me @arguments(count: $count)

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

const Placeholder: React.FC = () => {
  return (
    <AccountCardWapper>
      <Spinner />
    </AccountCardWapper>
  )
}

const AccountCardWapper: React.FC = ({ children }) => {
  return (
    <Flex
      minHeight={200}
      backgroundColor="mono0"
      borderRadius={20}
      borderColor="mono10"
      borderWidth={1}
      alignItems="center"
      justifyContent="center"
      p={2}
      m={2}
    >
      {children}
    </Flex>
  )
}

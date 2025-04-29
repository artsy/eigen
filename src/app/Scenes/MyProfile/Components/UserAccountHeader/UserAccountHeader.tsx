import {
  MapPinIcon,
  PersonIcon,
  ShieldIcon,
  BriefcaseIcon,
  InstitutionIcon,
} from "@artsy/icons/native"
import {
  Flex,
  Text,
  Touchable,
  useScreenDimensions,
  useSpace,
  Image,
  useColor,
  Join,
  Spacer,
  Button,
  Spinner,
} from "@artsy/palette-mobile"
import { UserAccountHeaderQuery } from "__generated__/UserAccountHeaderQuery.graphql"
import { UserAccountHeader_me$key } from "__generated__/UserAccountHeader_me.graphql"
import { ErrorMessageComponent } from "app/Scenes/MyProfile/Components/UserAccountHeader/ErrorMessageComponent"
import { MyCollectionPreview } from "app/Scenes/MyProfile/Components/UserAccountHeader/MyCollectionPreview"
import { navigate } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface UserAccountHeaderProps {
  meProps: UserAccountHeader_me$key
}
export const UserAccountHeader: React.FC<UserAccountHeaderProps> = ({ meProps }) => {
  const me = useFragment<UserAccountHeader_me$key>(userAccountHeaderFragment, meProps)

  const { width } = useScreenDimensions()
  const space = useSpace()
  const color = useColor()
  const WIDTH = width - 2 * space(2)

  if (!me) {
    return ErrorMessageComponent
  }

  const isProfileComplete =
    !!me.location?.display && !!me.profession && !!me.icon?.url && !!me.isIdentityVerified

  return (
    <Flex justifyContent="center" alignItems="center" mt={2}>
      <Touchable testID="account-card" onPress={() => navigate("my-collection")}>
        <Flex
          minHeight={200}
          width={WIDTH}
          backgroundColor="mono0"
          borderRadius={20}
          borderColor="mono10"
          borderWidth={1}
          alignItems="center"
          p={2}
        >
          <Join separator={<Spacer y={2} />}>
            {/* Avatar */}
            <Flex
              height={70}
              width={70}
              borderRadius={35}
              backgroundColor={color("mono10")}
              borderWidth={me?.icon?.url ? undefined : 1}
              borderColor={me?.icon?.url ? undefined : color("mono30")}
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

            {!isProfileComplete && (
              <Flex alignItems="center">
                <Button
                  variant="outline"
                  size="small"
                  onPress={() => {
                    navigate("/complete-my-profile", { passProps: { meKey: me } })
                  }}
                  testID="complete-profile-button"
                >
                  Complete Profile
                </Button>
              </Flex>
            )}
          </Join>
        </Flex>
      </Touchable>
    </Flex>
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
      return ErrorMessageComponent
    }

    return <UserAccountHeader meProps={data.me} {...props} />
  },
  LoadingFallback: () => <Placeholder />,
  ErrorFallback: () => {
    return ErrorMessageComponent
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
  const { width } = useScreenDimensions()

  const space = useSpace()
  const WIDTH = width - 2 * space(2)

  return (
    <Flex justifyContent="center" alignItems="center" mt={2}>
      <Flex
        minHeight={200}
        width={WIDTH}
        backgroundColor="mono0"
        borderRadius={20}
        borderColor="mono10"
        borderWidth={1}
        alignItems="center"
        justifyContent="center"
        p={2}
      >
        <Spinner />
      </Flex>
    </Flex>
  )
}

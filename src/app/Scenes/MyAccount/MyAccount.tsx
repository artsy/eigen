import { OwnerType } from "@artsy/cohesion"
import { AppleIcon } from "@artsy/icons/native"
import { Flex, LinkText, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { MyAccountQuery } from "__generated__/MyAccountQuery.graphql"
import { MyAccount_me$key } from "__generated__/MyAccount_me.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { MenuItem } from "app/Components/MenuItem"
import { SectionTitle } from "app/Components/SectionTitle"
import { MyProfileScreenWrapper } from "app/Scenes/MyProfile/Components/MyProfileScreenWrapper"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useAppleLink } from "app/utils/LinkedAccounts/apple"
import { useFacebookLink } from "app/utils/LinkedAccounts/facebook"
import { useGoogleLink } from "app/utils/LinkedAccounts/google"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { ActivityIndicator, Image, Platform } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

const MenuItemSocialItem = ({
  disabled,
  icon,
  isLinked,
  isLoading,
  onPress,
  title,
}: {
  disabled: boolean
  icon: React.ReactNode
  isLinked: boolean
  isLoading: boolean
  onPress: () => void
  title: string
}) => {
  return (
    <MenuItem
      title={title}
      disabled={disabled}
      allowDisabledVisualClue
      icon={icon}
      rightView={
        isLoading ? (
          <ActivityIndicator size="small" color="mono100" />
        ) : (
          <Flex flexDirection="row" alignItems="center">
            <Text variant="sm-display" color="mono60" lineHeight="18px">
              {isLinked ? "Linked" : "Link"}
            </Text>
          </Flex>
        )
      }
      onPress={isLoading || disabled ? () => null : onPress}
    />
  )
}

export const MyAccount: React.FC<{ me: MyAccount_me$key }> = (props) => {
  const me = useFragment(meFragment, props.me)

  const space = useSpace()

  const hasOnlyOneAuth = me.authentications.length + (me.hasPassword ? 1 : 0) < 2

  const onlyExistingAuthFor = (provider: "FACEBOOK" | "GOOGLE" | "APPLE") => {
    return (
      hasOnlyOneAuth && me.authentications.length > 0 && me.authentications[0].provider === provider
    )
  }

  const showLinkApple = Platform.OS === "ios"

  const showLinkedAccounts = !me.secondFactors?.length

  const { link: linkFB, unlink: unlinkFB, isLoading: fbLoading } = useFacebookLink()
  const { link: linkGoogle, unlink: unlinkGoogle, isLoading: googleLoading } = useGoogleLink()
  const { link: linkApple, unlink: unlinkApple, isLoading: appleLoading } = useAppleLink()

  const providers = me.authentications.map((a) => a.provider)
  const facebookLinked = providers.includes("FACEBOOK")
  const googleLinked = providers.includes("GOOGLE")
  const appleLinked = providers.includes("APPLE")

  const linkOrUnlink = (provider: "facebook" | "google" | "apple") => {
    switch (provider) {
      case "apple":
        return appleLinked ? unlinkApple() : linkApple()
      case "facebook":
        return facebookLinked ? unlinkFB() : linkFB()
      case "google":
        return googleLinked ? unlinkGoogle() : linkGoogle()
      default:
        return
    }
  }

  const loading = fbLoading || googleLoading || appleLoading

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.accountLoginAndSecurity,
      })}
    >
      <MyProfileScreenWrapper
        title="Login & Security"
        contentContainerStyle={{
          paddingTop: space(2),
          paddingHorizontal: 0,
        }}
      >
        <MenuItem
          title="Email"
          value={me.email}
          ellipsizeMode="middle"
          href="my-account/edit-email"
        />

        {!!me.hasPassword && (
          <MenuItem title="Password" value="Change password" href="my-account/edit-password" />
        )}

        <MenuItem title="Phone" value={me.phone || "Add phone"} href="my-account/edit-phone" />

        {!!me.paddleNumber && <MenuItem title="Paddle Number" value={me.paddleNumber} />}

        {!!showLinkedAccounts && (
          <Flex mt={4}>
            <SectionTitle title="Linked Accounts" variant="small" titleColor="mono60" mx={2} />

            <MenuItemSocialItem
              title="Facebook"
              disabled={loading || onlyExistingAuthFor("FACEBOOK")}
              isLinked={facebookLinked}
              isLoading={fbLoading}
              icon={
                <Image
                  source={require("images/facebook.webp")}
                  resizeMode="contain"
                  style={{ marginRight: 10 }}
                />
              }
              onPress={() => {
                linkOrUnlink("facebook")
              }}
            />

            <MenuItemSocialItem
              title="Google"
              disabled={loading || onlyExistingAuthFor("GOOGLE")}
              icon={
                <Image
                  source={require("images/google.webp")}
                  resizeMode="contain"
                  style={{ marginRight: 10 }}
                />
              }
              isLinked={googleLinked}
              isLoading={googleLoading}
              onPress={() => {
                linkOrUnlink("google")
              }}
            />

            {!!showLinkApple && (
              <MenuItemSocialItem
                title="Apple"
                disabled={loading || onlyExistingAuthFor("APPLE")}
                isLinked={appleLinked}
                isLoading={appleLoading}
                onPress={() => {
                  linkOrUnlink("apple")
                }}
                icon={<AppleIcon mr={1} fill="mono100" />}
              />
            )}
          </Flex>
        )}

        <Spacer y={2} />

        <Flex mx={2} mt={2}>
          <RouterLink to="my-account/delete-account" hasChildTouchable>
            <LinkText color="mono60" variant="xs">
              Delete My Account
            </LinkText>
          </RouterLink>
        </Flex>
      </MyProfileScreenWrapper>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const MyAccountPlaceholder: React.FC = () => {
  return (
    <MyProfileScreenWrapper
      title="Login & Security"
      contentContainerStyle={{ paddingHorizontal: 0 }}
    >
      <MenuItem title="Email" ellipsizeMode="middle" href="my-account/edit-email" />
      <MenuItem title="Password" ellipsizeMode="middle" href="my-account/edit-email" />
      <MenuItem title="Phone" ellipsizeMode="middle" href="my-account/edit-email" />

      <Flex mt={4}>
        <SectionTitle title="Linked Accounts" variant="small" titleColor="mono60" mx={2} />

        <MenuItemSocialItem
          title="Facebook"
          disabled
          isLinked={false}
          isLoading
          icon={
            <Image
              source={require("images/facebook.webp")}
              resizeMode="contain"
              style={{ marginRight: 10 }}
            />
          }
          onPress={() => {}}
        />

        <MenuItemSocialItem
          title="Google"
          disabled
          icon={
            <Image
              source={require("images/google.webp")}
              resizeMode="contain"
              style={{ marginRight: 10 }}
            />
          }
          isLinked={false}
          isLoading
          onPress={() => {}}
        />

        {Platform.OS === "ios" && (
          <MenuItemSocialItem
            title="Apple"
            disabled
            isLinked={false}
            isLoading
            onPress={() => {}}
            icon={<AppleIcon mr={1} fill="mono100" />}
          />
        )}
      </Flex>
    </MyProfileScreenWrapper>
  )
}

const meFragment = graphql`
  fragment MyAccount_me on Me {
    email
    phone
    paddleNumber
    hasPassword
    priceRange
    priceRangeMax
    priceRangeMin
    authentications {
      provider
    }
    secondFactors(kinds: [sms, app, backup]) {
      kind
    }
  }
`

export const MyAccountScreenQuery = graphql`
  query MyAccountQuery {
    me {
      ...MyAccount_me
    }
  }
`

export const MyAccountQueryRenderer: React.FC<{}> = withSuspense({
  Component: ({}) => {
    const data = useLazyLoadQuery<MyAccountQuery>(MyAccountScreenQuery, {})

    if (!data?.me) {
      return null
    }

    return <MyAccount me={data?.me} />
  },
  LoadingFallback: MyAccountPlaceholder,
  ErrorFallback: (fallbackProps) => {
    return (
      <LoadFailureView
        onRetry={fallbackProps.resetErrorBoundary}
        useSafeArea={false}
        error={fallbackProps.error}
        trackErrorBoundary={false}
      />
    )
  },
})

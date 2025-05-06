import { Button, Flex, LinkText, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { MyAccountQuery } from "__generated__/MyAccountQuery.graphql"
import { MyAccount_me$key } from "__generated__/MyAccount_me.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { MenuItem } from "app/Components/MenuItem"
import { SectionTitle } from "app/Components/SectionTitle"
import {
  MyProfileScreenWrapper,
  MyProfileScreenWrapperProps,
} from "app/Scenes/MyProfile/Components/MyProfileScreenWrapper"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useAppleLink } from "app/utils/LinkedAccounts/apple"
import { useFacebookLink } from "app/utils/LinkedAccounts/facebook"
import { useGoogleLink } from "app/utils/LinkedAccounts/google"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { PlaceholderText } from "app/utils/placeholders"
import { times } from "lodash"
import { ActivityIndicator, Image, Platform, ScrollView } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { PRICE_BUCKETS } from "./MyAccountEditPriceRange"

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
  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")

  return (
    <MenuItem
      title={title}
      disabled={disabled}
      allowDisabledVisualClue
      icon={enableRedesignedSettings ? icon : undefined}
      rightView={
        isLoading ? (
          <ActivityIndicator size="small" color="mono100" />
        ) : (
          <Flex flexDirection="row" alignItems="center">
            {!enableRedesignedSettings && icon}
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

  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")
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

  const priceRangeValue = me.priceRange
    ? PRICE_BUCKETS.find((i) => me.priceRange === i.value)?.label ?? "Select a price range"
    : "Select a price range"

  const Wrapper = enableRedesignedSettings
    ? (props: Omit<MyProfileScreenWrapperProps, "title">) => (
        <MyProfileScreenWrapper title="Login & Security" {...props} />
      )
    : ScrollView

  return (
    <Wrapper
      contentContainerStyle={{
        paddingTop: enableRedesignedSettings ? space(2) : space(1),
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

      {!enableRedesignedSettings && (
        <MenuItem title="Price Range" value={priceRangeValue} href="my-account/edit-price-range" />
      )}

      {!!me.paddleNumber && <MenuItem title="Paddle Number" value={me.paddleNumber} />}

      {!!showLinkedAccounts && (
        <Flex mt={4}>
          <SectionTitle
            title="Linked Accounts"
            titleVariant={enableRedesignedSettings ? "xs" : "sm-display"}
            titleColor={enableRedesignedSettings ? "mono60" : "mono100"}
            mx={2}
          />

          <MenuItemSocialItem
            title="Facebook"
            disabled={loading || onlyExistingAuthFor("FACEBOOK")}
            isLinked={facebookLinked}
            isLoading={fbLoading}
            icon={
              <Image
                source={require(`images/facebook.webp`)}
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
                source={require(`images/google.webp`)}
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
              icon={
                <Image
                  source={require(`images/apple.webp`)}
                  resizeMode="contain"
                  style={{ marginRight: 10, tintColor: "black" }}
                />
              }
            />
          )}
        </Flex>
      )}

      <Spacer y={2} />

      {enableRedesignedSettings ? (
        <Flex mx={2} mt={2}>
          <RouterLink to="my-account/delete-account" hasChildTouchable>
            <LinkText color="mono60" variant="xs">
              Delete My Account
            </LinkText>
          </RouterLink>
        </Flex>
      ) : (
        <RouterLink to="my-account/delete-account" hasChildTouchable>
          <Button variant="text" block>
            <Text color="red100">Delete My Account</Text>
          </Button>
        </RouterLink>
      )}
    </Wrapper>
  )
}

const MyAccountPlaceholder: React.FC = () => {
  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")

  if (enableRedesignedSettings) {
    return (
      <MyProfileScreenWrapper
        title="Login & Security"
        contentContainerStyle={{ paddingHorizontal: 0 }}
      >
        <MenuItem title="Email" ellipsizeMode="middle" href="my-account/edit-email" />
        <MenuItem title="Password" ellipsizeMode="middle" href="my-account/edit-email" />
        <MenuItem title="Phone" ellipsizeMode="middle" href="my-account/edit-email" />

        <Flex mt={4}>
          <SectionTitle
            title="Linked Accounts"
            titleVariant={enableRedesignedSettings ? "xs" : "sm-display"}
            titleColor={enableRedesignedSettings ? "mono60" : "mono100"}
            mx={2}
          />

          <MenuItemSocialItem
            title="Facebook"
            disabled
            isLinked={false}
            isLoading
            icon={
              <Image
                source={require(`images/facebook.webp`)}
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
                source={require(`images/google.webp`)}
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
              icon={
                <Image
                  source={require(`images/apple.webp`)}
                  resizeMode="contain"
                  style={{ marginRight: 10, tintColor: "black" }}
                />
              }
            />
          )}
        </Flex>
      </MyProfileScreenWrapper>
    )
  }

  return (
    <Flex px={2} py={1}>
      {times(5).map((index: number) => (
        <Flex key={index} py="7.5px">
          <PlaceholderText width={100 + Math.random() * 100} />
        </Flex>
      ))}
    </Flex>
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

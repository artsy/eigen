import { VanityURLEntity_fairOrPartner } from "__generated__/VanityURLEntity_fairOrPartner.graphql"
import { VanityURLEntityQuery } from "__generated__/VanityURLEntityQuery.graphql"
import { HeaderTabsGridPlaceholder } from "lib/Components/HeaderTabGridPlaceholder"
import InternalWebView from "lib/Components/InternalWebView"
import { Stack } from "lib/Components/Stack"
import { goBack, navigate } from "lib/navigation/navigate"
import { matchRoute } from "lib/navigation/routes"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { AppStore, useEmissionOption } from "lib/store/AppStore"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Button, Flex, Spinner } from "palette"
import { Text } from "palette"
import React, { useEffect, useState } from "react"
import { Linking, View } from "react-native"
import WebView from "react-native-webview"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { FairContainer, FairPlaceholder, FairQueryRenderer } from "../Fair/Fair"
import { PartnerContainer } from "../Partner"

interface EntityProps {
  originalSlug: string
  fairOrPartner: VanityURLEntity_fairOrPartner
}

const VanityURLEntity: React.FC<EntityProps> = ({ fairOrPartner, originalSlug }) => {
  if (fairOrPartner.__typename === "Fair") {
    return <FairContainer fair={fairOrPartner} />
  } else if (fairOrPartner.__typename === "Partner") {
    const { safeAreaInsets } = useScreenDimensions()
    return (
      <View style={{ flex: 1, top: safeAreaInsets.top ?? 0 }}>
        <PartnerContainer partner={fairOrPartner} />
      </View>
    )
  } else {
    return <PossibleRedirect slug={originalSlug} />
  }
}

const VanityURLEntityFragmentContainer = createFragmentContainer(VanityURLEntity, {
  fairOrPartner: graphql`
    fragment VanityURLEntity_fairOrPartner on VanityURLEntityType {
      __typename
      ... on Fair {
        ...Fair_fair
      }
      ... on Partner {
        ...Partner_partner
      }
    }
  `,
})

interface RendererProps {
  entity: "fair" | "partner" | "unknown"
  slugType?: "profileID" | "fairID"
  slug: string
}

export const VanityURLEntityRenderer: React.FC<RendererProps> = ({ entity, slugType, slug }) => {
  if (slugType === "fairID") {
    return <FairQueryRenderer fairID={slug} />
  } else {
    const { safeAreaInsets } = useScreenDimensions()
    return (
      <QueryRenderer<VanityURLEntityQuery>
        environment={defaultEnvironment}
        query={graphql`
          query VanityURLEntityQuery($id: String!) {
            vanityURLEntity(id: $id) {
              ...VanityURLEntity_fairOrPartner
            }
          }
        `}
        variables={{ id: slug }}
        render={renderWithPlaceholder({
          renderPlaceholder: () => {
            switch (entity) {
              case "fair":
                return <FairPlaceholder />
              case "partner":
                return (
                  <View style={{ flex: 1, top: safeAreaInsets.top ?? 0 }}>
                    <HeaderTabsGridPlaceholder />
                  </View>
                )
              default:
                return (
                  <Flex style={{ flex: 1 }} flexDirection="row" alignItems="center" justifyContent="center">
                    <Spinner />
                  </Flex>
                )
            }
          },
          render: (props: any) => {
            if (props.vanityURLEntity) {
              return <VanityURLEntityFragmentContainer fairOrPartner={props.vanityURLEntity} originalSlug={slug} />
            } else {
              return <PossibleRedirect slug={slug} />
            }
          },
        })}
      />
    )
  }
}

function join(...parts: string[]) {
  return parts.map((s) => s.replace(/(^\/+|\/+$)/g, "")).join("/")
}

const PossibleRedirect: React.FC<{ slug: string }> = ({ slug }) => {
  const [result, setResult] = useState<null | { webURL: string } | { error: true }>()
  const { authenticationToken, webURL } = AppStore.useAppState((store) => store.native.sessionState)
  const useReactNativeWebView = useEmissionOption("AROptionsUseReactNativeWebView")

  useEffect(() => {
    fetch(join(webURL, slug), { method: "HEAD", headers: { "X-Access-Token": authenticationToken } }).then(
      (response) => {
        if (response.ok) {
          const screen = matchRoute(response.url)
          if (screen.type === "external_url" || screen.module === "WebView") {
            // Test this with `artsy:///artsy-vanguard-2019` which force should redirect to /series/artsy-vanguard-2019
            console.log("Redirecting to web URL", response.url)
            setResult({ webURL: response.url })
          } else if (screen.module === "VanityURLEntity" && slug === response.url.split("/").pop()) {
            // No redirect, just show the web version of this page
            // Test this with `artsy:///identity-verification-faq`
            console.log("Showing web URL", response.url)
            setResult({ webURL: response.url })
          } else {
            // Test this with `artsy:///auction` which force should redirect to /auctions
            console.log("Replacing vanityURL view with", response.url)
            // TODO: this (extremely rare) case is quite bad UX, let's fix it at some point
            goBack()
            setTimeout(() => {
              navigate(response.url)
            }, 10)
          }
        } else {
          // Test this with any junk, e.g. `artsy:///asdfasdfasdf`
          setResult({ error: true })
        }
      }
    )
  }, [])

  if (!result) {
    return (
      <Flex style={{ flex: 1 }} flexDirection="row" alignItems="center" justifyContent="center">
        <Spinner />
      </Flex>
    )
  }

  if ("error" in result) {
    return (
      <Stack style={{ flex: 1 }} mx={2} alignItems="center" justifyContent="center">
        <Text variant="largeTitle">404</Text>
        <Text variant="text" textAlign="center">
          We can't find that page.
        </Text>

        <Button
          variant="secondaryOutline"
          onPress={() => {
            Linking.openURL(join(webURL, slug))
          }}
        >
          Open in browser
        </Button>
      </Stack>
    )
  }
  if (useReactNativeWebView) {
    return <WebView source={{ uri: result.webURL }} />
  } else {
    return <InternalWebView route={slug} />
  }
}

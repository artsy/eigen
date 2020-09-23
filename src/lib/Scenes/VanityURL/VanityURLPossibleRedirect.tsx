import InternalWebView from "lib/Components/InternalWebView"
import { Stack } from "lib/Components/Stack"
import { goBack, navigate } from "lib/navigation/navigate"
import { matchRoute } from "lib/navigation/routes"
import { AppStore, useEmissionOption } from "lib/store/AppStore"
import { Button, Flex, Spinner, Text } from "palette"
import React, { useEffect, useState } from "react"
import { Linking } from "react-native"
import WebView from "react-native-webview"

function join(...parts: string[]) {
  return parts.map((s) => s.replace(/(^\/+|\/+$)/g, "")).join("/")
}

export const VanityURLPossibleRedirect: React.FC<{ slug: string }> = ({ slug }) => {
  const [state, setState] = useState<null | RedirectResult>()
  const { authenticationToken, webURL } = AppStore.useAppState((store) => store.native.sessionState)
  const useReactNativeWebView = useEmissionOption("AROptionsUseReactNativeWebView")

  useEffect(() => {
    evaluateRedirect({ webURL, authenticationToken, slug }).then((result) => {
      switch (result.type) {
        case "error":
        case "show_internal_web_view":
          setState(result)
          break
        case "open_external_link":
        case "show_native_view":
          // TODO: implement `replace` mode of navigation
          goBack()
          navigate(result.url)
          break
        default:
          assertNever(result)
      }
    })
  }, [])

  if (!state) {
    return (
      <Flex style={{ flex: 1 }} flexDirection="row" alignItems="center" justifyContent="center">
        <Spinner />
      </Flex>
    )
  }

  if (state.type === "error") {
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
    return <WebView source={{ uri: state.url }} />
  } else {
    return <InternalWebView route={state.url} />
  }
}

type RedirectResult =
  | {
      type: "error"
    }
  | {
      type: "open_external_link"
      url: string
    }
  | {
      type: "show_internal_web_view"
      url: string
    }
  | {
      type: "show_native_view"
      url: string
    }

const evaluateRedirect = async ({
  slug,
  authenticationToken,
  webURL,
}: {
  slug: string
  authenticationToken: string
  webURL: string
}): Promise<RedirectResult> => {
  try {
    const response = await fetch(join(webURL, slug), {
      method: "HEAD",
      headers: { "X-Access-Token": authenticationToken },
    })
    if (!response.ok) {
      // Test this with any junk, e.g. `artsy:///asdfasdfasdf`
      return { type: "error" }
    }

    const screen = matchRoute(response.url)
    if (screen.type === "external_url") {
      // not sure if we have any URLs in force that would trigger this, but better safe than sorry!
      return { type: "open_external_link", url: response.url }
    } else if (screen.module === "WebView") {
      // Test this with `artsy:///artsy-vanguard-2019` which force should redirect to /series/artsy-vanguard-2019
      return { type: "show_internal_web_view", url: response.url }
    } else if (screen.module === "VanityURLEntity" && slug === (screen.params as any).slug) {
      // No redirect, it's some other kind of single-segment URI path.
      // Just show the web version of this page.
      // Test this with `artsy:///identity-verification-faq`
      return { type: "show_internal_web_view", url: response.url }
    } else {
      // The app has a native screen for the redirect URL, let's show it.
      // Test this with `artsy:///auction` which force should redirect to /auctions
      return { type: "show_native_view", url: response.url }
    }
  } catch (e) {
    // Happens only if there's a network problem
    return { type: "error" }
  }
}

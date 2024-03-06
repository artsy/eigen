import { Flex, Text, Spinner, Button } from "@artsy/palette-mobile"
import { ArtsyWebViewPage } from "app/Components/ArtsyWebView"
import { Stack } from "app/Components/Stack"
import { matchRoute } from "app/routes"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack, navigate } from "app/system/navigation/navigate"
import { useEnvironment } from "app/utils/hooks/useEnvironment"
import React, { useEffect, useState } from "react"
import { Linking } from "react-native"

function join(...parts: string[]) {
  return parts.map((s) => s.replace(/(^\/+|\/+$)/g, "")).join("/")
}

export const VanityURLPossibleRedirect: React.FC<{ slug: string }> = ({ slug }) => {
  const [jsx, setJSX] = useState(<Loading />)

  const authenticationToken = GlobalStore.useAppState((store) => store.auth.userAccessToken)
  const webURL = useEnvironment().webURL
  const resolvedURL = join(webURL, slug)

  useEffect(() => {
    fetch(resolvedURL, {
      method: "HEAD",
      headers: { "X-Access-Token": authenticationToken ?? "" },
    })
      .then((response) => {
        if (!response.ok) {
          // Test this with any junk, e.g. `artsy:///asdfasdfasdf`
          setJSX(<NotFound url={resolvedURL} />)
          return
        }

        const screen = matchRoute(response.url)
        if (screen.type === "external_url") {
          // not sure if we have any URLs in force that would trigger this, but better safe than sorry!
          goBack()
          navigate(response.url)
        } else if (screen.module === "ReactWebView") {
          // Test this with `artsy:///artsy-vanguard-2019` which force should redirect to /series/artsy-vanguard-2019
          setJSX(<ArtsyWebViewPage url={response.url} />)
        } else if (screen.module === "VanityURLEntity" && slug === (screen.params as any).slug) {
          // No redirect, it's some other kind of single-segment URI path.
          // Just show the web version of this page.
          // Test this with `artsy:///identity-verification-faq`
          setJSX(<ArtsyWebViewPage url={response.url} />)
        } else {
          // The app has a native screen for the redirect URL, let's show it.
          // Test this with `artsy:///auction` which force should redirect to /auctions

          // TODO: add `replace` mode of navigation
          goBack()
          navigate(response.url)
        }
      })
      .catch(() => {
        setJSX(<NotFound url={resolvedURL} />)
      })
  }, [])

  return jsx
}

const Loading: React.FC<{}> = ({}) => {
  return (
    <Flex style={{ flex: 1 }} flexDirection="row" alignItems="center" justifyContent="center">
      <Spinner />
    </Flex>
  )
}

const NotFound: React.FC<{ url: string }> = ({ url }) => {
  return (
    <Stack style={{ flex: 1 }} mx={2} alignItems="center" justifyContent="center">
      <Text variant="lg-display">404</Text>
      <Text variant="sm" textAlign="center">
        We can't find that page.
      </Text>

      <Button
        variant="outline"
        onPress={() => {
          Linking.openURL(url)
        }}
      >
        Open in browser
      </Button>
    </Stack>
  )
}

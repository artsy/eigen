import { Button, Flex, Image, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { HTML } from "app/Components/HTML"
import { ArtnetPremiumBadge } from "app/Scenes/Articles/Artnet/ArtnetPremiumBadge"
import { ArtnetArticleDetail } from "app/Scenes/Articles/Artnet/artnetGatewayV2"
import { useArtnetArticle } from "app/Scenes/Articles/Artnet/useArtnetArticle"
import { goBack } from "app/system/navigation/navigate"
import { ActivityIndicator, Linking, ScrollView } from "react-native"
import { WebView } from "react-native-webview"

// POC placeholder — the real Artnet Pro subscribe/paywall flow lives on the web.
const ARTNET_SUBSCRIBE_URL = "https://www.artnet.com/pro/"

interface ArtnetArticleScreenProps {
  /** WordPress URI (relative path) of the article, e.g. "/market/some-slug/" */
  uri: string
}

export const ArtnetArticleScreen: React.FC<ArtnetArticleScreenProps> = ({ uri }) => {
  const { article, loading, error } = useArtnetArticle(uri)

  return (
    <Screen>
      <Screen.Header onBack={goBack} title="Artnet Editorial" />
      <Screen.Body fullwidth>
        {loading ? (
          <Flex flex={1} alignItems="center" justifyContent="center">
            <ActivityIndicator />
          </Flex>
        ) : error || !article ? (
          <Flex flex={1} alignItems="center" justifyContent="center" px={4}>
            <Text variant="sm-display" textAlign="center">
              Couldn't load this article
            </Text>
            <Spacer y={1} />
            <Text variant="xs" color="mono60" textAlign="center">
              {error?.message ?? "Article not found"}
            </Text>
          </Flex>
        ) : article.isPremium ? (
          // Gated: withhold the premium body and show the teaser + subscribe CTA.
          // (The POC API returns full `content` even when gated, so we must not
          // render it here.)
          <ArtnetArticleGate article={article} />
        ) : (
          <WebView
            source={{ html: buildArticleHtml(article) }}
            originWhitelist={["*"]}
            style={{ flex: 1 }}
            // let the inlined document + its resources/embeds load, but open real
            // link taps in the system browser rather than inside this WebView
            onShouldStartLoadWithRequest={(request) => {
              if (request.navigationType === "click" && /^https?:/.test(request.url)) {
                Linking.openURL(request.url)
                return false
              }
              return true
            }}
          />
        )}
      </Screen.Body>
    </Screen>
  )
}

const ArtnetArticleGate: React.FC<{ article: ArtnetArticleDetail }> = ({ article }) => {
  const byline = (article.coAuthors ?? [])
    .map((author) => author.name)
    .filter(Boolean)
    .join(", ")
  const dateLabel = formatDate(article.date)
  const heroUrl = article.featuredImage?.node?.sourceUrl

  return (
    <ScrollView>
      {!!heroUrl && <Image src={heroUrl} aspectRatio={1.33} />}

      <Flex p={2}>
        {!!article.categories?.nodes?.[0]?.name && (
          <Text variant="xs" color="mono60">
            {article.categories.nodes[0].name}
          </Text>
        )}
        {!!article.title && (
          <Text variant="lg-display" mt={0.5}>
            {article.title}
          </Text>
        )}
        {(!!byline || !!dateLabel) && (
          <Text variant="xs" color="mono60" mt={1}>
            {[byline && `By ${byline}`, dateLabel].filter(Boolean).join(" • ")}
          </Text>
        )}

        {/* teaser — HTML render decodes entities + renders WP excerpt markup */}
        {!!article.excerpt && (
          <>
            <Spacer y={2} />
            <HTML html={article.excerpt} variant="sm" />
          </>
        )}

        <Spacer y={2} />

        <Flex backgroundColor="mono5" borderRadius={4} p={2} alignItems="center">
          <ArtnetPremiumBadge />
          <Spacer y={1} />
          <Text variant="sm-display" textAlign="center">
            This is an Artnet News Pro article
          </Text>
          <Spacer y={2} />
          <Button block onPress={() => Linking.openURL(ARTNET_SUBSCRIBE_URL)}>
            Subscribe to read
          </Button>
        </Flex>
      </Flex>
    </ScrollView>
  )
}

const formatDate = (date: string | null): string => {
  if (!date) {
    return ""
  }
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) {
    return ""
  }
  return parsed.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
}

/**
 * Wrap the article's rendered-HTML `content` in a minimal, mobile-friendly
 * document with a title/byline header. Content is trusted WordPress output.
 */
const buildArticleHtml = (article: ArtnetArticleDetail): string => {
  const byline = (article.coAuthors ?? [])
    .map((author) => author.name)
    .filter(Boolean)
    .join(", ")
  const dateLabel = formatDate(article.date)

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <style>
    body {
      margin: 16px;
      font-family: -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 17px;
      line-height: 1.5;
      color: #000;
      -webkit-text-size-adjust: 100%;
    }
    h1 { font-size: 26px; line-height: 1.2; margin: 0 0 8px; }
    .byline { font-weight: 600; margin: 0 0 2px; }
    .date { color: #707070; margin: 0 0 16px; }
    hr { border: none; border-top: 1px solid #e5e5e5; margin: 16px 0; }
    img, figure, iframe, video { max-width: 100%; height: auto; }
    figure { margin: 16px 0; }
    a { color: #000; }
  </style>
</head>
<body>
  ${article.title ? `<h1>${article.title}</h1>` : ""}
  ${byline ? `<p class="byline">By ${byline}</p>` : ""}
  ${dateLabel ? `<p class="date">${dateLabel}</p>` : ""}
  <hr />
  ${article.content ?? ""}
</body>
</html>`
}

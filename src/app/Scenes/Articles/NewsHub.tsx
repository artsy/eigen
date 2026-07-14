import { Flex, Pill, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { CardsWithMetaDataListPlaceholder } from "app/Components/Cards/CardWithMetaData"
import { ArtnetNewsList } from "app/Scenes/Articles/Artnet/ArtnetNewsList"
import { ArtsyNewsList } from "app/Scenes/Articles/News/News"
import { Suspense, useState } from "react"

type NewsSource = "artsy" | "artnet"

const SOURCES: { key: NewsSource; label: string }[] = [
  { key: "artsy", label: "Artsy" },
  { key: "artnet", label: "Artnet" },
]

export const NewsHub: React.FC = () => {
  const [source, setSource] = useState<NewsSource>("artsy")

  return (
    <Screen>
      <Screen.Body fullwidth>
        <Flex mx={2} mt={2}>
          <Text variant="lg-display">News</Text>
          <Spacer y={2} />
          <Flex flexDirection="row" gap={0.5} mb={1}>
            {SOURCES.map(({ key, label }) => (
              <Pill
                key={key}
                selected={source === key}
                onPress={() => setSource(key)}
                variant="link"
              >
                {label}
              </Pill>
            ))}
          </Flex>
        </Flex>

        {source === "artsy" ? (
          <Suspense fallback={<CardsWithMetaDataListPlaceholder title="News" />}>
            <ArtsyNewsList />
          </Suspense>
        ) : (
          <ArtnetNewsList />
        )}
      </Screen.Body>
    </Screen>
  )
}

import { Flex, Pill, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { CardsWithMetaDataListPlaceholder } from "app/Components/Cards/CardWithMetaData"
import { ArtsyEditorialList } from "app/Scenes/Articles/Articles"
import { ArtnetEditorialV2 } from "app/Scenes/Articles/Artnet/ArtnetEditorialV2"
import { ArtsyNewsList } from "app/Scenes/Articles/News/News"
import { Suspense, useState } from "react"

type EditorialSource = "artsyEditorial" | "artsyNews" | "artnetEditorial"

const SOURCES: { key: EditorialSource; label: string }[] = [
  { key: "artsyEditorial", label: "Artsy Editorial" },
  { key: "artsyNews", label: "Artsy News" },
  { key: "artnetEditorial", label: "Artnet Editorial" },
]

export const NewsHub: React.FC = () => {
  const [source, setSource] = useState<EditorialSource>("artsyEditorial")

  return (
    <Screen>
      <Screen.Body fullwidth>
        <Flex mx={2} mt={2}>
          <Text variant="lg-display">Editorial</Text>
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

        {source === "artsyEditorial" && (
          <Suspense fallback={<CardsWithMetaDataListPlaceholder title="Editorial" />}>
            <ArtsyEditorialList />
          </Suspense>
        )}

        {source === "artsyNews" && (
          <Suspense fallback={<CardsWithMetaDataListPlaceholder title="Editorial" />}>
            <ArtsyNewsList />
          </Suspense>
        )}

        {source === "artnetEditorial" && <ArtnetEditorialV2 />}
      </Screen.Body>
    </Screen>
  )
}

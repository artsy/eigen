import { Flex, Screen, Spacer } from "@artsy/palette-mobile"
import {
  AlertArtworksGrid,
  AlertArtworksGridPlaceholder,
} from "app/Scenes/SavedSearchAlert/AlertArtworksGrid"
import {
  AlertArtworksPills,
  AlertArtworksPillsPlaceholder,
} from "app/Scenes/SavedSearchAlert/AlertArtworksPills"
import { goBack } from "app/system/navigation/navigate"
import { FC, Suspense } from "react"

interface AlertArtworksProps {
  alertId: string
}

export const AlertArtworks: FC<AlertArtworksProps> = ({ alertId }) => {
  return (
    <Screen>
      <Screen.AnimatedHeader onBack={goBack} title="View Artworks" />

      <Screen.StickySubHeader title="View Artworks" />

      <Spacer y={1} />

      <Screen.Body fullwidth>
        <Screen.ScrollView>
          <Flex mx={2}>
            <Suspense fallback={<AlertArtworksPillsPlaceholder />}>
              <AlertArtworksPills alertId={alertId} />
            </Suspense>
            <Spacer y={1} />
            <Suspense fallback={<AlertArtworksGridPlaceholder />}>
              <AlertArtworksGrid alertId={alertId} />
            </Suspense>
          </Flex>
        </Screen.ScrollView>
      </Screen.Body>
    </Screen>
  )
}

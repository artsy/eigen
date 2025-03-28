import { Flex, Screen, Spacer } from "@artsy/palette-mobile"
import { useFocusEffect } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import {
  AlertArtworksGrid,
  AlertArtworksGridPlaceholder,
} from "app/Scenes/SavedSearchAlert/AlertArtworksGrid"
import {
  AlertArtworksPills,
  AlertArtworksPillsPlaceholder,
} from "app/Scenes/SavedSearchAlert/AlertArtworksPills"
import { EditSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { goBack } from "app/system/navigation/navigate"
import { FC, Suspense, useCallback, useState } from "react"

type ScreenNavigationProps = StackScreenProps<EditSavedSearchAlertNavigationStack, "AlertArtworks">
interface AlertArtworksProps extends ScreenNavigationProps {
  alertId?: string
}

export const AlertArtworks: FC<AlertArtworksProps> = ({ alertId: alertIdProp, route }) => {
  const alertId = alertIdProp ?? route.params.alertId
  // This is a workaround to force the component to re-fetch data when navigating back
  const [fetchKey, setFetchKey] = useState(0)

  useFocusEffect(
    useCallback(() => {
      setFetchKey((prev) => prev + 1)
    }, [])
  )

  return (
    <Screen>
      <Screen.AnimatedHeader onBack={goBack} title="View Artworks" />

      <Screen.StickySubHeader title="View Artworks" />

      <Spacer y={1} />

      <Screen.Body fullwidth>
        <Screen.ScrollView>
          <Flex mx={2}>
            <Suspense fallback={<AlertArtworksPillsPlaceholder />}>
              <AlertArtworksPills alertId={alertId} fetchKey={fetchKey} />
            </Suspense>
            <Spacer y={1} />
            <Suspense fallback={<AlertArtworksGridPlaceholder />}>
              <AlertArtworksGrid alertId={alertId} fetchKey={fetchKey} />
            </Suspense>
          </Flex>
        </Screen.ScrollView>
      </Screen.Body>
    </Screen>
  )
}

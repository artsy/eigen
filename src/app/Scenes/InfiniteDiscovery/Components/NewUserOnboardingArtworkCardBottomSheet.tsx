import { useColor, useScreenDimensions } from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet"
import { ArtworkCardBottomSheetHandle } from "app/Components/ArtworkCard/ArtworkCardBottomSheetHandle"
import { NewUserOnboardingAboutTheWorkTab } from "app/Scenes/InfiniteDiscovery/Components/NewUserOnboardingAboutTheWorkTab" // pragma: allowlist secret
import { FC, useCallback } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface NewUserOnboardingArtworkCardBottomSheetProps {
  artworkID: string
}

export const NewUserOnboardingArtworkCardBottomSheet: FC<
  NewUserOnboardingArtworkCardBottomSheetProps
> = ({ artworkID }) => {
  const { height } = useScreenDimensions()
  const { bottom, top } = useSafeAreaInsets()
  const color = useColor()

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={0}
        appearsOnIndex={1}
        pressBehavior="collapse"
        style={[props.style, { marginTop: -top }]}
      />
    ),
    [top]
  )

  return (
    <BottomSheet
      enableDynamicSizing={true}
      enablePanDownToClose={false}
      snapPoints={[bottom + 60]}
      maxDynamicContentSize={height * 0.88}
      index={0}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: color("mono0") }}
      handleComponent={ArtworkCardBottomSheetHandle}
    >
      <NewUserOnboardingAboutTheWorkTab artworkID={artworkID} />
    </BottomSheet>
  )
}

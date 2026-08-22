import { useColor, useScreenDimensions } from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet"
import { ArtworkCardBottomSheetHandle } from "app/Components/ArtworkCard/ArtworkCardBottomSheetHandle"
import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { NewUserOnboardingAboutTheWorkTab } from "app/Scenes/InfiniteDiscovery/Components/NewUserOnboardingAboutTheWorkTab" // pragma: allowlist secret
import { SENTRY_TAG_NONE, setSentryBottomSheetTag } from "app/system/errorReporting/sentryTags"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { FC, useCallback, useEffect, useRef } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface NewUserOnboardingArtworkCardBottomSheetProps {
  artworkID: string
}

export const handleOnboardingArtworkSheetBack = (args: {
  isExpanded: boolean
  collapse: () => void
  background: () => void
}): boolean => {
  if (args.isExpanded) {
    args.collapse()
  } else {
    args.background()
  }
  return true
}

export const NewUserOnboardingArtworkCardBottomSheet: FC<
  NewUserOnboardingArtworkCardBottomSheetProps
> = ({ artworkID }) => {
  const { height } = useScreenDimensions()
  const { bottom, top } = useSafeAreaInsets()
  const color = useColor()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const isExpandedRef = useRef(false)

  // Expansion is tracked in a ref to avoid re-rendering the card on every swipe, so the
  // Sentry tag is set imperatively from `onChange` rather than with useSentryBottomSheetTag.
  useEffect(() => {
    return () => setSentryBottomSheetTag(SENTRY_TAG_NONE)
  }, [])

  // InfiniteDiscovery is a dead-end in onboarding, so always handle hardware back
  // ourselves to keep it from popping back to the previous step.
  useBackHandler(
    useCallback(
      () =>
        handleOnboardingArtworkSheetBack({
          isExpanded: isExpandedRef.current,
          collapse: () => bottomSheetRef.current?.collapse(),
          background: ArtsyNativeModule.moveTaskToBack,
        }),
      []
    )
  )

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
      ref={bottomSheetRef}
      enableDynamicSizing={true}
      enablePanDownToClose={false}
      snapPoints={[bottom + 60]}
      maxDynamicContentSize={height * 0.88}
      index={0}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: color("mono0") }}
      handleComponent={ArtworkCardBottomSheetHandle}
      onChange={(index) => {
        isExpandedRef.current = index > 0
        setSentryBottomSheetTag(
          isExpandedRef.current ? "NewUserOnboardingArtworkCardBottomSheet" : SENTRY_TAG_NONE
        )
      }}
    >
      <NewUserOnboardingAboutTheWorkTab artworkID={artworkID} />
    </BottomSheet>
  )
}

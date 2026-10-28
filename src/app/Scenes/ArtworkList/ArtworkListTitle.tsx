import { HideIcon } from "@artsy/icons/native"
// eslint-disable-next-line no-restricted-imports
import { Flex, Popover, Text, Touchable } from "@artsy/palette-mobile"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import React, { useState } from "react"

interface ArtworkListTitleProps {
  title: string
  shareableWithPartners: boolean
}

export const ArtworkListTitle: React.FC<ArtworkListTitleProps> = ({
  title,
  shareableWithPartners,
}) => {
  const isArtworkListOfferabilityEnabled = useFeatureFlag("AREnableArtworkListOfferability")

  const [isToolTipVisible, setIsToolTipVisible] = useState(false)

  const handleDismiss = () => {
    setIsToolTipVisible(false)
  }

  return (
    <Flex mx={2} mb={1} flexDirection="row" alignItems="center">
      {!shareableWithPartners && !!isArtworkListOfferabilityEnabled ? (
        <>
          <Text variant="lg">{title}</Text>
          {/*
            Deliberately not an `OnboardingPopover`: this is user-initiated (it toggles on
            tap) and has no progressive-onboarding key, so it must not be dismissible-once
            or take the shared lock. It is still a full-screen native Modal, so it can
            stack on an onboarding popover that is already open — the remaining known gap.
          */}
          <Popover
            visible={isToolTipVisible}
            onDismiss={handleDismiss}
            onPressOutside={handleDismiss}
            title={
              <Text variant="xs" color="mono0">
                Artworks in this list are only visible{"\n"}to you and not eligible to receive
                {"\n"}offers.
              </Text>
            }
            placement="bottom"
          >
            <Flex>
              <Touchable
                accessibilityRole="button"
                onPress={() => {
                  setIsToolTipVisible(!isToolTipVisible)
                }}
                haptic
              >
                <HideIcon accessibilityLabel="HideIcon" mt={0.5} ml={0.5} fill="mono100" />
              </Touchable>
            </Flex>
          </Popover>
        </>
      ) : (
        <Text variant="lg">{title}</Text>
      )}
    </Flex>
  )
}

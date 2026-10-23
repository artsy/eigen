import { HelpIcon } from "@artsy/icons/native"
import { Button, Flex, Separator, Text, Touchable, useColor, useSpace } from "@artsy/palette-mobile"
import { SellWorkCard_artwork$key } from "__generated__/SellWorkCard_artwork.graphql"
import { SellChannelsInfoBottomSheet } from "app/Scenes/Sell/Components/SellChannelsInfoBottomSheet"
import { SellStepIntro } from "app/Scenes/Sell/Components/SellStepIntro"
import { SellWorkCard } from "app/Scenes/Sell/Components/SellWorkCard"
import { WORKS_SUMMARY_DESCRIPTION } from "app/Scenes/Sell/sellSteps"
import { getSellChannel } from "app/Scenes/Sell/utils/getSellChannel"
import { useState } from "react"
import { ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type SellWorksSummaryWork = SellWorkCard_artwork$key & { readonly internalID: string }

interface SellWorksSummaryProps {
  works: readonly SellWorksSummaryWork[]
  onStartWork: (internalID: string) => void
}

export const SellWorksSummary: React.FC<SellWorksSummaryProps> = ({ works, onStartWork }) => {
  const { bottom } = useSafeAreaInsets()
  const space = useSpace()
  const color = useColor()
  const [showChannelsInfo, setShowChannelsInfo] = useState(false)

  return (
    <>
      <ScrollView
        style={{ backgroundColor: color("mono0") }}
        contentContainerStyle={{ paddingHorizontal: space(2), paddingBottom: bottom + space(2) }}
      >
        <SellStepIntro stepName="SelectWorks" description={WORKS_SUMMARY_DESCRIPTION} />

        <Flex flexDirection="row" alignItems="center" gap={0.5} mb={2}>
          <Text variant="sm">Why different sales channels?</Text>
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="About sales channels"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => setShowChannelsInfo(true)}
          >
            <HelpIcon fill="mono60" />
          </Touchable>
        </Flex>

        {works.map((work) => (
          <SellWorksSummaryRow key={work.internalID} work={work} onStart={onStartWork} />
        ))}
      </ScrollView>

      {!!showChannelsInfo && (
        <SellChannelsInfoBottomSheet visible onDismiss={() => setShowChannelsInfo(false)} />
      )}
    </>
  )
}

const SellWorksSummaryRow: React.FC<{
  work: SellWorksSummaryWork
  onStart: (internalID: string) => void
}> = ({ work, onStart }) => {
  return (
    <Flex gap={1} mb={2}>
      <SellWorkCard artwork={work} />

      <Flex alignItems="flex-end">
        <Button size="small" haptic variant="fillDark" onPress={() => onStart(work.internalID)}>
          {getSellChannel(work.internalID).actionLabel}
        </Button>
      </Flex>

      <Separator mt={1} />
    </Flex>
  )
}

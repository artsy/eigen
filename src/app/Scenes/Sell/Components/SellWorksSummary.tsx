import { HelpIcon } from "@artsy/icons/native"
import {
  Button,
  Flex,
  Image,
  Pill,
  Separator,
  Text,
  Touchable,
  useColor,
  useSpace,
} from "@artsy/palette-mobile"
import { SellChannelsInfoBottomSheet } from "app/Scenes/Sell/Components/SellChannelsInfoBottomSheet"
import { SellStepIntro } from "app/Scenes/Sell/Components/SellStepIntro"
import { WORKS_SUMMARY_DESCRIPTION } from "app/Scenes/Sell/sellSteps"
import { getSellChannel } from "app/Scenes/Sell/utils/getSellChannel"
import { useState } from "react"
import { ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const THUMBNAIL_SIZE = 80

export interface SellWorksSummaryWork {
  readonly internalID: string
  readonly artistNames: string | null | undefined
  readonly title: string | null | undefined
  readonly date: string | null | undefined
  readonly thumbnail: { readonly url: string | null | undefined } | null | undefined
}

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
  const channel = getSellChannel(work.internalID)

  return (
    <Flex gap={1} mb={2}>
      <Flex flexDirection="row" gap={1}>
        {work.thumbnail?.url ? (
          <Image src={work.thumbnail.url} width={THUMBNAIL_SIZE} height={THUMBNAIL_SIZE} />
        ) : (
          <Flex width={THUMBNAIL_SIZE} height={THUMBNAIL_SIZE} bg="mono10" />
        )}

        <Flex flex={1} gap={0.5}>
          <Text variant="sm-display">{work.artistNames}</Text>
          <Text variant="sm" color="mono60">
            {work.title}
            {work.date ? `, ${work.date}` : ""}
          </Text>
          <Text variant="xs">{channel.status}</Text>
          <Flex flexDirection="row">
            <Pill variant="badge" disabled>
              {channel.name}
            </Pill>
          </Flex>
        </Flex>
      </Flex>

      <Flex alignItems="flex-end">
        <Button size="small" haptic variant="fillDark" onPress={() => onStart(work.internalID)}>
          {channel.actionLabel}
        </Button>
      </Flex>

      <Separator mt={1} />
    </Flex>
  )
}

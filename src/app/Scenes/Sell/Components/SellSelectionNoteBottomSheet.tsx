import {
  Button,
  Flex,
  Image,
  Join,
  Text,
  Touchable,
  useColor,
  useSpace,
} from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { SelectionCheck } from "app/Components/SelectionCheck/SelectionCheck"
import { isWorkSellable } from "app/Scenes/Sell/utils/isWorkSellable"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const THUMBNAIL_SIZE = 40

export interface SellSelectionWork {
  readonly internalID: string
  readonly artistNames: string | null | undefined
  readonly title: string | null | undefined
  readonly thumbnail: { readonly url: string | null | undefined } | null | undefined
}

interface SellSelectionNoteBottomSheetProps {
  visible: boolean
  works: readonly SellSelectionWork[]
  selectedWorkIDs: string[]
  onToggleWork: (internalID: string) => void
  onProceed: () => void
  onDismiss: () => void
}

export const SellSelectionNoteBottomSheet: React.FC<SellSelectionNoteBottomSheetProps> = ({
  visible,
  works,
  selectedWorkIDs,
  onToggleWork,
  onProceed,
  onDismiss,
}) => {
  const { bottom } = useSafeAreaInsets()
  const space = useSpace()
  const color = useColor()

  const sellableWorks = works.filter((work) => isWorkSellable(work.internalID))
  const unsellableWorks = works.filter((work) => !isWorkSellable(work.internalID))
  const canProceed = sellableWorks.some((work) => selectedWorkIDs.includes(work.internalID))

  return (
    <AutomountedBottomSheetModal
      sentryName="SellSelectionNoteBottomSheet"
      visible={visible}
      backgroundStyle={{ backgroundColor: color("mono0") }}
      onDismiss={onDismiss}
    >
      <BottomSheetScrollView
        contentContainerStyle={{ paddingHorizontal: space(2), paddingBottom: bottom + space(2) }}
      >
        <Flex pt={1} gap={4}>
          <Text variant="md">A note on your selection</Text>

          {sellableWorks.length > 0 && (
            <Flex gap={1}>
              <SectionTitle>Works we can sell</SectionTitle>
              <Text variant="sm" color="mono60">
                We can help you with {sellableWorks.length}/{works.length} of the works you
                selected, as long as they are currently in the US.
              </Text>
              <Text variant="sm" weight="medium">
                Please untick any works which are currently outside the US.
              </Text>

              <Join separator={<Flex height={space(1)} />}>
                {sellableWorks.map((work) => {
                  const checked = selectedWorkIDs.includes(work.internalID)

                  return (
                    <Touchable
                      key={work.internalID}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked }}
                      accessibilityLabel={`${work.artistNames}, ${work.title}`}
                      onPress={() => onToggleWork(work.internalID)}
                    >
                      <SellSelectionWorkRow work={work}>
                        <SelectionCheck checked={checked} />
                      </SellSelectionWorkRow>
                    </Touchable>
                  )
                })}
              </Join>
            </Flex>
          )}

          {unsellableWorks.length > 0 && (
            <Flex gap={1}>
              <SectionTitle>Not able to sell yet</SectionTitle>
              <Text variant="sm" color="mono60">
                Unfortunately, we cannot help today with the following, but we're working towards
                supporting these.
              </Text>

              <Join separator={<Flex height={space(1)} />}>
                {unsellableWorks.map((work) => (
                  <SellSelectionWorkRow key={work.internalID} work={work} />
                ))}
              </Join>
            </Flex>
          )}

          <Button block haptic variant="fillDark" disabled={!canProceed} onPress={onProceed}>
            Proceed to Listing
          </Button>
        </Flex>
      </BottomSheetScrollView>
    </AutomountedBottomSheetModal>
  )
}

const SectionTitle: React.FC<{ children: string }> = ({ children }) => (
  <Text variant="xs" caps weight="medium" color="mono60">
    {children}
  </Text>
)

const SellSelectionWorkRow: React.FC<React.PropsWithChildren<{ work: SellSelectionWork }>> = ({
  work,
  children,
}) => (
  <Flex flexDirection="row" alignItems="center" gap={1}>
    {work.thumbnail?.url ? (
      <Image src={work.thumbnail.url} width={THUMBNAIL_SIZE} height={THUMBNAIL_SIZE} />
    ) : (
      <Flex width={THUMBNAIL_SIZE} height={THUMBNAIL_SIZE} bg="mono10" />
    )}

    <Flex flex={1}>
      <Text variant="sm" numberOfLines={1}>
        {work.artistNames}
      </Text>
      <Text variant="sm" color="mono60" numberOfLines={1}>
        {work.title}
      </Text>
    </Flex>

    {children}
  </Flex>
)

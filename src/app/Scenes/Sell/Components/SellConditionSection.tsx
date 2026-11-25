import { Flex, Input, Text } from "@artsy/palette-mobile"
import { useToast } from "app/Components/Toast/toastHook"
import {
  MAX_SELL_CONDITION_PHOTOS,
  SellConditionPhoto,
  SellConditionPhotos,
} from "app/Scenes/Sell/Components/SellConditionPhotos"
import { SellConditionRatingPicker } from "app/Scenes/Sell/Components/SellConditionRatingPicker"
import { SellConditionStore } from "app/Scenes/Sell/State/SellConditionStore"

export const SellConditionSection: React.FC<{ photosDisabled?: boolean }> = ({
  photosDisabled = false,
}) => {
  const { rating, photos, notes } = SellConditionStore.useStoreState((state) => state)
  const { setRating, setPhotos, setNotes } = SellConditionStore.useStoreActions(
    (actions) => actions
  )

  const toast = useToast()

  const addPhotos = (newPhotos: SellConditionPhoto[]) => {
    const picked = newPhotos.filter((photo) => !photos.some(({ path }) => path === photo.path))
    const fitting = picked.slice(0, MAX_SELL_CONDITION_PHOTOS - photos.length)

    setPhotos([...photos, ...fitting])

    if (fitting.length < picked.length) {
      toast.show(
        `You can add up to ${MAX_SELL_CONDITION_PHOTOS} photos. We added the first ${fitting.length}.`,
        "bottom"
      )
    }
  }

  return (
    <Flex>
      <Flex px={2} pb={2} gap={1}>
        <Text variant="md">Condition</Text>
        <Text variant="sm">How would you describe the work’s condition?</Text>
      </Flex>

      <SellConditionRatingPicker value={rating} onChange={setRating} />

      <Flex px={2} pt={4} gap={4}>
        <Flex gap={1}>
          <Text variant="sm">Add photos of the condition</Text>
          <Text variant="xs" color="mono60">
            Show any wear, damage or restoration so buyers know what to expect.
          </Text>
          <SellConditionPhotos
            photos={photos}
            disabled={photosDisabled}
            onAdd={addPhotos}
            onRemove={(path) => setPhotos(photos.filter((photo) => photo.path !== path))}
          />
        </Flex>

        <Flex gap={1}>
          <Text variant="sm">Anything else we should know?</Text>
          <Text variant="xs" color="mono60">
            Any notes on the work’s condition, history, provenance, or anything else that our
            specialists may want to know.
          </Text>
          <Input
            multiline
            placeholder="Notes"
            accessibilityLabel="Notes"
            value={notes}
            onChangeText={setNotes}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

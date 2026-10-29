import { Flex, Input, Text } from "@artsy/palette-mobile"
import {
  SellConditionPhoto,
  SellConditionPhotos,
} from "app/Scenes/Sell/Components/SellConditionPhotos"
import {
  SellConditionRating,
  SellConditionRatingPicker,
} from "app/Scenes/Sell/Components/SellConditionRatingPicker"

export interface SellConditionValue {
  rating: SellConditionRating | null
  photos: SellConditionPhoto[]
  notes: string
}

export const EMPTY_SELL_CONDITION: SellConditionValue = { rating: null, photos: [], notes: "" }

interface SellConditionSectionProps {
  value: SellConditionValue
  onChange: React.Dispatch<React.SetStateAction<SellConditionValue>>
}

export const SellConditionSection: React.FC<SellConditionSectionProps> = ({ value, onChange }) => {
  const { rating, photos, notes } = value

  const addPhotos = (newPhotos: SellConditionPhoto[]) => {
    onChange((current) => ({
      ...current,
      photos: [
        ...current.photos,
        ...newPhotos.filter((photo) => !current.photos.some(({ path }) => path === photo.path)),
      ],
    }))
  }

  return (
    <Flex>
      <Flex px={2} pb={2} gap={1}>
        <Text variant="md">Condition</Text>
        <Text variant="sm">How would you describe the work's condition?</Text>
      </Flex>

      <SellConditionRatingPicker
        value={rating}
        onChange={(newRating) => onChange((current) => ({ ...current, rating: newRating }))}
      />

      <Flex px={2} pt={4} gap={4}>
        <Flex gap={1}>
          <Text variant="sm">Add photos of the condition</Text>
          <Text variant="xs" color="mono60">
            Show any wear, damage or restoration so buyers know what to expect.
          </Text>
          <SellConditionPhotos
            photos={photos}
            onAdd={addPhotos}
            onRemove={(path) =>
              onChange((current) => ({
                ...current,
                photos: current.photos.filter((photo) => photo.path !== path),
              }))
            }
          />
        </Flex>

        <Flex gap={1}>
          <Text variant="sm">Anything else we should know?</Text>
          <Text variant="xs" color="mono60">
            Any notes on the work's condition, history, provenance, or anything else that our
            specialists may want to know.
          </Text>
          <Input
            multiline
            placeholder="Notes"
            accessibilityLabel="Notes"
            value={notes}
            onChangeText={(newNotes) => onChange((current) => ({ ...current, notes: newNotes }))}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

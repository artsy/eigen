import { Flex, Input, Text } from "@artsy/palette-mobile"
import {
  SellConditionPhoto,
  SellConditionPhotos,
} from "app/Scenes/Sell/Components/SellConditionPhotos"
import {
  SellConditionRating,
  SellConditionRatingPicker,
} from "app/Scenes/Sell/Components/SellConditionRatingPicker"

interface SellConditionSectionProps {
  rating: SellConditionRating | null
  onRatingChange: (rating: SellConditionRating) => void
  photos: SellConditionPhoto[]
  onPhotosChange: (photos: SellConditionPhoto[]) => void
  notes: string
  onNotesChange: (notes: string) => void
}

export const SellConditionSection: React.FC<SellConditionSectionProps> = ({
  rating,
  onRatingChange,
  photos,
  onPhotosChange,
  notes,
  onNotesChange,
}) => {
  const addPhotos = (newPhotos: SellConditionPhoto[]) => {
    onPhotosChange([
      ...photos,
      ...newPhotos.filter((photo) => !photos.some(({ path }) => path === photo.path)),
    ])
  }

  return (
    <Flex>
      <Flex px={2} pb={2} gap={1}>
        <Text variant="md">Condition</Text>
        <Text variant="sm">How would you describe the work’s condition?</Text>
      </Flex>

      <SellConditionRatingPicker value={rating} onChange={onRatingChange} />

      <Flex px={2} pt={4} gap={4}>
        <Flex gap={1}>
          <Text variant="sm">Add photos of the condition</Text>
          <Text variant="xs" color="mono60">
            Show any wear, damage or restoration so buyers know what to expect.
          </Text>
          <SellConditionPhotos
            photos={photos}
            onAdd={addPhotos}
            onRemove={(path) => onPhotosChange(photos.filter((photo) => photo.path !== path))}
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
            onChangeText={onNotesChange}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

import { ChevronLeftIcon } from "@artsy/icons/native"
import { Button, Flex, Text } from "@artsy/palette-mobile"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { useState } from "react"
import { TouchableOpacity } from "react-native"

/** The designs' limit, shown as a counter under the field. */
const MAX_LENGTH = 40
const BACK_SIZE = 18
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 }

interface Props {
  /** Prefilled with what an implicitly created itinerary would be called. */
  initialName: string
  isCreating: boolean
  onCreate: (name: string) => void
  /** Back to the list, for someone who meant to add to an itinerary they already have. */
  onCancel: () => void
}

/** The sheet's second view: name a new itinerary. */
export const CreateItineraryForm: React.FC<Props> = ({
  initialName,
  isCreating,
  onCreate,
  onCancel,
}) => {
  const [name, setName] = useState(initialName)
  const trimmed = name.trim()

  return (
    <Flex px={2} pb={2}>
      <Flex flexDirection="row" alignItems="center" gap={1} mb={2}>
        <TouchableOpacity
          testID="create-itinerary-back"
          accessibilityRole="button"
          accessibilityLabel="Back to your itineraries"
          hitSlop={HIT_SLOP}
          onPress={onCancel}
        >
          <ChevronLeftIcon width={BACK_SIZE} height={BACK_SIZE} />
        </TouchableOpacity>

        <Text variant="md">New Itinerary</Text>
      </Flex>

      <BottomSheetInput
        testID="create-itinerary-name"
        placeholder="Name your Itinerary"
        value={name}
        maxLength={MAX_LENGTH}
        onChangeText={setName}
        autoFocus
      />

      <Text variant="xs" color="mono60" textAlign="right" mt={0.5}>
        {`${name.length} / ${MAX_LENGTH}`}
      </Text>

      <Button
        testID="create-itinerary-submit"
        block
        mt={2}
        loading={isCreating}
        // An itinerary with no name would be unidentifiable in the list it lands in.
        disabled={!trimmed.length}
        onPress={() => onCreate(trimmed)}
      >
        Create
      </Button>
    </Flex>
  )
}

import { Button, Flex, Input, Text } from "@artsy/palette-mobile"
import { useState } from "react"

/** The designs' limit, shown as a counter under the field. */
const MAX_LENGTH = 40

interface Props {
  /** Prefilled with what an implicitly created itinerary would be called. */
  initialName: string
  isCreating: boolean
  onCreate: (name: string) => void
}

/** The sheet's second view: name a new itinerary. */
export const CreateItineraryForm: React.FC<Props> = ({ initialName, isCreating, onCreate }) => {
  const [name, setName] = useState(initialName)
  const trimmed = name.trim()

  return (
    <Flex px={2} pb={2}>
      <Text variant="md" mb={2}>
        New Itinerary
      </Text>

      <Input
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

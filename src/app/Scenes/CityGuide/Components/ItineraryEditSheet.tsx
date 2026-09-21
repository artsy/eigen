import { Button, Flex, Input, Text, Touchable } from "@artsy/palette-mobile"
import { ItineraryEditSheetDeleteMutation } from "__generated__/ItineraryEditSheetDeleteMutation.graphql"
import { ItineraryEditSheetUpdateMutation } from "__generated__/ItineraryEditSheetUpdateMutation.graphql"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { useToast } from "app/Components/Toast/toastHook"
import { useState } from "react"
import { graphql, useMutation } from "react-relay"

const NOTES_LIMIT = 200

interface Props {
  visible: boolean
  onClose: () => void
  itinerary: {
    internalID: string
    name: string
    /** The designs label this "Notes"; it is the itinerary's `description`. */
    description?: string | null
  }
  /** Called after a successful delete, so the caller can leave the screen or refresh. */
  onDeleted?: () => void
}

/**
 * The "Edit Itinerary" sheet: rename it, edit its notes, or delete it. Its cover image is not
 * among them — changing one means `updateItinerary`'s `arImageID`, which needs an image picked
 * and uploaded as an ArImage, a flow that does not exist yet.
 *
 * Only reachable from the itineraries list, which queries through `me`, so the caller always
 * owns what it is editing. `Query.itinerary` exposes no ownership flag, so the itinerary
 * screen itself could not tell whether to offer this.
 */
export const ItineraryEditSheet: React.FC<Props> = ({ visible, onClose, itinerary, onDeleted }) => {
  const toast = useToast()
  const [name, setName] = useState(itinerary.name)
  const [notes, setNotes] = useState(itinerary.description ?? "")

  const [commitUpdate, isUpdating] = useMutation<ItineraryEditSheetUpdateMutation>(updateMutation)
  const [commitDelete, isDeleting] = useMutation<ItineraryEditSheetDeleteMutation>(deleteMutation)

  const save = () => {
    commitUpdate({
      variables: { input: { id: itinerary.internalID, title: name, description: notes } },
      onCompleted: (_response, errors) => {
        if (errors?.length) {
          toast.show("Could not save your changes", "bottom")
          return
        }

        onClose()
      },
      onError: () => toast.show("Could not save your changes", "bottom"),
    })
  }

  const destroy = () => {
    commitDelete({
      variables: { input: { id: itinerary.internalID } },
      onCompleted: (_response, errors) => {
        if (errors?.length) {
          toast.show("Could not delete this itinerary", "bottom")
          return
        }

        onClose()
        onDeleted?.()
      },
      onError: () => toast.show("Could not delete this itinerary", "bottom"),
    })
  }

  return (
    <AutoHeightBottomSheet visible={visible} onDismiss={onClose}>
      <Flex pt={1} pb={2}>
        <Flex px={2} pb={2}>
          <Text variant="md">Edit Itinerary</Text>
        </Flex>

        <Flex px={2} gap={2}>
          <Input title="Name" value={name} onChangeText={setName} testID="itinerary-edit-name" />

          <Flex>
            <Input
              title="Notes"
              value={notes}
              onChangeText={setNotes}
              multiline
              maxLength={NOTES_LIMIT}
              testID="itinerary-edit-notes"
            />

            <Text variant="xs" color="mono60" textAlign="right" mt={0.5}>
              {`${notes.length} / ${NOTES_LIMIT}`}
            </Text>
          </Flex>
        </Flex>

        <Flex px={2} pt={2} gap={2}>
          <Button
            block
            testID="itinerary-edit-save"
            loading={isUpdating}
            disabled={!name.trim()}
            onPress={save}
          >
            Save Changes
          </Button>

          {/* Red and underlined, per the designs — a text link rather than a button. */}
          <Touchable
            testID="itinerary-edit-delete"
            accessibilityRole="button"
            accessibilityLabel="Delete Itinerary"
            disabled={isDeleting}
            onPress={destroy}
          >
            <Text variant="sm" color="red100" textAlign="center" underline>
              Delete Itinerary
            </Text>
          </Touchable>
        </Flex>
      </Flex>
    </AutoHeightBottomSheet>
  )
}

const updateMutation = graphql`
  mutation ItineraryEditSheetUpdateMutation($input: updateItineraryInput!) {
    updateItinerary(input: $input) {
      responseOrError {
        __typename
        ... on ItineraryMutationSuccess {
          itinerary {
            internalID
            title
            description
          }
        }
        ... on ItineraryMutationFailure {
          mutationError {
            message
          }
        }
      }
    }
  }
`

const deleteMutation = graphql`
  mutation ItineraryEditSheetDeleteMutation($input: deleteItineraryInput!) {
    deleteItinerary(input: $input) {
      responseOrError {
        __typename
        ... on ItineraryMutationFailure {
          mutationError {
            message
          }
        }
      }
    }
  }
`

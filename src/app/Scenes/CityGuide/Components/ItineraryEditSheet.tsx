import { Button, Flex, Input, Text } from "@artsy/palette-mobile"
import { ItineraryEditSheetDeleteMutation } from "__generated__/ItineraryEditSheetDeleteMutation.graphql"
import { ItineraryEditSheetUpdateMutation } from "__generated__/ItineraryEditSheetUpdateMutation.graphql"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { useToast } from "app/Components/Toast/toastHook"
import { useState } from "react"
// TODO: Replace with Image from @artsy/palette-mobile once the cover is a real image.
import { Image as RNImage, TouchableOpacity } from "react-native"
import { graphql, useMutation } from "react-relay"

/** The designs' cap on the notes field, shown as a counter beneath it. */
const NOTES_LIMIT = 200
const COVER_WIDTH = 165
const COVER_HEIGHT = 123

interface Props {
  visible: boolean
  onClose: () => void
  itinerary: {
    internalID: string
    name: string
    /** The designs label this "Notes"; it is the itinerary's `description`. */
    description?: string | null
    coverImageUrl?: string | null
  }
  /** Called after a successful delete, so the caller can leave the screen or refresh. */
  onDeleted?: () => void
}

/**
 * The "Edit Itinerary" sheet: rename it, edit its notes, or delete it.
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
      variables: { input: { id: itinerary.internalID, name, description: notes } },
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

          <Flex gap={1}>
            <Text variant="sm">Cover image</Text>

            {!!itinerary.coverImageUrl && (
              <RNImage
                source={{ uri: itinerary.coverImageUrl }}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
                style={{ width: COVER_WIDTH, height: COVER_HEIGHT }}
              />
            )}

            {/*
              Display only for now. Changing it means `updateItinerary`'s `arImageID`, which
              needs an image picked and uploaded as an ArImage — its own flow.
            */}
            <Text variant="xs" color="mono60" underline>
              Change image
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
          <TouchableOpacity
            testID="itinerary-edit-delete"
            accessibilityRole="button"
            accessibilityLabel="Delete Itinerary"
            disabled={isDeleting}
            onPress={destroy}
          >
            <Text variant="sm" color="red100" textAlign="center" underline>
              Delete Itinerary
            </Text>
          </TouchableOpacity>
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
            name
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

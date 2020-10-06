import { Action, action, thunk, Thunk } from "easy-peasy"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { AutosuggestResult } from "lib/Scenes/Search/AutosuggestResults"
import { AppStoreModel } from "lib/store/AppStoreModel"
import { isEqual } from "lodash"
import { uniqBy } from "lodash"
import { ActionSheetIOS } from "react-native"
import ImagePicker, { Image } from "react-native-image-crop-picker"
import { commitMutation } from "react-relay"
import { ConnectionHandler, graphql } from "relay-runtime"

import { MyCollectionArtworkModelCreateArtworkMutation } from "__generated__/MyCollectionArtworkModelCreateArtworkMutation.graphql"
import { MyCollectionArtworkModelDeleteArtworkMutation } from "__generated__/MyCollectionArtworkModelDeleteArtworkMutation.graphql"
import { MyCollectionArtworkModelUpdateArtworkMutation } from "__generated__/MyCollectionArtworkModelUpdateArtworkMutation.graphql"
import { Metric } from "../Screens/AddArtwork/Components/Dimensions"
import { cleanArtworkPayload } from "../utils/cleanArtworkPayload"

import {
  getConvectionGeminiKey,
  getGeminiCredentialsForEnvironment,
  uploadFileToS3,
} from "../../Consignments/Submission/geminiUploadToS3"

export interface ArtworkFormValues {
  artist: string
  artistIds: string[]
  artistSearchResult: AutosuggestResult | null
  category: string // this refers to "materials" in UI
  costMinor: string
  costCurrencyCode: string
  date: string
  depth: string
  editionSize: string
  editionNumber: string
  height: string
  medium: string
  metric: Metric
  photos: Image[]
  title: string
  width: string
}

const initialFormValues: ArtworkFormValues = {
  artist: "",
  artistIds: [],
  artistSearchResult: null,
  category: "",
  costMinor: "", // in cents
  costCurrencyCode: "",
  date: "",
  depth: "",
  editionSize: "",
  editionNumber: "",
  height: "",
  medium: "",
  metric: "",
  photos: [],
  title: "",
  width: "",
}

export interface MyCollectionArtworkModel {
  sessionState: {
    formValues: ArtworkFormValues
    artworkId: string
    artworkGlobalId: string
    dirtyFormCheckValues: ArtworkFormValues
    meGlobalId: string
  }
  setFormValues: Action<MyCollectionArtworkModel, ArtworkFormValues>
  setDirtyFormCheckValues: Action<MyCollectionArtworkModel, ArtworkFormValues>
  resetForm: Action<MyCollectionArtworkModel>
  setArtistSearchResult: Action<MyCollectionArtworkModel, AutosuggestResult | null>
  setArtworkId: Action<MyCollectionArtworkModel, { artworkId: string; artworkGlobalId: string }>
  setMeGlobalId: Action<MyCollectionArtworkModel, string>

  addPhotos: Action<MyCollectionArtworkModel, ArtworkFormValues["photos"]>
  removePhoto: Action<MyCollectionArtworkModel, ArtworkFormValues["photos"][0]>

  // Called from formik `onSubmit` handler
  addArtwork: Thunk<MyCollectionArtworkModel, ArtworkFormValues>
  addArtworkComplete: Thunk<MyCollectionArtworkModel>
  addArtworkError: Action<MyCollectionArtworkModel, any> // FIXME: any

  startEditingArtwork: Thunk<MyCollectionArtworkModel, any, {}, AppStoreModel>
  editArtwork: Thunk<MyCollectionArtworkModel, ArtworkFormValues>
  editArtworkComplete: Action<MyCollectionArtworkModel, any> // FIXME: any
  editArtworkError: Action<MyCollectionArtworkModel, any> // FIXME: any

  deleteArtwork: Thunk<MyCollectionArtworkModel, { artworkId: string; artworkGlobalId: string }, {}, AppStoreModel>
  deleteArtworkComplete: Action<MyCollectionArtworkModel, any>
  deleteArtworkError: Action<MyCollectionArtworkModel, any>

  cancelAddEditArtwork: Thunk<MyCollectionArtworkModel, any, {}, AppStoreModel>
  takeOrPickPhotos: Thunk<MyCollectionArtworkModel, any, any, AppStoreModel>
}

export const MyCollectionArtworkModel: MyCollectionArtworkModel = {
  sessionState: {
    formValues: initialFormValues,
    // The internalID of the artwork
    artworkId: "",
    // The relay global ID of the artwork so that, post-edit, we can update the view
    artworkGlobalId: "",
    dirtyFormCheckValues: initialFormValues,
    /**
     * The relay global ID of the `me` field, used to insert / delete edge post mutation.
     *
     * TODO: this will likely be able to go away once we update our mutations to take
     * advantage of the new Relay v10 directive-based update model.
     * See https://github.com/facebook/relay/releases/tag/v10.0.0.
     */
    meGlobalId: "",
  },

  setFormValues: action((state, input) => {
    state.sessionState.formValues = input
  }),

  setDirtyFormCheckValues: action((state, values) => {
    state.sessionState.dirtyFormCheckValues = values
  }),

  resetForm: action((state) => {
    state.sessionState.formValues = initialFormValues
    state.sessionState.dirtyFormCheckValues = initialFormValues
  }),

  setArtworkId: action((state, { artworkId, artworkGlobalId }) => {
    state.sessionState.artworkId = artworkId
    state.sessionState.artworkGlobalId = artworkGlobalId
  }),

  // TODO: This can be removed once we update to relay 10 mutation API
  setMeGlobalId: action((state, meGlobalId) => {
    state.sessionState.meGlobalId = meGlobalId
  }),

  setArtistSearchResult: action((state, artistSearchResult) => {
    state.sessionState.formValues.artistSearchResult = artistSearchResult

    if (artistSearchResult == null) {
      state.sessionState.formValues.artist = "" // reset search input field
    }
  }),

  addPhotos: action((state, photos) => {
    state.sessionState.formValues.photos = uniqBy(state.sessionState.formValues.photos.concat(photos), "path")
  }),

  removePhoto: action((state, photoToRemove) => {
    state.sessionState.formValues.photos = state.sessionState.formValues.photos.filter(
      (photo) => photo.path !== photoToRemove.path
    )
  }),

  addArtwork: thunk(
    async (actions, { artistSearchResult, artist, artistIds, costMinor, photos, ...payload }, { getState }) => {
      const state = getState()
      const input = cleanArtworkPayload(payload) as typeof payload

      const imagePaths = photos.map((photo) => photo.path)

      const convectionKey = await getConvectionGeminiKey()
      const acl = "private"
      const assetCredentials = await getGeminiCredentialsForEnvironment({ acl, name: convectionKey })
      const bucket = assetCredentials.policyDocument.conditions.bucket

      const uploadPromises = imagePaths.map(
        async (path): Promise<string> => {
          const s3 = await uploadFileToS3(path, acl, assetCredentials)
          const url = `https://${bucket}.s3.amazonaws.com/${s3.key}`
          return url
        }
      )

      const externalImageUrls: string[] = await Promise.all(uploadPromises)

      try {
        commitMutation<MyCollectionArtworkModelCreateArtworkMutation>(defaultEnvironment, {
          mutation: graphql`
            mutation MyCollectionArtworkModelCreateArtworkMutation($input: MyCollectionCreateArtworkInput!) {
              myCollectionCreateArtwork(input: $input) {
                artworkOrError {
                  ... on MyCollectionArtworkMutationSuccess {
                    artworkEdge {
                      __id
                      node {
                        ...MyCollectionArtworkDetail_sharedProps @relay(mask: false)
                      }
                    }
                  }

                  # TODO: Handle error case
                  ... on MyCollectionArtworkMutationFailure {
                    mutationError {
                      message
                    }
                  }
                }
              }
            }
          `,
          variables: {
            input: {
              artistIds: [artistSearchResult!.internalID as string],
              externalImageUrls,
              costMinor: Number(costMinor),
              ...input,
            },
          },

          // TODO: Relay v10 introduces a new directive-based mechanism for updating post-mutation.
          // See https://github.com/facebook/relay/releases/tag/v10.0.0.
          updater: (store) => {
            const response = store
              .getRootField("myCollectionCreateArtwork")
              .getLinkedRecord("artworkOrError")
              // FIXME: Handle the error ("orError") case. Right now this will fail as the
              // `artworkEdge` field isn't selectable if an error is returned from MP.
              .getLinkedRecord("artworkEdge")

            // Use me.id's globalID which is the parent to `myCollectionConnection`
            const meNode = store.get(state.sessionState.meGlobalId)

            if (meNode) {
              const connection = ConnectionHandler.getConnection(
                meNode,
                "MyCollectionArtworkList_myCollectionConnection"
              )

              if (connection) {
                ConnectionHandler.insertEdgeBefore(connection, response)
              }
            }
          },
          onCompleted: () => actions.addArtworkComplete(),
          onError: (error) => actions.addArtworkError(error),
        })
      } catch (error) {
        console.error("Error adding artwork", error)
        actions.addArtworkError(error)
      }
    }
  ),

  addArtworkComplete: thunk((actions) => {
    actions.resetForm()
  }),

  addArtworkError: action((_state, error) => {
    console.error("Add artwork error", error)
  }),

  /**
   * Edit Artwork
   */

  /**
   * When user clicks the edit artwork button from detail view, we format
   * data the data from the detail into a form the edit form expects.
   */
  startEditingArtwork: thunk((actions, artwork) => {
    actions.setArtworkId({
      artworkId: artwork.internalID,
      artworkGlobalId: artwork.id,
    })

    const editProps: any /* FIXME: any */ = {
      // FIXME: Remove this ts-ignore and type properly
      // @ts-ignore
      artistSearchResult: {
        internalID: artwork?.artist?.internalID,
        displayLabel: artwork?.artistNames,
        imageUrl: artwork?.image?.url?.replace(":version", "square"),
      },
      category: artwork.category,
      date: artwork.date,
      depth: artwork.depth,
      costMinor: artwork.costMinor,
      costCurrencyCode: artwork.costCurrencyCode,
      editionSize: artwork.editionSize,
      editionNumber: artwork.editionNumber,
      height: artwork.height,
      medium: artwork.medium,
      metric: artwork.metric,
      photos: [],
      title: artwork.title,
      width: artwork.width,
    }

    actions.setFormValues(editProps)

    // Baseline to check if we can cancel edit without showing
    // iOS action sheet confirmation
    actions.setDirtyFormCheckValues(editProps)
  }),

  editArtwork: thunk(
    async (actions, { artistSearchResult, artist, artistIds, costMinor, photos, ...payload }, { getState }) => {
      try {
        const { sessionState } = getState()
        const input = cleanArtworkPayload(payload) as typeof payload

        commitMutation<MyCollectionArtworkModelUpdateArtworkMutation>(defaultEnvironment, {
          mutation: graphql`
            mutation MyCollectionArtworkModelUpdateArtworkMutation($input: MyCollectionUpdateArtworkInput!) {
              myCollectionUpdateArtwork(input: $input) {
                artworkOrError {
                  ... on MyCollectionArtworkMutationSuccess {
                    artwork {
                      ...MyCollectionArtworkDetail_sharedProps @relay(mask: false)
                    }
                  }

                  # TODO: Handle error case
                }
              }
            }
          `,
          variables: {
            input: {
              artistIds: [artistSearchResult!.internalID as string],
              artworkId: sessionState.artworkId,
              // Cooerce type for MP
              costMinor: Number(costMinor),
              ...input,
            },
          },
          // TODO: Revist this once we update with new Relay v10 mutation API
          updater: (store) => {
            const artwork = store.get(sessionState.artworkGlobalId)
            artwork!.setValue(artistSearchResult?.displayLabel, "artistNames")

            Object.entries(input).forEach(([key, value]) => {
              artwork!.setValue(value, key)
            })
          },
          onCompleted: (response) => {
            actions.editArtworkComplete(response)
            actions.resetForm()
          },
          onError: (error) => actions.editArtworkError(error),
        })
      } catch (error) {
        console.error("Error updating artwork", error)
        actions.editArtworkError(error)
      }
    }
  ),

  editArtworkComplete: action(() => {
    console.log("Edit artwork complete")
  }),

  editArtworkError: action((_state, error) => {
    console.error("Edit artwork error", error)
  }),

  deleteArtwork: thunk(async (actions, input) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: "Delete artwork?",
        options: ["Delete", "Cancel"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          try {
            commitMutation<MyCollectionArtworkModelDeleteArtworkMutation>(defaultEnvironment, {
              mutation: graphql`
                mutation MyCollectionArtworkModelDeleteArtworkMutation($input: MyCollectionDeleteArtworkInput!) {
                  myCollectionDeleteArtwork(input: $input) {
                    artworkOrError {
                      ... on MyCollectionArtworkMutationDeleteSuccess {
                        success
                      }
                      ... on MyCollectionArtworkMutationFailure {
                        mutationError {
                          message
                        }
                      }
                    }
                  }
                }
              `,
              variables: {
                input: {
                  artworkId: input.artworkId,
                },
              },
              updater: (store) => {
                const parentID = store.get("TWU6NTg4MjhiMWU5YzE4ZGIzMGYzMDAyZmJh") // Use me.id's globalID

                if (parentID) {
                  const connection = ConnectionHandler.getConnection(
                    parentID,
                    "MyCollectionArtworkList_myCollectionConnection"
                  )
                  if (connection) {
                    ConnectionHandler.deleteNode(connection, input.artworkGlobalId)
                  }
                }
              },
              onCompleted: actions.deleteArtworkComplete,
              onError: actions.deleteArtworkError,
            })
          } catch (error) {
            console.error("Error updating artwork", error)
            actions.editArtworkError(error)
          }
        }
      }
    )
  }),

  deleteArtworkComplete: action(() => {
    //
  }),

  deleteArtworkError: action((_state, error) => {
    console.error("Error deleting artwork", error)
  }),

  cancelAddEditArtwork: thunk((actions, _payload, { getState, getStoreActions }) => {
    const navigationActions = getStoreActions().myCollection.navigation
    const formIsDirty = !isEqual(getState().sessionState.formValues, getState().sessionState.dirtyFormCheckValues)

    if (formIsDirty) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: "You sure?",
          options: ["Discard", "Keep editing"],
          destructiveButtonIndex: 0,
          cancelButtonIndex: 1,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            actions.setFormValues(initialFormValues)
            navigationActions.dismissModal()
          }
        }
      )
    } else {
      navigationActions.dismissModal()
    }
  }),

  takeOrPickPhotos: thunk((actions, _payload) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Photo Library", "Take Photo", "Cancel"],
        cancelButtonIndex: 2,
      },
      async (buttonIndex) => {
        try {
          let photos = null

          if (buttonIndex === 0) {
            photos = await ImagePicker.openPicker({
              multiple: true,
            })
          }
          if (buttonIndex === 1) {
            photos = await ImagePicker.openCamera({
              mediaType: "photo",
            })
          }

          if (photos) {
            actions.addPhotos(photos as any) // FIXME: any
          }
        } catch (error) {
          // Photo picker closes by throwing error that we need to catch
        }
      }
    )
  }),
}

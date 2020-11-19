import { Action, action, thunk, Thunk } from "easy-peasy"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { AutosuggestResult } from "lib/Scenes/Search/AutosuggestResults"
import { AppStoreModel } from "lib/store/AppStoreModel"
import { isEqual } from "lodash"
import { uniqBy } from "lodash"
import { ActionSheetIOS, Alert } from "react-native"
import ImagePicker from "react-native-image-crop-picker"
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

export interface Image {
  height?: number
  isDefault?: boolean
  url?: string
  path?: string
  width?: number
}
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

export const initialFormValues: ArtworkFormValues = {
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
    artworkId: string
    artworkGlobalId: string
    dirtyFormCheckValues: ArtworkFormValues
    formValues: ArtworkFormValues
    meGlobalId: string
    lastUploadedPhoto?: Image
    artworkErrorOccurred: boolean
  }
  setFormValues: Action<MyCollectionArtworkModel, ArtworkFormValues>
  setDirtyFormCheckValues: Action<MyCollectionArtworkModel, ArtworkFormValues>
  resetForm: Action<MyCollectionArtworkModel>
  setArtistSearchResult: Action<MyCollectionArtworkModel, AutosuggestResult | null>
  setArtworkId: Action<MyCollectionArtworkModel, { artworkId: string; artworkGlobalId: string }>
  setMeGlobalId: Action<MyCollectionArtworkModel, string>
  setArtworkErrorOccurred: Action<MyCollectionArtworkModel, boolean>

  addPhotos: Action<MyCollectionArtworkModel, ArtworkFormValues["photos"]>
  removePhoto: Action<MyCollectionArtworkModel, ArtworkFormValues["photos"][0]>
  uploadPhotos: Thunk<MyCollectionArtworkModel, ArtworkFormValues["photos"], {}, AppStoreModel>
  uploadPhotosError: Thunk<MyCollectionArtworkModel, Error, {}, AppStoreModel>

  // Called from formik `onSubmit` handler
  addArtwork: Thunk<MyCollectionArtworkModel, ArtworkFormValues, {}, AppStoreModel>
  addArtworkComplete: Thunk<MyCollectionArtworkModel>
  addArtworkError: Action<MyCollectionArtworkModel, Error>

  startEditingArtwork: Thunk<
    MyCollectionArtworkModel,
    Partial<ArtworkFormValues> & {
      internalID: string
      id: string
      artist: { internalID: string }
      artistNames: string
      images: Image[]
    },
    {},
    AppStoreModel
  >
  editArtwork: Thunk<MyCollectionArtworkModel, ArtworkFormValues>
  editArtworkComplete: Thunk<MyCollectionArtworkModel, any>
  editArtworkError: Action<MyCollectionArtworkModel, Error> // FIXME: any

  confirmDeleteArtwork: Thunk<
    MyCollectionArtworkModel,
    // These arguments are passed to the `deleteArtwork` action below
    { artworkId: string; artworkGlobalId: string; startedLoading: () => void },
    AppStoreModel
  >
  deleteArtwork: Thunk<MyCollectionArtworkModel, { artworkId: string; artworkGlobalId: string }, {}, AppStoreModel>
  deleteArtworkComplete: Thunk<MyCollectionArtworkModel>
  deleteArtworkError: Action<MyCollectionArtworkModel, any>

  cancelAddEditArtwork: Thunk<MyCollectionArtworkModel, any, {}, AppStoreModel>
  takeOrPickPhotos: Thunk<MyCollectionArtworkModel, any, any, AppStoreModel>
}

export const MyCollectionArtworkModel: MyCollectionArtworkModel = {
  sessionState: {
    // The internalID of the artwork
    artworkId: "",
    dirtyFormCheckValues: initialFormValues,
    formValues: initialFormValues,
    artworkErrorOccurred: false,

    /**
     * TODO: this will likely be able to go away once we update our mutations to take
     * advantage of the new Relay v10 directive-based update model.
     * See https://github.com/facebook/relay/releases/tag/v10.0.0.
     *
     * The relay global ID of the `me` field, used to insert / delete edge post mutation.
     */
    meGlobalId: "",

    // TODO: This can likely go away once we update mutation API to relay 10
    // The relay global ID of the artwork so that, post-edit, we can update the view
    artworkGlobalId: "",
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

  setArtworkErrorOccurred: action((state, errorOccurred) => {
    state.sessionState.artworkErrorOccurred = errorOccurred
  }),

  /**
   * Photos
   */

  addPhotos: action((state, photos) => {
    state.sessionState.formValues.photos = uniqBy(state.sessionState.formValues.photos.concat(photos), "path")
  }),

  removePhoto: action((state, photoToRemove) => {
    state.sessionState.formValues.photos = state.sessionState.formValues.photos.filter(
      (photo) => photo.path !== photoToRemove.path || photo.url !== photoToRemove.url
    )
  }),

  uploadPhotos: thunk(async (actions, photos, { getState }) => {
    try {
      const state = getState()
      state.sessionState.lastUploadedPhoto = photos[0]
      // only recently added photos have a path
      const imagePaths = photos.filter((photo) => photo.path !== undefined).map((photo) => photo.path)
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
      return externalImageUrls
    } catch (error) {
      actions.uploadPhotosError(error)
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

  /**
   * TODO: Log to Sentry
   */
  uploadPhotosError: thunk(async (_actions, error) => {
    console.error("Error uploading photos", error)
    Alert.alert("Error uploading photos", "TODO better error message")
  }),

  /**
   * Add Artwork
   */

  addArtwork: thunk(
    async (actions, { artistSearchResult, artist, artistIds, costMinor, photos, ...payload }, { getState }) => {
      try {
        const state = getState()
        const input = cleanArtworkPayload(payload) as typeof payload
        state.sessionState.artworkErrorOccurred = false
        state.sessionState.lastUploadedPhoto = undefined // reset locally stored photo
        const externalImageUrls = await actions.uploadPhotos(photos)

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
    actions.setArtworkErrorOccurred(false)
    actions.resetForm()
  }),

  /**
   * TODO: Log to Sentry
   */
  addArtworkError: action((state, error) => {
    state.sessionState.artworkErrorOccurred = true
    console.error("Add artwork error", error)
    Alert.alert("Error adding artwork", "TODO add better message")
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
      artistSearchResult: {
        internalID: artwork?.artist?.internalID,
        displayLabel: artwork?.artistNames,
        imageUrl: artwork?.images?.find((i) => i.isDefault)?.url?.replace(":version", "square"),
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
      photos: artwork.images,
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
      actions.setArtworkErrorOccurred(false)

      try {
        const { sessionState } = getState()
        const input = cleanArtworkPayload(payload) as typeof payload

        const externalImageUrls = await actions.uploadPhotos(photos)

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
              artworkId: sessionState.artworkId,
              // Cooerce type for MP
              costMinor: Number(costMinor),

              externalImageUrls,
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
          onCompleted: () => actions.editArtworkComplete(),
          onError: (error) => actions.editArtworkError(error),
        })
      } catch (error) {
        console.error("Error updating artwork", error)
        actions.editArtworkError(error)
      }
    }
  ),

  editArtworkComplete: thunk((actions) => {
    actions.setArtworkErrorOccurred(false)
    actions.resetForm()
  }),

  /**
   * TODO: Log error to Sentry
   */
  editArtworkError: action((state, error) => {
    state.sessionState.artworkErrorOccurred = true
    console.error("Edit artwork error", error)
    Alert.alert("Error editing artwork", "TODO add better message")
  }),

  /**
   * Delete Artwork
   */

  confirmDeleteArtwork: thunk((actions, input) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: "Delete artwork?",
        options: ["Delete", "Cancel"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          actions.deleteArtwork({
            artworkId: input.artworkId,
            artworkGlobalId: input.artworkGlobalId,
          })
          input.startedLoading()
        }
      }
    )
  }),

  deleteArtwork: thunk(async (actions, input) => {
    try {
      // TODO: Does deleting an artwork also remove associated artworks?

      commitMutation<MyCollectionArtworkModelDeleteArtworkMutation>(defaultEnvironment, {
        mutation: graphql`
          mutation MyCollectionArtworkModelDeleteArtworkMutation($input: MyCollectionDeleteArtworkInput!) {
            myCollectionDeleteArtwork(input: $input) {
              artworkOrError {
                ... on MyCollectionArtworkMutationDeleteSuccess {
                  success
                }

                # TODO: Handle error
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

        // TODO: Revist this once we update with new Relay v10 mutation API
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
        onCompleted: () => actions.deleteArtworkComplete(),
        onError: actions.deleteArtworkError,
      })
    } catch (error) {
      console.error("Error updating artwork", error)
      actions.editArtworkError(error)
    }
  }),

  deleteArtworkComplete: thunk((actions) => {
    actions.setArtworkErrorOccurred(false)
    actions.resetForm()
  }),

  /**
   * TODO: Log error to Sentry
   */
  deleteArtworkError: action((state, error) => {
    state.sessionState.artworkErrorOccurred = true
    console.error("Error deleting artwork", error)
    Alert.alert("Error deleting artwork", "TODO add better message")
  }),

  cancelAddEditArtwork: thunk((actions, _payload, { getState, getStoreActions, getStoreState }) => {
    const modalType = getStoreState().myCollection.navigation.sessionState.modalType
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
      // avoid edit form values leaking into add artwork forms
      if (modalType === "edit") {
        actions.resetForm()
      }
      navigationActions.dismissModal()
    }
  }),
}

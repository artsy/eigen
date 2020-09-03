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

export interface ArtworkFormValues {
  artist: string
  artistIds: string[]
  artistSearchResult: AutosuggestResult | null
  date: string
  depth: string
  height: string
  medium: string
  photos: Image[]
  title: string
  width: string
}

const initialFormValues: ArtworkFormValues = {
  artist: "",
  artistIds: [],
  artistSearchResult: null,
  date: "",
  depth: "",
  height: "",
  medium: "",
  photos: [],
  title: "",
  width: "",
}

export interface MyCollectionArtworkModel {
  sessionState: {
    formValues: ArtworkFormValues
    artworkId: string
    artworkGlobalId: string
  }
  setFormValues: Action<MyCollectionArtworkModel, ArtworkFormValues>
  resetForm: Action<MyCollectionArtworkModel>
  setArtistSearchResult: Action<MyCollectionArtworkModel, AutosuggestResult | null>
  setArtworkId: Action<MyCollectionArtworkModel, { artworkId: string; artworkGlobalId: string }>

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
  },

  setFormValues: action((state, input) => {
    state.sessionState.formValues = input
  }),

  resetForm: action(state => {
    state.sessionState.formValues = initialFormValues
  }),

  setArtworkId: action((state, { artworkId, artworkGlobalId }) => {
    state.sessionState.artworkId = artworkId
    state.sessionState.artworkGlobalId = artworkGlobalId
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
      photo => photo.path !== photoToRemove.path
    )
  }),

  addArtwork: thunk(async (actions, input) => {
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
                      artistNames
                      medium
                      internalID
                      slug
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          input: {
            artistIds: [input!.artistSearchResult!.internalID as string],
            depth: input.depth,
            height: input.height,
            medium: input.medium,
            title: input.title,
            width: input.width,
            date: input.date,
          },
        },
        updater: store => {
          const payload = store
            .getRootField("myCollectionCreateArtwork")
            .getLinkedRecord("artworkOrError")
            .getLinkedRecord("artworkEdge")

          // Use me.id's globalID which is the parent to `myCollectionConnection`
          const parentID = store.get("TWU6NTg4MjhiMWU5YzE4ZGIzMGYzMDAyZmJh")

          if (parentID) {
            const connection = ConnectionHandler.getConnection(
              parentID,
              "MyCollectionArtworkList_myCollectionConnection"
            )
            if (connection) {
              ConnectionHandler.insertEdgeBefore(connection, payload)
            }
          }
        },
        onCompleted: () => actions.addArtworkComplete(),
        onError: error => actions.addArtworkError(error),
      })
    } catch (error) {
      console.error("Error adding artwork", error)
      actions.addArtworkError(error)
    }
  }),

  addArtworkComplete: thunk(actions => {
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
    const dimensions = artwork.dimensions.in ?? ""
    const [height = "", width = "", depth = ""] = dimensions
      .replace("in", "") // FIXME: currently this only supports inches
      .split("×")
      .map((dimension: string) => dimension.trim())

    actions.setArtworkId({
      artworkId: artwork.internalID,
      artworkGlobalId: artwork.id,
    })

    actions.setFormValues({
      // @ts-ignore
      artistSearchResult: {
        internalID: artwork.artist.internalID,
        displayLabel: artwork.artistNames,
        imageUrl: artwork.image.url.replace(":version", "square"),
      },
      date: artwork.date,
      depth,
      height,
      medium: artwork.medium,
      photos: [],
      title: artwork.title,
      width,
    })
  }),

  editArtwork: thunk(async (actions, input, { getState }) => {
    try {
      const { sessionState } = getState()

      commitMutation<MyCollectionArtworkModelUpdateArtworkMutation>(defaultEnvironment, {
        mutation: graphql`
          mutation MyCollectionArtworkModelUpdateArtworkMutation($input: MyCollectionUpdateArtworkInput!) {
            myCollectionUpdateArtwork(input: $input) {
              artworkOrError {
                ... on MyCollectionArtworkMutationSuccess {
                  artwork {
                    medium
                    id
                    internalID
                  }
                }
              }
            }
          }
        `,
        variables: {
          input: {
            artistIds: [input!.artistSearchResult!.internalID as string],
            artworkId: sessionState.artworkId,
            date: input.date,
            depth: input.depth,
            height: input.height,
            medium: input.medium,
            title: input.title,
            width: input.width,
          },
        },
        updater: store => {
          const artwork = store.get(sessionState.artworkGlobalId)
          artwork!.setValue(input.artistSearchResult?.displayLabel, "artistNames")
          artwork!.setValue(input.date, "date")
          artwork!.setValue(input.depth, "depth")
          artwork!.setValue(input.height, "height")
          artwork!.setValue(input.medium, "medium")
          artwork!.setValue(input.title, "title")
          artwork!.setValue(input.width, "width")
        },
        onCompleted: response => {
          actions.editArtworkComplete(response)
          actions.resetForm()
        },
        onError: error => actions.editArtworkError(error),
      })
    } catch (error) {
      console.error("Error updating artwork", error)
      actions.editArtworkError(error)
    }
  }),

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
      buttonIndex => {
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
              updater: store => {
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
    const formIsDirty = !isEqual(getState().sessionState.formValues, initialFormValues)

    if (formIsDirty) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: "You sure?",
          options: ["Discard", "Keep editing"],
          destructiveButtonIndex: 0,
          cancelButtonIndex: 1,
        },
        buttonIndex => {
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
      async buttonIndex => {
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

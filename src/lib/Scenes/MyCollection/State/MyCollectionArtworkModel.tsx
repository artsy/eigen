import { Action, action, thunk, Thunk } from "easy-peasy"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { AutosuggestResult } from "lib/Scenes/Search/AutosuggestResults"
import { AppStoreModel } from "lib/store/AppStoreModel"
import { isEqual } from "lodash"
import { uniqBy } from "lodash"
import { ActionSheetIOS } from "react-native"
import ImagePicker, { Image } from "react-native-image-crop-picker"
import { commitMutation } from "react-relay"
import { ConnectionHandler } from "relay-runtime"

import { MyCollectionCreateArtworkMutation as IMyCollectionCreateArtworkMutation } from "__generated__/MyCollectionCreateArtworkMutation.graphql"
import { MyCollectionUpdateArtworkMutation as IMyCollectionUpdateArtworkMutation } from "__generated__/MyCollectionUpdateArtworkMutation.graphql"
import { MyCollectionCreateArtworkMutation } from "../Screens/AddArtwork/Mutations/MyCollectionCreateArtworkMutation"
import { MyCollectionUpdateArtworkMutation } from "../Screens/AddArtwork/Mutations/MyCollectionUpdateArtworkMutation"

export interface ArtworkFormValues {
  artist: string
  artistIds: string[]
  artistSearchResult: AutosuggestResult | null
  medium: string
  photos: Image[]
  dimensions: string
  title: string
  year: string
}

const initialFormValues: ArtworkFormValues = {
  artist: "",
  artistSearchResult: null,
  artistIds: [],
  medium: "",
  photos: [],
  dimensions: "",
  title: "",
  year: "",
}

export interface MyCollectionArtworkModel {
  sessionState: {
    formValues: ArtworkFormValues
    artworkId: string
  }
  setFormValues: Action<MyCollectionArtworkModel, ArtworkFormValues>
  resetForm: Action<MyCollectionArtworkModel>
  setArtistSearchResult: Action<MyCollectionArtworkModel, AutosuggestResult | null>
  setArtworkId: Action<MyCollectionArtworkModel, string>

  addPhotos: Action<MyCollectionArtworkModel, ArtworkFormValues["photos"]>
  removePhoto: Action<MyCollectionArtworkModel, ArtworkFormValues["photos"][0]>

  // Called from formik `onSubmit` handler
  addArtwork: Thunk<MyCollectionArtworkModel, ArtworkFormValues>
  addArtworkComplete: Action<MyCollectionArtworkModel, any> // FIXME: any
  addArtworkError: Action<MyCollectionArtworkModel, any> // FIXME: any

  startEditingArtwork: Thunk<MyCollectionArtworkModel, any, {}, AppStoreModel>
  editArtwork: Thunk<MyCollectionArtworkModel, ArtworkFormValues>
  editArtworkComplete: Action<MyCollectionArtworkModel, any> // FIXME: any
  editArtworkError: Action<MyCollectionArtworkModel, any> // FIXME: any

  cancelAddEditArtwork: Thunk<MyCollectionArtworkModel, any, {}, AppStoreModel>
  takeOrPickPhotos: Thunk<MyCollectionArtworkModel, any, any, AppStoreModel>
}

export const MyCollectionArtworkModel: MyCollectionArtworkModel = {
  sessionState: {
    formValues: initialFormValues,
    artworkId: "",
  },

  setFormValues: action((state, input) => {
    state.sessionState.formValues = input
  }),

  resetForm: action(state => {
    state.sessionState.formValues = initialFormValues
  }),

  setArtworkId: action((state, artworkId) => {
    state.sessionState.artworkId = artworkId
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

  // FIXME: Rename to createArtwork to match graphql type
  addArtwork: thunk(async (actions, input) => {
    try {
      commitMutation<IMyCollectionCreateArtworkMutation>(defaultEnvironment, {
        // tslint:disable-next-line:relay-operation-generics
        mutation: MyCollectionCreateArtworkMutation,
        variables: {
          input: {
            artistIds: [input!.artistSearchResult!.internalID as string],
            medium: input.medium,
            dimensions: input.dimensions,
          },
        },
        onCompleted: response => {
          actions.addArtworkComplete(response)
          actions.resetForm()
        },
        updater: store => {
          const payload = store
            .getRootField("myCollectionCreateArtwork")
            .getLinkedRecord("artworkOrError")
            .getLinkedRecord("artworkEdge")
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
        onError: error => actions.addArtworkError(error),
        configs: [
          {
            type: "RANGE_ADD",
            parentID: "TWU6NTg4MjhiMWU5YzE4ZGIzMGYzMDAyZmJh",
            connectionInfo: [
              {
                key: "MyCollectionArtworkList_myCollectionConnection",
                rangeBehavior: "prepend",
              },
            ],
            edgeName: "artworkEdge",
          },
        ],
      })
    } catch (error) {
      console.error("Error adding artwork", error)
      actions.addArtworkError(error)
    }
  }),

  addArtworkComplete: action(() => {
    console.log("Add artwork complete")
  }),

  addArtworkError: action(() => {
    console.log("Add artwork error")
  }),

  /**
   * Edit Artwork
   */

  startEditingArtwork: thunk((actions, artwork) => {
    actions.setArtworkId(artwork.internalID)
    actions.setFormValues({
      artistSearchResult: {
        internalID: artwork.artist.internalID,
        displayLabel: artwork.artistNames,
        imageUrl: artwork.image.url.replace(":version", "square"),
      },
      dimensions: "small", // FIXME: Fill out
      medium: artwork.medium,
      photos: [],
      title: artwork.title,
      year: artwork.year,
    } as any)
  }),

  //  FIXME: Rename to updateArtwork to match graphql type
  editArtwork: thunk(async (actions, input, { getState }) => {
    try {
      commitMutation<IMyCollectionUpdateArtworkMutation>(defaultEnvironment, {
        // tslint:disable-next-line:relay-operation-generics
        mutation: MyCollectionUpdateArtworkMutation,
        variables: {
          input: {
            artworkId: getState().sessionState.artworkId,
            artistIds: [input!.artistSearchResult!.internalID as string],
            medium: input.medium,
            // date: input.date,
            // title: input.title,
          },
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

  editArtworkError: action(() => {
    console.log("Edit artwork error")
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

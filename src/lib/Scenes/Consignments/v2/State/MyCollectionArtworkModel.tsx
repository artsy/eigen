import { Action, action, thunk, Thunk } from "easy-peasy"
import { isEqual } from "lodash"
import { uniqBy } from "lodash"
import { ActionSheetIOS } from "react-native"
import ImagePicker, { Image } from "react-native-image-crop-picker"

import { AutosuggestResult } from "lib/Scenes/Search/AutosuggestResults"
import { AppStoreModel } from "lib/store/AppStoreModel"

// TODO: Uncomment once we have MP queries
// import { commitMutation } from "react-relay"
// import { defaultEnvironment } from "lib/relay/createEnvironment"
// import { MyCollectionAddArtworkMutation } from "../Screens/MyCollectionAddArtwork/Mutations/MyCollectionAddArtworkMutation"
// import { MyCollectionEditArtworkMutation } from "../Screens/MyCollectionAddArtwork/Mutations/MyCollectionEditArtworkMutation"

export interface ArtworkFormValues {
  artist: string
  artistSearchResult: AutosuggestResult | null
  medium: string
  photos: Image[]
  size: string
  title: string
  year: string
}

const initialFormValues: ArtworkFormValues = {
  artist: "",
  artistSearchResult: null,
  medium: "",
  photos: [],
  size: "",
  title: "",
  year: "",
}

export interface MyCollectionArtworkModel {
  sessionState: {
    formValues: ArtworkFormValues
  }
  setFormValues: Action<MyCollectionArtworkModel, ArtworkFormValues>
  setArtistSearchResult: Action<MyCollectionArtworkModel, AutosuggestResult | null>

  addPhotos: Action<MyCollectionArtworkModel, ArtworkFormValues["photos"]>
  removePhoto: Action<MyCollectionArtworkModel, ArtworkFormValues["photos"][0]>

  addArtwork: Thunk<MyCollectionArtworkModel, ArtworkFormValues>
  addArtworkComplete: Action<MyCollectionArtworkModel>
  addArtworkError: Action<MyCollectionArtworkModel>

  editArtwork: Thunk<MyCollectionArtworkModel, ArtworkFormValues>
  editArtworkComplete: Action<MyCollectionArtworkModel>
  editArtworkError: Action<MyCollectionArtworkModel>

  cancelAddEditArtwork: Thunk<MyCollectionArtworkModel, any, {}, AppStoreModel>
  takeOrPickPhotos: Thunk<MyCollectionArtworkModel, any, any, AppStoreModel>
}

export const MyCollectionArtworkModel: MyCollectionArtworkModel = {
  sessionState: {
    formValues: initialFormValues,
  },

  setFormValues: action((state, input) => {
    state.sessionState.formValues = input
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

  addArtwork: thunk(async (actions, _input) => {
    actions.addArtworkComplete()

    // TODO: Wire up when we've got real queries
    /*
    try {
      commitMutation(defaultEnvironment, {
        query: MyCollectionAddArtworkMutation, // FIXME: Add real mutation once we've completed Gravity API
        variables: { input },
        onCompleted: actions.addArtworkComplete,
        onError: actions.addArtworkError,
      } as any) // FIXME: any
    } catch (error) {
      console.error("Error adding artwork", error)
      actions.addArtworkError()
    }
    */
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

  editArtwork: thunk(async (actions, _input) => {
    actions.editArtworkComplete()
    // TODO: Wire up when we've got real queries
    /*
    try {
      await commitMutation(defaultEnvironment, {
        query: MyCollectionEditArtworkMutation, // FIXME: Add real mutation once we've completed Gravity API
        variables: { input },
        onCompleted: actions.editArtworkComplete,
        onError: actions.editArtworkError,
      } as any) // FIXME: any
    } catch (error) {
      console.error("Error editing artwork", error)
      actions.editArtworkError()
    }
    */
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

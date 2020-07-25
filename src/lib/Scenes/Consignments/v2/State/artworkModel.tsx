import { Action, action, thunk, Thunk } from "easy-peasy"
import { isEqual } from "lodash"
import { uniqBy } from "lodash"
import { ActionSheetIOS } from "react-native"
import ImagePicker, { Image } from "react-native-image-crop-picker"

import { AutosuggestResult } from "lib/Scenes/Search/AutosuggestResults"
import { StoreModel } from "./store"

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

export interface ArtworkModel {
  formValues: ArtworkFormValues
  setFormValues: Action<ArtworkModel, ArtworkFormValues>
  setArtistSearchResult: Action<ArtworkModel, AutosuggestResult | null>

  addPhotos: Action<ArtworkModel, ArtworkFormValues["photos"]>
  removePhoto: Action<ArtworkModel, ArtworkFormValues["photos"][0]>

  addArtwork: Thunk<ArtworkModel, ArtworkFormValues>
  addArtworkComplete: Action<ArtworkModel>
  addArtworkError: Action<ArtworkModel>

  editArtwork: Thunk<ArtworkModel, ArtworkFormValues>
  editArtworkComplete: Action<ArtworkModel>
  editArtworkError: Action<ArtworkModel>

  cancelAddEditArtwork: Thunk<ArtworkModel, any, {}, StoreModel>
  takeOrPickPhotos: Thunk<ArtworkModel, any, any, StoreModel>
}

export const artworkModel: ArtworkModel = {
  formValues: initialFormValues,

  setFormValues: action((state, input) => {
    state.formValues = input
  }),

  setArtistSearchResult: action((state, artistSearchResult) => {
    state.formValues.artistSearchResult = artistSearchResult

    if (artistSearchResult == null) {
      state.formValues.artist = "" // reset search input field
    }
  }),

  addPhotos: action((state, photos) => {
    state.formValues.photos = uniqBy(state.formValues.photos.concat(photos), "path")
  }),

  removePhoto: action((state, photoToRemove) => {
    state.formValues.photos = state.formValues.photos.filter(photo => photo.path !== photoToRemove.path)
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
    const navigationActions = getStoreActions().navigation
    const formIsDirty = !isEqual(getState().formValues, initialFormValues)

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

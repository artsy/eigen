import { Action, action, thunk, Thunk } from "easy-peasy"
import { AutosuggestResult } from "lib/Scenes/Search/AutosuggestResults"
import { GlobalStoreModel } from "lib/store/GlobalStoreModel"
import { uniqBy } from "lodash"
import { ActionSheetIOS } from "react-native"
import ImagePicker, { Image } from "react-native-image-crop-picker"

import { Metric } from "../Screens/ArtworkFormModal/Components/Dimensions"

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
    dirtyFormCheckValues: ArtworkFormValues
    formValues: ArtworkFormValues
    lastUploadedPhoto?: Image
    artworkErrorOccurred: boolean
  }
  setFormValues: Action<MyCollectionArtworkModel, ArtworkFormValues>
  setDirtyFormCheckValues: Action<MyCollectionArtworkModel, ArtworkFormValues>
  resetForm: Action<MyCollectionArtworkModel>
  setArtistSearchResult: Action<MyCollectionArtworkModel, AutosuggestResult | null>
  setArtworkId: Action<MyCollectionArtworkModel, { artworkId: string }>
  setArtworkErrorOccurred: Action<MyCollectionArtworkModel, boolean>
  setLastUploadedPhoto: Action<MyCollectionArtworkModel, Image>

  addPhotos: Action<MyCollectionArtworkModel, ArtworkFormValues["photos"]>
  removePhoto: Action<MyCollectionArtworkModel, ArtworkFormValues["photos"][0]>

  startEditingArtwork: Thunk<
    MyCollectionArtworkModel,
    Partial<ArtworkFormValues> & {
      internalID: string
      id: string
      artist: { internalID: string }
      artistNames: string
      image: { url: string }
    },
    {},
    GlobalStoreModel
  >

  takeOrPickPhotos: Thunk<MyCollectionArtworkModel, void, any, GlobalStoreModel>
}

export const MyCollectionArtworkModel: MyCollectionArtworkModel = {
  sessionState: {
    // The internalID of the artwork
    artworkId: "",
    dirtyFormCheckValues: initialFormValues,
    formValues: initialFormValues,
    artworkErrorOccurred: false,
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

  setArtworkId: action((state, { artworkId }) => {
    state.sessionState.artworkId = artworkId
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
      (photo) => photo.path !== photoToRemove.path
    )
  }),

  setLastUploadedPhoto: action((state, photo) => {
    state.sessionState.lastUploadedPhoto = photo
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
   * When user clicks the edit artwork button from detail view, we format
   * data the data from the detail into a form the edit form expects.
   */
  startEditingArtwork: thunk((actions, artwork) => {
    actions.setArtworkId({
      artworkId: artwork.internalID,
    })

    const editProps: any /* FIXME: any */ = {
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
}

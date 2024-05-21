import { MyCollectionArtwork_sharedProps$data } from "__generated__/MyCollectionArtwork_sharedProps.graphql"
import { ArtworkAttributionClassType } from "__generated__/myCollectionCreateArtworkMutation.graphql"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"
import { MyCollectionCustomArtistSchema } from "app/Scenes/MyCollection/Screens/Artist/AddMyCollectionArtist"
import { GlobalStoreModel } from "app/store/GlobalStoreModel"
import { getAttributionClassValueByName } from "app/utils/artworkRarityClassifications"
import { Action, action, thunk, Thunk } from "easy-peasy"
import { pick, uniqBy } from "lodash"

export interface Image {
  height?: number
  isDefault?: boolean
  imageURL?: string
  internalID?: string
  path?: string
  width?: number
  imageVersions?: string[]
}

export interface Location {
  city?: string | null
  state?: string | null
  country?: string | null
  countryCode?: string | null
}

export interface ArtworkFormValues {
  artist: string
  artistDisplayName?: string
  artistIds: string[]
  artistSearchResult: AutosuggestResult | null
  attributionClass: ArtworkAttributionClassType | undefined
  collectorLocation: Location | null | undefined
  category: string // this refers to "materials" in UI
  confidentialNotes: string | undefined
  customArtist: MyCollectionCustomArtistSchema | null
  date: string | undefined
  depth: string | undefined
  editionNumber: string | undefined
  editionSize: string | undefined
  height: string | undefined
  isEdition: boolean | null
  isP1Artist?: boolean
  medium: string | undefined
  metric: string | null
  photos: Image[]
  pricePaidCurrency: string
  pricePaidDollars: string
  provenance: string | undefined
  title: string
  width: string | undefined
}

export const initialFormValues: ArtworkFormValues = {
  artist: "",
  artistDisplayName: undefined,
  artistIds: [],
  artistSearchResult: null,
  attributionClass: undefined,
  category: "",
  collectorLocation: null,
  confidentialNotes: undefined,
  customArtist: null,
  date: undefined,
  depth: undefined,
  editionNumber: undefined,
  editionSize: undefined,
  height: undefined,
  isEdition: null,
  medium: undefined,
  metric: null,
  photos: [],
  pricePaidCurrency: "",
  pricePaidDollars: "",
  provenance: undefined,
  title: "",
  width: undefined,
}

export interface MyCollectionArtworkModel {
  sessionState: {
    artworkId: string
    dirtyFormCheckValues: ArtworkFormValues
    formValues: ArtworkFormValues
    artworkErrorOccurred: boolean
  }
  setFormValues: Action<MyCollectionArtworkModel, ArtworkFormValues>
  updateFormValues: Action<MyCollectionArtworkModel, Partial<ArtworkFormValues>>
  setDirtyFormCheckValues: Action<MyCollectionArtworkModel, ArtworkFormValues>
  resetForm: Action<MyCollectionArtworkModel>
  resetFormButKeepArtist: Action<MyCollectionArtworkModel>
  setArtistSearchResult: Action<MyCollectionArtworkModel, AutosuggestResult | null>
  setArtworkId: Action<MyCollectionArtworkModel, { artworkId: string }>
  setArtworkErrorOccurred: Action<MyCollectionArtworkModel, boolean>

  addPhotos: Action<MyCollectionArtworkModel, ArtworkFormValues["photos"]>
  removePhoto: Action<MyCollectionArtworkModel, ArtworkFormValues["photos"][0]>

  startEditingArtwork: Thunk<
    MyCollectionArtworkModel,
    Partial<MyCollectionArtwork_sharedProps$data> & {
      internalID: string
      id: string
      artist: { internalID: string; initials: string }
      artistNames: string
      images: Image[]
    },
    {},
    GlobalStoreModel
  >
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

  updateFormValues: action((state, input) => {
    state.sessionState.formValues = { ...state.sessionState.formValues, ...input }
  }),

  setDirtyFormCheckValues: action((state, values) => {
    state.sessionState.dirtyFormCheckValues = values
  }),

  resetForm: action((state) => {
    state.sessionState.formValues = initialFormValues
    state.sessionState.dirtyFormCheckValues = initialFormValues
  }),

  resetFormButKeepArtist: action((state) => {
    const artistValues = pick(state.sessionState.formValues, [
      "artist",
      "artistIds",
      "artistSearchResult",
      "customArtist",
    ])

    state.sessionState.formValues = { ...initialFormValues, ...artistValues }
    state.sessionState.dirtyFormCheckValues = { ...initialFormValues, ...artistValues }
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
    state.sessionState.formValues.photos = uniqBy(
      state.sessionState.formValues.photos.concat(photos),
      (photo) => photo.imageURL || photo.path
    )
  }),

  removePhoto: action((state, photoToRemove) => {
    state.sessionState.formValues.photos = state.sessionState.formValues.photos.filter(
      (photo) => photo.path !== photoToRemove.path || photo.imageURL !== photoToRemove.imageURL
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

    const pricePaidDollars = artwork.pricePaid ? artwork.pricePaid.minor / 100 : null

    const attributionClass = getAttributionClassValueByName(artwork?.attributionClass?.name)

    const editProps = {
      artistSearchResult: {
        internalID: artwork?.artist?.internalID,
        displayLabel: artwork?.artistNames,
        imageUrl: artwork?.images?.[0]?.imageURL?.replace(":version", "square"),
        formattedNationalityAndBirthday: artwork?.artist?.formattedNationalityAndBirthday,
        initials: artwork?.artist?.initials,
      } as AutosuggestResult,
      attributionClass,
      category: artwork.category,
      confidentialNotes: artwork.confidentialNotes,
      date: artwork.date,
      depth: artwork.depth,
      pricePaidDollars: pricePaidDollars?.toString() ?? "",
      pricePaidCurrency: artwork.pricePaid?.currencyCode ?? "",
      editionSize: artwork.editionSize,
      editionNumber: artwork.editionNumber,
      height: artwork.height,
      isEdition: artwork.isEdition,
      medium: artwork.medium,
      metric: artwork.metric,
      photos: artwork.images,
      title: artwork.title,
      width: artwork.width,
      collectorLocation: artwork.collectorLocation,
      provenance: artwork.provenance,
    }

    // @ts-expect-error TODO: Fix this
    actions.setFormValues(editProps)

    // Baseline to check if we can cancel edit without showing
    // iOS action sheet confirmation
    // @ts-expect-error TODO: Fix this
    actions.setDirtyFormCheckValues(editProps)
  }),
}

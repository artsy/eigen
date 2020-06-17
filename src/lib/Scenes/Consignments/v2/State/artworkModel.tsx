import { Action, action, thunk, Thunk } from "easy-peasy"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { commitMutation } from "react-relay"
import { MyCollectionAddArtworkMutation } from "../Screens/MyCollectionAddArtwork/Mutations/MyCollectionAddArtworkMutation"
import { MyCollectionEditArtworkMutation } from "../Screens/MyCollectionAddArtwork/Mutations/MyCollectionEditArtworkMutation"

export interface ArtworkFormValues {
  artist: string
  title: string
  year: string
}

export interface ArtworkModel {
  formValues: ArtworkFormValues
  setFormValues: Action<ArtworkModel, ArtworkFormValues>

  addArtwork: Thunk<ArtworkModel, ArtworkFormValues>
  addArtworkComplete: Action<ArtworkModel>
  addArtworkError: Action<ArtworkModel>

  editArtwork: Thunk<ArtworkModel, ArtworkFormValues>
  editArtworkComplete: Action<ArtworkModel>
  editArtworkError: Action<ArtworkModel>
}

export const artworkModel: ArtworkModel = {
  formValues: {
    artist: "",
    title: "",
    year: "",
  },

  setFormValues: action((state, input) => {
    state.formValues = input
  }),

  /**
   * Add Artwork
   */

  addArtwork: thunk(async (actions, input) => {
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

  editArtwork: thunk(async (actions, input) => {
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
  }),

  editArtworkComplete: action(() => {
    console.log("Edit artwork complete")
  }),

  editArtworkError: action(() => {
    console.log("Edit artwork error")
  }),
}

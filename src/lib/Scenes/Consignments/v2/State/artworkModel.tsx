import { Action, action, thunk, Thunk } from "easy-peasy"
import { FormikProps } from "formik"
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
  formik: FormikProps<any> | null
  initializeFormik: Action<ArtworkModel, FormikProps<any>>

  addArtwork: Thunk<ArtworkModel, ArtworkFormValues>
  addArtworkComplete: Action<ArtworkModel>
  addArtworkError: Action<ArtworkModel>

  editArtwork: Thunk<ArtworkModel, ArtworkFormValues>
  editArtworkComplete: Action<ArtworkModel>
  editArtworkError: Action<ArtworkModel>
}

export const artworkModel: ArtworkModel = {
  formik: null,

  initializeFormik: action((state, formik) => {
    state.formik = formik
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
      console.error("Error creating artwork", error)
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

  editArtwork: thunk(async (actions, inputPayload) => {
    try {
      await commitMutation(defaultEnvironment, {
        query: MyCollectionEditArtworkMutation, // FIXME: Add real mutation once we've completed Gravity API
        variables: { input: inputPayload },
        onCompleted: actions.editArtworkComplete,
        onError: actions.editArtworkError,
      } as any) // FIXME: any
    } catch (error) {
      console.error("Error creating artwork", error)
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

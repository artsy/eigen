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

export interface ArtworkState {
  formik: FormikProps<any> | null
  initializeFormik: Action<ArtworkState, FormikProps<any>>

  addArtwork: Thunk<ArtworkState, ArtworkFormValues>
  addArtworkComplete: Action<ArtworkState>
  addArtworkError: Action<ArtworkState>

  editArtwork: Thunk<ArtworkState, ArtworkFormValues>
  editArtworkComplete: Action<ArtworkState>
  editArtworkError: Action<ArtworkState>
}

export const artworkState: ArtworkState = {
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
        // FIXME: Add real mutation once we've completed Gravity API
        query: MyCollectionAddArtworkMutation,
        variables: {
          input,
        },
        onCompleted: () => {
          actions.addArtworkComplete()
        },
        onError: () => {
          actions.addArtworkError()
        },
        // FIXME: any
      } as any)
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
        // FIXME: Add real mutation once we've completed Gravity API
        query: MyCollectionEditArtworkMutation,
        variables: {
          input: inputPayload,
        },
        onCompleted: () => {
          actions.editArtworkComplete()
        },
        onError: () => {
          actions.editArtworkError()
        },
        // FIXME: any
      } as any)
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

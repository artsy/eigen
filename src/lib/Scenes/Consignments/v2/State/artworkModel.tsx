import { Action, action, thunk, Thunk } from "easy-peasy"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { isEqual } from "lodash"
import { ActionSheetIOS } from "react-native"
import { commitMutation } from "react-relay"
import { MyCollectionAddArtworkMutation } from "../Screens/MyCollectionAddArtwork/Mutations/MyCollectionAddArtworkMutation"
import { MyCollectionEditArtworkMutation } from "../Screens/MyCollectionAddArtwork/Mutations/MyCollectionEditArtworkMutation"
import { StoreModel } from "./store"

export interface ArtworkFormValues {
  artist: string
  medium: string
  size: string
  title: string
  year: string
}

const initialFormValues: ArtworkFormValues = {
  artist: "",
  medium: "",
  size: "",
  title: "",
  year: "",
}

export interface ArtworkModel {
  formValues: ArtworkFormValues
  setFormValues: Action<ArtworkModel, ArtworkFormValues>

  addArtwork: Thunk<ArtworkModel, ArtworkFormValues>
  addArtworkCancel: Thunk<ArtworkModel, {}, {}, StoreModel>
  addArtworkComplete: Action<ArtworkModel>
  addArtworkError: Action<ArtworkModel>

  editArtwork: Thunk<ArtworkModel, ArtworkFormValues>
  editArtworkComplete: Action<ArtworkModel>
  editArtworkError: Action<ArtworkModel>
}

export const artworkModel: ArtworkModel = {
  formValues: initialFormValues,

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

  addArtworkCancel: thunk((actions, _payload, { getState, getStoreActions }) => {
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

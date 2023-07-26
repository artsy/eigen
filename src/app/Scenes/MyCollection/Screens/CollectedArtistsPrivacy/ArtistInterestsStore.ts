import { Action, action, createContextStore } from "easy-peasy"

export type UserInterestInput = {
  id: String
  private: boolean
}

interface ArtistInterestsStoreModel {
  userInterestsPrivacy: UserInterestInput[]

  addOrUpdateUserInterest: Action<this, UserInterestInput>
}

const ArtistInterestsStoreModel: ArtistInterestsStoreModel = {
  userInterestsPrivacy: [],

  addOrUpdateUserInterest: action((state, input) => {
    const newUserInterestsPrivacy = [...state.userInterestsPrivacy]
    const userInterestIndex = newUserInterestsPrivacy.findIndex(
      (userInterest) => userInterest.id === input.id
    )
    if (userInterestIndex > -1) {
      newUserInterestsPrivacy[userInterestIndex].private = input.private
      state.userInterestsPrivacy = newUserInterestsPrivacy
    } else {
      newUserInterestsPrivacy.push(input)
      state.userInterestsPrivacy = newUserInterestsPrivacy
    }
  }),
}

export const ArtistInterestsStore = createContextStore(ArtistInterestsStoreModel)

export const ArtistInterestsStoreProvider = ArtistInterestsStore.Provider

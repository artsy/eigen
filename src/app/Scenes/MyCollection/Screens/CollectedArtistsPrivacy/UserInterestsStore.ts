import { Action, action, createContextStore } from "easy-peasy"

export type UserInterestInput = {
  id: String
  private: boolean
}

interface UserInterestsStoreModel {
  userInterests: UserInterestInput[]

  addOrUpdateUserInterest: Action<this, UserInterestInput>
}

const UserInterestsStoreModel: UserInterestsStoreModel = {
  userInterests: [],

  addOrUpdateUserInterest: action((state, input) => {
    const newUserInterests = [...state.userInterests]
    const userInterestIndex = newUserInterests.findIndex(
      (userInterest) => userInterest.id === input.id
    )
    if (userInterestIndex > -1) {
      newUserInterests[userInterestIndex].private = input.private
      state.userInterests = newUserInterests
    } else {
      newUserInterests.push(input)
      state.userInterests = newUserInterests
    }
  }),
}

export const UserInterestsStore = createContextStore(UserInterestsStoreModel)

export const UserInterestsStoreProvider = UserInterestsStore.Provider

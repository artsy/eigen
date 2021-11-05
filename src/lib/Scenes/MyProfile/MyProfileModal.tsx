import { action, Action } from "easy-peasy"

export interface MyProfileModal {
  profileIconPath?: string
  setProfileIconPath: Action<MyProfileModal, string>
}

export const getMyProfileModal = (): MyProfileModal => ({
  profileIconPath: "",
  setProfileIconPath: action((state, photo) => {
    state.profileIconPath = photo
  }),
})

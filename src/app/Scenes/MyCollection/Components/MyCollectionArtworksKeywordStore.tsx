import { Action, action, createContextStore } from "easy-peasy"

interface MyCollectionArtworksKeywordStore {
  keyword: string
  setKeyword: Action<this, string>
}

const MyCollectionArtworksKeywordModel: MyCollectionArtworksKeywordStore = {
  keyword: "",
  setKeyword: action((state, keyword) => {
    state.keyword = keyword
  }),
}

export const MyCollectionArtworksKeywordStore =
  createContextStore<MyCollectionArtworksKeywordStore>(MyCollectionArtworksKeywordModel)

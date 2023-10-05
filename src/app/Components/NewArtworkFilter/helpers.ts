export enum NewFilterParamName {
  artistIDs = "artistIDs",
  attributionClass = "rarity",
  categories = "categories",
}

export type NewFilterData =
  | {
      paramName: NewFilterParamName.artistIDs
      paramValue: {
        value: string
        displayLabel: string
      }
    }
  | {
      paramName: NewFilterParamName.attributionClass
      paramValue: {
        value: string
        displayLabel: string
      }
    }
  | {
      paramName: NewFilterParamName.categories
      paramValue: {
        value: string
        displayLabel: string
      }
    }

export const paramNameToDisplayLabelMap = {
  attributionClass: "Rarity",
  categories: "Categories",
}

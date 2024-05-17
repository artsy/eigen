import { ConsignmentSubmissionCategoryAggregation } from "__generated__/createConsignSubmissionMutation.graphql"
import { SelectOption } from "app/Components/Select"
import { artworkMediumCategories } from "app/utils/artworkMediumCategories"
import { compact } from "lodash"

type AcceptableValuesMapKey = Exclude<
  ConsignmentSubmissionCategoryAggregation,
  "%future added value"
>

export type AcceptableCategoryValue = AcceptableValuesMapKey

// By having this ACCEPTABLE_VALUES_MAP structure, we are forced to update this list
// whenever ConsignmentSubmissionCategoryAggregation changes, because yarn tsc will fail
export const ACCEPTABLE_CATEGORY_VALUES_MAP: Partial<
  Record<AcceptableValuesMapKey, AcceptableCategoryValue>
> = {
  OTHER: "OTHER",
  PAINTING: "PAINTING",
  DRAWING_COLLAGE_OR_OTHER_WORK_ON_PAPER: "DRAWING_COLLAGE_OR_OTHER_WORK_ON_PAPER",
  PHOTOGRAPHY: "PHOTOGRAPHY",
  PRINT: "PRINT",
  SCULPTURE: "SCULPTURE",
}

export const formatCategoryValueForSubmission = (categoryValue: string) => {
  return categoryValue
    .split(/[^A-Za-z]/)
    .reduce((accumulator, current) => {
      if (current && current.trim()) {
        accumulator.push(current.toUpperCase())
      }
      return accumulator
    }, [] as string[])
    .join("_") as AcceptableCategoryValue
}

export const acceptableCategoriesForSubmission = (): Array<
  SelectOption<AcceptableCategoryValue>
> => {
  const categories = artworkMediumCategories.map((medium) => {
    const newVal = formatCategoryValueForSubmission(medium.value)
    if (ACCEPTABLE_CATEGORY_VALUES_MAP[newVal]) {
      return { label: medium.label, value: newVal }
    }
    return null
  })
  return compact(categories)
}

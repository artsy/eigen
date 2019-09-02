import { includes, isBoolean, isNumber, isString } from "lodash"

// TODO: Is this still needed?
/**
 * Transforms a JS object into a a GraphQL object
 * @param obj the object to transform
 * @param enums an optional array of objects to treat as enums
 */
export const objectToGraphQLInput = (obj: any, enums?: string[]) => {
  let input = ""
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const element = obj[key]
      if ((includes(enums, key) && isString(element)) || isNumber(element) || isBoolean(element)) {
        input += key + `: ` + element + `, `
      } else if (isString(element)) {
        input += key + `: "` + element + `", `
      } else if (element) {
        // is probably an object at this point
        input += key + `: ` + objectToGraphQLInput(element) + ", "
      }
    }
  }
  return "{ " + input.substring(0, input.length - 2) + " }"
}

export default objectToGraphQLInput

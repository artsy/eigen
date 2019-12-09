import { ReactTestInstance } from "react-test-renderer"

export const extractText = (root: ReactTestInstance) => {
  let result = ""
  root.findAll(el => {
    // @ts-ignore
    if (el.type === "Text") {
      result += el.children[0]
    }
    return false
  })
  return result
}

import { ReactTestInstance } from "react-test-renderer"

export const extractText = (root: ReactTestInstance | string) => {
  if (typeof root === "string") {
    return root
  }
  let result = ""
  root.findAll(el => {
    // @ts-ignore
    if (el.type === "Text") {
      result += el.children.map(extractText).join("")
    }
    return false
  })
  return result
}

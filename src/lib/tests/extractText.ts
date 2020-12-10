import { ReactTestInstance } from "react-test-renderer"

export const extractText = (root: ReactTestInstance | string) => {
  if (typeof root === "string") {
    return root
  }
  let result = ""
  root.findAll((el) => {
    // @ts-expect-error
    if (el.type === "Text") {
      result += el.children.map(extractText).join("")
    }
    // @ts-expect-error
    if (el.type === "TextInput") {
      result += el.props.value ?? el.props.defaultValue ?? ""
    }
    return false
  })
  return result
}

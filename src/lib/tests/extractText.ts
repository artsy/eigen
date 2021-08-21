import { ReactTestInstance } from "react-test-renderer"

export const extractText = (root: ReactTestInstance | string | number): string => {
  if (typeof root === "string") {
    return root
  }

  if (typeof root === "number") {
    return root.toString()
  }

  return root.children.reduce((acc: string, child) => {
    return acc + extractText(child)
  }, "")
}

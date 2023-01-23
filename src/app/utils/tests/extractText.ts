import { ReactTestInstance } from "react-test-renderer"

/**
 * @deprecated avoid using this, use [byText](https://callstack.github.io/react-native-testing-library/docs/api-queries/#bytext) instead.
 */
export const extractText = (root: ReactTestInstance | string | number): string => {
  if (typeof root === "string") {
    return root
  }

  if (typeof root === "number") {
    return root.toString()
  }

  return root.children.reduce((acc: string, child) => {
    // @ts-ignore
    if (child.type === "TextInput") {
      // @ts-ignore
      return acc + child.props.value ?? ""
    }

    return acc + extractText(child)
  }, "")
}

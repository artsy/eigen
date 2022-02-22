/**
 * Test helper that takes a component and "snapshots" it, returning its
 * string and JSON representation. Useful for asserting tree contents.
 *
 *  @example
 *
 *  const { text }  = getTestSnapshot(<MyComponent title='Hi!' />)
 *  expect(text).toContain('Hi!')
 */
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import "react-native"

export function getTestWrapper(TestComponent: any /* STRICTNESS_MIGRATION */) {
  try {
    const snapshot = renderWithWrappers(TestComponent)
    const text = JSON.stringify(snapshot.toJSON())
    const json = snapshot.toTree()

    return {
      snapshot,
      text,
      json,
    }
  } catch (error) {
    console.warn(`utils/getTestWrapper | Error returning test wrapper`, error)
  }
}

/**
 * Test helper that takes a component and "snapshots" it, returning its
 * string representation. Useful for asserting tree contents. Cheaper than
 * the getTestWrapper
 *
 *  @example
 *
 *  const text = getTextTree(<MyComponent title='Hi!' />)
 *  expect(text).toContain('Hi!')
 */

export function getTextTree(TestComponent: any /* STRICTNESS_MIGRATION */) {
  const snapshot = renderWithWrappers(TestComponent)
  return JSON.stringify(snapshot.toJSON())
}

import { extractText } from "app/tests/extractText"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { Input } from "palette"
import { TouchableOpacity } from "react-native"
import { act, ReactTestInstance } from "react-test-renderer"

/** Press on a component of some type, matching some text, and wait for any side effects to complete.
 * @deprecated Use `fireEvent.press` instead.
 */
export const press = (
  ti: ReactTestInstance,
  {
    text = "",
    componentType = TouchableOpacity,
  }: {
    /** A string or RegExp (for exactness) to match - defaults to "" (everything) */
    text?: string | RegExp
    /** The type of component to search for - default TouchableOpacity */
    componentType?: React.ComponentType
  }
) => {
  const touchables = ti.findAllByType(componentType, { deep: true }).filter((t) => {
    return extractText(t).match(text)
  })
  const touchable = touchables[0]
  if (touchable && touchable.props.onPress) {
    act(() => {
      touchable.props.onPress()
    })
    return flushPromiseQueue()
  } else {
    return Promise.resolve()
  }
}

/** Find a single input within the test instance and type into it.
 * @deprecated Use `fireEvent.changeText` instead
 */
export const typeInInput = async (ti: ReactTestInstance, text: string) => {
  ti.findByType(Input).props.onChangeText(text)
  await flushPromiseQueue()
}

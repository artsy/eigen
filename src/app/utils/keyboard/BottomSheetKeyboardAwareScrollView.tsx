import {
  SCROLLABLE_TYPE,
  createBottomSheetScrollableComponent,
  type BottomSheetScrollViewMethods,
} from "@gorhom/bottom-sheet"
import { memo } from "react"
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from "react-native-keyboard-controller"
import Reanimated from "react-native-reanimated"
import type { BottomSheetScrollViewProps } from "@gorhom/bottom-sheet/src/components/bottomSheetScrollable/types"

const AnimatedScrollView =
  Reanimated.createAnimatedComponent<KeyboardAwareScrollViewProps>(KeyboardAwareScrollView)
const BottomSheetScrollViewComponent = createBottomSheetScrollableComponent<
  BottomSheetScrollViewMethods,
  BottomSheetScrollViewProps
>(SCROLLABLE_TYPE.SCROLLVIEW, AnimatedScrollView)
const BottomSheetKeyboardAwareScrollView = memo(BottomSheetScrollViewComponent)

BottomSheetKeyboardAwareScrollView.displayName = "BottomSheetKeyboardAwareScrollView"

export default BottomSheetKeyboardAwareScrollView as (
  props: BottomSheetScrollViewProps & KeyboardAwareScrollViewProps
) => ReturnType<typeof BottomSheetKeyboardAwareScrollView>

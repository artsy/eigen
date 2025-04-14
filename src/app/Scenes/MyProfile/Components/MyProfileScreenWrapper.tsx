import { Screen } from "@artsy/palette-mobile"
import { ScrollViewProps } from "react-native"

export const MyProfileScreenWrapper: React.FC<ScrollViewProps & { title: string }> = ({
  children,
  title,
  ...props
}) => {
  return (
    <Screen>
      <Screen.AnimatedHeader title={title} hideLeftElements />
      <Screen.StickySubHeader title={title} />
      <Screen.Body fullwidth>
        <Screen.ScrollView {...props}>{children}</Screen.ScrollView>
      </Screen.Body>
    </Screen>
  )
}

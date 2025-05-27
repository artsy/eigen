import { Button, Flex, Screen, useSpace } from "@artsy/palette-mobile"
import { goBack } from "app/system/navigation/navigate"
import { RefreshControlProps, ViewStyle } from "react-native"

export interface MyProfileScreenWrapperProps {
  title: string
  onPress?: () => void
  isValid?: boolean
  loading?: boolean
  hideLeftElements?: boolean
  contentContainerStyle?: ViewStyle
  RefreshControl?: React.ReactElement<RefreshControlProps>
}
export const MyProfileScreenWrapper: React.FC<MyProfileScreenWrapperProps> = ({
  children,
  title,
  onPress,
  isValid,
  loading,
  hideLeftElements = false,
  contentContainerStyle,
  RefreshControl,
}) => {
  const space = useSpace()

  return (
    <Screen>
      <Screen.AnimatedHeader title={title} hideLeftElements={hideLeftElements} onBack={goBack} />
      <Screen.StickySubHeader title={title} />
      <Screen.Body fullwidth>
        <Screen.ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            paddingTop: space(2),
            paddingHorizontal: space(2),
            ...contentContainerStyle,
          }}
          refreshControl={RefreshControl}
        >
          {children}
          {!!onPress && (
            <Flex my={2}>
              <Button block onPress={onPress} disabled={!isValid} loading={loading}>
                Save
              </Button>
            </Flex>
          )}
        </Screen.ScrollView>
      </Screen.Body>
    </Screen>
  )
}

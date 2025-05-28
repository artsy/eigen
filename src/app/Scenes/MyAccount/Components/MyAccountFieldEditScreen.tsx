import { Text } from "@artsy/palette-mobile"
import LoadingModal from "app/Components/Modals/LoadingModal"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { goBack } from "app/system/navigation/navigate"
import React, { useImperativeHandle, useRef, useState } from "react"
import {
  Alert,
  AlertButton,
  AlertOptions,
  AlertStatic,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
} from "react-native"

export interface MyAccountFieldEditScreen {
  scrollToEnd(): void
  save(): Promise<void>
}

export type AlertArgs = [
  title: string,
  message?: string,
  buttons?: AlertButton[],
  options?: AlertOptions,
]

export interface MyAccountFieldEditScreenProps {
  title: string
  canSave: boolean
  contentContainerStyle?: ViewStyle
  isSaveButtonVisible?: boolean
  onSave?(dismiss: () => void, alert: AlertStatic["alert"]): Promise<any> | undefined
}

export const MyAccountFieldEditScreen = React.forwardRef<
  { scrollToEnd(): void },
  React.PropsWithChildren<MyAccountFieldEditScreenProps>
>(({ children, canSave, onSave, isSaveButtonVisible, title, contentContainerStyle }, ref) => {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const afterLoadingAlert = useRef<AlertArgs>()
  const scrollViewRef = useRef<ScrollView>(null)

  const doTheAlert: AlertStatic["alert"] = (...args) => {
    afterLoadingAlert.current = args
  }

  const handleSave = async () => {
    if (!canSave) {
      return
    }
    // prevent any text input on the screen from grabbing focus again once the loading modal is dismissed
    Keyboard.dismiss()
    try {
      setIsSaving(true)
      if (!(isSaveButtonVisible === false) && onSave) {
        await onSave(goBack, doTheAlert)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
    }
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        scrollToEnd() {
          scrollViewRef.current?.scrollToEnd()
        },
        async save() {
          await handleSave()
        },
      }
    },
    []
  )

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <PageWithSimpleHeader
        left={
          <TouchableOpacity accessibilityRole="button" onPress={() => goBack()}>
            <Text variant="sm" textAlign="left">
              Cancel
            </Text>
          </TouchableOpacity>
        }
        title={title}
        right={
          !(isSaveButtonVisible === false) && (
            <TouchableOpacity
              disabled={!canSave}
              onPress={handleSave}
              accessibilityLabel="save-button"
            >
              <Text variant="sm" opacity={canSave ? 1 : 0.3}>
                Save
              </Text>
            </TouchableOpacity>
          )
        }
      >
        <ScrollView
          contentContainerStyle={[{ padding: 20, paddingBottom: 50 }, contentContainerStyle]}
          ref={scrollViewRef}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          {!!isSaving && (
            <LoadingModal
              isVisible
              onDismiss={() => {
                // Workaround for an iOS 14 issue, modal onDismiss is being called while the
                // view still appears to be in the hierarchy
                setTimeout(() => {
                  if (afterLoadingAlert.current) {
                    Alert.alert(...afterLoadingAlert.current)
                    afterLoadingAlert.current = undefined
                  }
                }, 150)
              }}
            />
          )}
          {children}
        </ScrollView>
      </PageWithSimpleHeader>
    </KeyboardAvoidingView>
  )
})

export const MyAccountFieldEditScreenPlaceholder: React.FC<{ title: string }> = ({
  children,
  title,
}) => (
  <MyAccountFieldEditScreen isSaveButtonVisible={false} canSave={false} title={title}>
    {children}
  </MyAccountFieldEditScreen>
)

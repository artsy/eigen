import LoadingModal from "lib/Components/Modals/LoadingModal"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { goBack } from "lib/navigation/navigate"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Sans } from "palette"
import React, { useImperativeHandle, useRef, useState } from "react"
import {
  Alert,
  AlertButton,
  AlertOptions,
  AlertStatic,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
} from "react-native"

export interface MyAccountFieldEditScreen {
  scrollToEnd(): void
  save(): Promise<void>
}

export type AlertArgs = [title: string, message?: string, buttons?: AlertButton[], options?: AlertOptions]

export interface MyAccountFieldEditScreenProps {
  title: string
  canSave: boolean
  contentContainerStyle?: ViewStyle
  onSave(dismiss: () => void, alert: AlertStatic["alert"]): Promise<any>
}

export const MyAccountFieldEditScreen = React.forwardRef<
  { scrollToEnd(): void },
  React.PropsWithChildren<MyAccountFieldEditScreenProps>
>(({ children, canSave, onSave, title, contentContainerStyle }, ref) => {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const afterLoadingAlert = useRef<AlertArgs>()
  const scrollViewRef = useRef<ScrollView>(null)
  const screen = useScreenDimensions()

  const doTheAlert: AlertStatic["alert"] = (...args) => {
    afterLoadingAlert.current = args
  }

  const handleSave = async () => {
    if (!canSave) {
      return
    }
    try {
      setIsSaving(true)
      await onSave(goBack, doTheAlert)
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
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} keyboardVerticalOffset={screen.safeAreaInsets.top}>
      <PageWithSimpleHeader
        left={
          <TouchableOpacity onPress={goBack}>
            <Sans size="4" textAlign="left">
              Cancel
            </Sans>
          </TouchableOpacity>
        }
        title={title}
        right={
          <TouchableOpacity disabled={!canSave} onPress={handleSave}>
            <Sans size="4" opacity={!canSave ? 0.3 : 1}>
              Save
            </Sans>
          </TouchableOpacity>
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
                if (afterLoadingAlert.current) {
                  Alert.alert(...afterLoadingAlert.current)
                  afterLoadingAlert.current = undefined
                }
              }}
            />
          )}
          {children}
        </ScrollView>
      </PageWithSimpleHeader>
    </KeyboardAvoidingView>
  )
})

export const MyAccountFieldEditScreenPlaceholder: React.FC<{ title: string }> = ({ children, title }) => {
  return (
    <MyAccountFieldEditScreen canSave={false} title={title} onSave={async () => null}>
      {children}
    </MyAccountFieldEditScreen>
  )
}

import { useShowLoadingBlock } from "lib/Components/Modals/LoadingModal"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { goBack } from "lib/navigation/navigate"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Sans } from "palette"
import React, { useImperativeHandle, useRef, useState } from "react"
import {
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

type AlertArgs =
  | [string] // title
  | [string, string] // title, message
  | [string, string, AlertButton[]] // title, message, buttons
  | [string, string, AlertButton[], AlertOptions] // title, message, buttons, options

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
  const showLoadingBlock = useShowLoadingBlock()
  const [behindTheModalDismiss, setBehindTheModalDismiss] = useState(false)
  const [behindTheModalAlert, setBehindTheModalAlert] = useState<AlertArgs | undefined>(undefined)
  const scrollViewRef = useRef<ScrollView>(null)
  const screen = useScreenDimensions()

  const onDismiss = () => {
    showLoadingBlock(false)
    goBack()
  }

  const doTheDismiss = () => {
    setBehindTheModalDismiss(true)
  }

  const doTheAlert = (...args: AlertArgs) => {
    setBehindTheModalAlert(args)
  }

  const handleSave = async () => {
    if (!canSave) {
      return
    }
    try {
      showLoadingBlock(true)
      await onSave(doTheDismiss, doTheAlert as any)
    } catch (e) {
      console.error(e)
    } finally {
      showLoadingBlock(false)
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
          <TouchableOpacity onPress={onDismiss}>
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
          {/* <LoadingModal
            isVisible={isSaving}
            onDismiss={() => {
              if (behindTheModalDismiss) {
                onDismiss()
              }
              if (behindTheModalAlert !== undefined) {
                Alert.alert(...(behindTheModalAlert as [any]))
              }
            }}
          /> */}
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

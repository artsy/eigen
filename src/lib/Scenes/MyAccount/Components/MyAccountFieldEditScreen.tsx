import { useShowLoadingBlock } from "lib/Components/Modals/LoadingBlock"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Sans } from "palette"
import React, { useImperativeHandle, useRef } from "react"
import { KeyboardAvoidingView, ScrollView, TouchableOpacity, ViewStyle } from "react-native"

export interface MyAccountFieldEditScreen {
  scrollToEnd(): void
  save(): Promise<void>
}

export interface MyAccountFieldEditScreenProps {
  title: string
  canSave: boolean
  contentContainerStyle?: ViewStyle
  onSave(dismiss: () => void): Promise<any>
}

export const MyAccountFieldEditScreen = React.forwardRef<
  { scrollToEnd(): void },
  React.PropsWithChildren<MyAccountFieldEditScreenProps>
>(({ children, canSave, onSave, title, contentContainerStyle }, ref) => {
  const showLoadingBlock = useShowLoadingBlock()
  const scrollViewRef = useRef<ScrollView>(null)
  const screen = useScreenDimensions()

  const onDismiss = () => {
    SwitchBoard.dismissNavigationViewController(scrollViewRef.current!)
  }

  const handleSave = async () => {
    if (!canSave) {
      return
    }
    try {
      showLoadingBlock(true)
      await onSave(onDismiss)
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

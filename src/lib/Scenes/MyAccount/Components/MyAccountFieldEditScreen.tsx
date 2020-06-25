import { Sans } from "@artsy/palette"
import LoadingModal from "lib/Components/Modals/LoadingModal"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { useRef, useState } from "react"
import { ScrollView, TouchableOpacity } from "react-native"

export const MyAccountFieldEditScreen: React.FC<{ title: string; canSave: boolean; onSave(): Promise<any> }> = ({
  children,
  canSave,
  onSave,
  title,
}) => {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const navRef = useRef(null)

  const handleSave = async () => {
    if (!canSave) {
      return
    }
    try {
      setIsSaving(true)
      await onSave()
      SwitchBoard.dismissNavigationViewController(navRef.current!)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PageWithSimpleHeader
      left={
        <TouchableOpacity onPress={() => SwitchBoard.dismissNavigationViewController(navRef.current!)}>
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
      <ScrollView style={{ padding: 20 }} ref={navRef}>
        <LoadingModal isVisible={isSaving} />
        {children}
      </ScrollView>
    </PageWithSimpleHeader>
  )
}

export const MyAccountFieldEditScreenPlaceholder: React.FC<{ title: string }> = ({ children, title }) => {
  return (
    <MyAccountFieldEditScreen canSave={false} title={title} onSave={async () => null}>
      {children}
    </MyAccountFieldEditScreen>
  )
}

import { Flex, Join, Sans, Separator } from "@artsy/palette"
import LoadingModal from "lib/Components/Modals/LoadingModal"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { useRef, useState } from "react"
import { TouchableOpacity, View } from "react-native"

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
    <Flex pt="2" ref={navRef}>
      <Join separator={<Separator my={2} />}>
        <Flex flexDirection="row" justifyContent="space-between" px={2}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => SwitchBoard.dismissNavigationViewController(navRef.current!)}>
              <Sans size="4" weight="medium" textAlign="left">
                Cancel
              </Sans>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Sans size="4" weight="medium">
              {title}
            </Sans>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <TouchableOpacity disabled={!canSave} onPress={handleSave}>
              <Sans size="4" weight="medium" opacity={!canSave ? 0.3 : 1}>
                Save
              </Sans>
            </TouchableOpacity>
          </View>
        </Flex>
        <Flex px={2}>
          <LoadingModal isVisible={isSaving} />
          {children}
        </Flex>
      </Join>
    </Flex>
  )
}

export const MyAccountFieldEditScreenPlaceholder: React.FC<{ title: string }> = ({ children, title }) => {
  const navRef = useRef(null)
  return (
    <Flex pt="2" ref={navRef}>
      <Join separator={<Separator my={2} />}>
        <Flex flexDirection="row" justifyContent="space-between" px={2}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => SwitchBoard.dismissNavigationViewController(navRef.current!)}>
              <Sans size="4" weight="medium" textAlign="left">
                Cancel
              </Sans>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Sans size="4" weight="medium">
              {title}
            </Sans>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <TouchableOpacity disabled={true}>
              <Sans size="4" weight="medium" opacity={0.3}>
                Save
              </Sans>
            </TouchableOpacity>
          </View>
        </Flex>
        <Flex px={2}>{children}</Flex>
      </Join>
    </Flex>
  )
}

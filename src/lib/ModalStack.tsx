import { NavigationContainerRef } from "@react-navigation/native"
import { dropRight } from "lodash"
import React, { useEffect, useRef, useState } from "react"
import { Modal, View } from "react-native"
import { ViewDescriptor } from "./navigation/navigate"
import { NavStack } from "./NavStack"

export let setGlobalVisible: (v: boolean) => void
export let presentModal: (viewDescriptor: ViewDescriptor) => void
export let dismissModal: () => void

export const ModalStack = () => {
  const navRef = useRef<NavigationContainerRef>()
  const [visible, setVisible] = useState(false)
  const [viewDescriptors, updateViewDescriptors] = useState<ViewDescriptor[]>([])

  const present = (viewDescriptor: ViewDescriptor) => {
    updateViewDescriptors((cur) => [...cur, viewDescriptor])
  }

  const dismiss = () => {
    updateViewDescriptors((cur) => dropRight(cur))
  }

  useEffect(() => {
    setGlobalVisible = setVisible
    presentModal = present
    dismissModal = dismiss
  }, [])

  // useEffect(()=>{
  //   if(viewDescriptors.length === 0) {
  //     setVisible(false)
  //   }
  // })

  return viewDescriptors.map((vd) => {
    return (
      <Modal visible>
        <NavStack ref={(r) => (navRef.current = r)} rootModuleName={vd.moduleName} />
      </Modal>
    )
  })
}

import { useNavigation } from "@react-navigation/native"
import { BackButton } from "lib/navigation/BackButton"
import React from "react"
import { ARTTestNativeView } from "./ARTTestNativeView"

export const NativeViewWrapper: React.FC = () => {
  const navigation = useNavigation()

  return (
    <>
      <ARTTestNativeView style={{ flex: 1 }} />
      <BackButton onPress={() => navigation.goBack()} />
    </>
  )
}

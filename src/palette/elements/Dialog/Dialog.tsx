import { useTheme } from "palette/Theme"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Modal, ModalProps, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

interface DialogProps extends Omit<ModalProps, "animationType" | "transparent"> {
  onBackgroundPressed?: () => void
}

export const Dialog: React.FC<DialogProps> = (props) => {
  const { children, visible, onBackgroundPressed, ...other } = props
  const [showModal, setShowModal] = useState(visible)
  const { space } = useTheme()
  const value = useRef(new Animated.Value(Number(visible))).current

  const runAnimation = (mode: "show" | "hide") => {
    return new Promise((resolve) => {
      if (mode === "show") {
        Animated.timing(value, {
          toValue: 1,
          useNativeDriver: true,
          duration: 250,
        }).start(resolve)
      } else {
        Animated.timing(value, {
          toValue: 0,
          useNativeDriver: true,
          duration: 150,
        }).start(resolve)
      }
    })
  }

  useEffect(() => {
    if (visible) {
      setShowModal(true)
      runAnimation("show")
    } else {
      runAnimation("hide").then(() => {
        setShowModal(false)
      })
    }
  }, [visible])

  return (
    <Modal {...other} visible={showModal} transparent={true} animationType="none">
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <Animated.View
          style={[StyleSheet.absoluteFillObject, { opacity: value, backgroundColor: "rgba(0, 0, 0, 0.5)" }]}
        />
        <View style={[StyleSheet.absoluteFillObject, { justifyContent: "center", alignItems: "center", padding: 10 }]}>
          <Animated.View
            style={{
              opacity: value,
              width: "100%",
              height: "95%",
              marginHorizontal: space(2),
              backgroundColor: "transparent",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ backgroundColor: "#fff", width: "100%", padding: space(2) }}>{children}</View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

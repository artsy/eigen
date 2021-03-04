import { dismissModal } from "lib/navigation/navigate"
import { CloseIcon, color, Touchable } from "palette"
import React from "react"
import { Platform, View } from "react-native"

const isIOS13Plus = Platform.OS === "ios" && Number(Platform.Version) >= 13

export const ModalHeader: React.FC = () => {
  return (
    <>
      {/* drag handle for iOS 13 'page sheet' modals */}
      {isIOS13Plus ? (
        <View style={{ position: "absolute", top: 10, left: 0, right: 0, alignItems: "center" }}>
          <View style={{ width: 75, height: 4, borderRadius: 2, backgroundColor: color("black30") }}></View>
        </View>
      ) : (
        /* close button for iOS 12 + android full screen modals */
        <View style={{ position: "absolute", top: 40, right: 15 }}>
          <Touchable
            onPress={dismissModal}
            hitSlop={{
              left: 15,
              right: 15,
              top: 15,
              bottom: 15,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                width: 40,
                height: 40,
                borderRadius: 20,
                shadowColor: "black",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                alignItems: "center",
                justifyContent: "center",
                elevation: 3,
              }}
            >
              <CloseIcon />
            </View>
          </Touchable>
        </View>
      )}
    </>
  )
}

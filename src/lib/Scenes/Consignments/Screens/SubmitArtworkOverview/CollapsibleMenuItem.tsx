import { track as _track } from "lib/utils/track"
import { Sans } from "palette"
import { ArrowDownIcon, ArrowUpIcon, CheckCircleIcon, Separator } from "palette"
import React, { useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { SaveAndContinue } from "./SaveAndContinue"
interface Props {
  title: string
  content?: string | React.FC | any
  step: number
  totalSteps: number
  isCompleted?: boolean
}

export const CollapsibleMenuItem: React.FC<Props> = ({
  title = "Title",
  content = "Content",
  step = 1,
  totalSteps = 3,
  isCompleted,
}) => {
  const [isContentVisible, setIsContentVisible] = useState(true)

  // useEffect(() => {
  //   console.log("\n\nInside useEffect: isCompleted", isCompleted)
  //   // this is causing strange behaviour
  //   // setIsContentVisible(!isContentVisible)
  // }, [isCompleted])
  // setIsContentVisible(!isContentVisible)

  return (
    <TouchableOpacity
      onPress={() => {
        setIsContentVisible(!isContentVisible)
      }}
    >
      <View>
        <Sans size="1" mx="2">
          Step {step} of {totalSteps}
        </Sans>
        <View style={styles.titleAndIcon}>
          <Sans size="8" mx="2">
            {title}
          </Sans>
          <View style={styles.icons}>
            {!!isCompleted && <CheckCircleIcon fill="green100" height={24} width={24} style={styles.circle} />}
            {!!isContentVisible ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </View>
        </View>
      </View>
      {!!isContentVisible && (
        <>
          <Sans size="1" mx="2" mt="1">
            {content}
          </Sans>
          <SaveAndContinue setIsContentVisible={setIsContentVisible} />
        </>
      )}
      {/* doesnot add margin to the right... */}
      <Separator marginTop="40" marginBottom="20" mx="2" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  titleAndIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 20,
  },
  icons: { flexDirection: "row", alignItems: "center" },
  circle: { marginRight: 5 },
})

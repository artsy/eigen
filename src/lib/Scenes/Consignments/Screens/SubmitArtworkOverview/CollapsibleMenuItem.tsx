import { track as _track } from "lib/utils/track"
import { Sans, Spacer } from "palette"
import { ArrowDownIcon, ArrowRightIcon, CheckCircleIcon, Separator } from "palette"
import React, { useState } from "react"
import { TouchableOpacity, View } from "react-native"

interface Props {
  title: string
  content: string
  step: number
  totalSteps: number
}

export const CollapsibleMenuItem: React.FC<Props> = ({
  title = "Title",
  content = "Content",
  step = 1,
  totalSteps = 3,
}) => {
  const [isContentVisible, setIsContentVisible] = useState(true)
  const [isCompleted, setIsCompleted] = useState(true)

  return (
    <TouchableOpacity
      onPress={() => {
        setIsContentVisible(!isContentVisible)
      }}
    >
      <View>
        <Sans size="1" mx="2" mt="1">
          Step {step} of {totalSteps}
        </Sans>
        <Spacer mb={0.1} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginRight: 20 }}>
          <Sans size="8" mx="2">
            {title}
          </Sans>
          {/* Check Icon  that changes on "done" */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {!!isCompleted && <CheckCircleIcon fill="green100" height={24} width={24} style={{ marginRight: 5 }} />}
            {!!isContentVisible ? <ArrowDownIcon /> : <ArrowRightIcon />}
          </View>
        </View>
      </View>
      {!!isContentVisible && (
        <Sans size="4" mx="2" mt="2" color="gray">
          {content}
        </Sans>
      )}
      {/* doesnot add margin to the right... */}
      <Separator my="3" mx="2" />
    </TouchableOpacity>
  )
}

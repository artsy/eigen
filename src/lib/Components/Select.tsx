import { CheckIcon, CloseIcon, color, Flex, Sans, Separator } from "@artsy/palette"
import React, { useEffect, useRef, useState } from "react"
import { Animated, FlatList, TouchableHighlight, TouchableOpacity } from "react-native"
import Svg, { Path } from "react-native-svg"
// @ts-ignore
import TextInputState from "react-native/Libraries/Components/TextInput/TextInputState"
import { FancyModal } from "./FancyModal"
import { INPUT_HEIGHT } from "./Input/Input"

export interface SelectOption<ValueType> {
  value: ValueType
  label: NonNullable<React.ReactNode>
}

const ROW_HEIGHT = 40

export function Select<ValueType extends any>({
  options,
  onSelectValue,
  value: _value,
  placeholder,
  title,
}: {
  options: Array<SelectOption<ValueType>>
  value: ValueType | null
  placeholder: string
  title?: string
  enableSearch?: boolean
  onSelectValue(value: ValueType): void
}) {
  // we need to be able to have a local version of the value state so we can show the updated
  // state between the moment the user taps a selection and the moment we automatically
  // close the modal. We don't want to tell the consuming component about the user's selection until the
  // animation is finished, so they don't have to worry about waiting for the animation to finish if they need
  // to trigger further actions as a result.
  const [value, setValue] = useState(_value)
  useEffect(() => {
    setValue(_value)
  }, [_value])

  const [showingModal, setShowingModal] = useState(false)
  const selectedItem = options.find(o => o.value === value)
  return (
    <>
      {!!title && (
        <Sans mb={0.5} size="3">
          {title}
        </Sans>
      )}
      <TouchableOpacity
        onPress={async () => {
          // tinkering with RN internals here to make sure that when this select is tapped we blur
          // any text input that was focuesd at the time.
          if (TextInputState.currentlyFocusedField()) {
            TextInputState.blurTextInput(TextInputState.currentlyFocusedField())
            await new Promise(r => requestAnimationFrame(r))
          }
          setShowingModal(true)
        }}
      >
        <Flex
          px="1"
          flexDirection="row"
          height={INPUT_HEIGHT}
          borderWidth={1}
          borderColor={color("black10")}
          justifyContent="space-between"
          alignItems="center"
        >
          {selectedItem ? (
            <Sans size="3t">{selectedItem.label}</Sans>
          ) : (
            <Sans size="3t" color="black60">
              {placeholder}
            </Sans>
          )}
          <Svg width="11" height="6" viewBox="0 0 11 6" fill="none">
            <Path fillRule="evenodd" clip-rule="evenodd" d="M5.5 6L0 0L11 0L5.5 6Z" fill="black" />
          </Svg>
        </Flex>
      </TouchableOpacity>
      <FancyModal visible={showingModal} onBackgroundPressed={() => setShowingModal(false)}>
        <Flex p="2" pb={15} flexDirection="row" alignItems="center" flexGrow={0}>
          <Flex flex={1}></Flex>
          <Flex flex={2} alignItems="center">
            <Sans size="4" weight="medium">
              {title}
            </Sans>
          </Flex>
          <TouchableOpacity
            onPress={() => setShowingModal(false)}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            style={{ flex: 1, alignItems: "flex-end" }}
          >
            <CloseIcon fill="black60" />
          </TouchableOpacity>
        </Flex>
        <Separator />
        <FlatList
          data={options}
          extraData={{ value }}
          keyExtractor={item => String(item.value)}
          windowSize={3}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 60 }}
          initialScrollIndex={value ? options.findIndex(o => value === o.value) : undefined}
          getItemLayout={(_item, index) => ({ index, length: ROW_HEIGHT, offset: ROW_HEIGHT * index })}
          style={{ flex: 1 }}
          renderItem={({ item }) => (
            <TouchableHighlight
              underlayColor={color("black10")}
              onPress={() => {
                setValue(item.value)
                // give the pop-in animation a chance to play
                setTimeout(() => {
                  setShowingModal(false)
                  onSelectValue(item.value)
                }, 400)
              }}
            >
              <Flex
                flexDirection="row"
                pl="2"
                pr={15}
                justifyContent="space-between"
                height={ROW_HEIGHT}
                alignItems="center"
                backgroundColor={value === item.value ? "black5" : "white"}
              >
                <Sans size="4">{item.label}</Sans>
                {value === item.value ? (
                  <PopIn>
                    <CheckIcon width={25} height={25} />
                  </PopIn>
                ) : null}
              </Flex>
            </TouchableHighlight>
          )}
        ></FlatList>
      </FancyModal>
    </>
  )
}

const PopIn: React.FC = ({ children }) => {
  const entranceProgress = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.spring(entranceProgress, { toValue: 1, bounciness: 10, speed: 18, useNativeDriver: true }).start()
  }, [])
  return (
    <Animated.View
      style={{
        opacity: entranceProgress,
        transform: [
          {
            scale: entranceProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  )
}

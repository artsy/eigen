import { CloseIcon } from "@artsy/icons/native"
import { Flex, Touchable, useColor } from "@artsy/palette-mobile"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { TextInput } from "react-native"

interface ArtnetSearchInputProps {
  value: string
  onChangeText: (text: string) => void
  onSubmitEditing: () => void
  onClear: () => void
  placeholder?: string
}

const INPUT_HEIGHT = 34

export const ArtnetSearchInput: React.FC<ArtnetSearchInputProps> = ({
  value,
  onChangeText,
  onSubmitEditing,
  onClear,
  placeholder = "Search articles",
}) => {
  const color = useColor()

  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      height={INPUT_HEIGHT}
      borderWidth={1}
      borderColor="mono30"
      borderRadius={2}
      px={1}
    >
      <SearchIcon width={18} height={18} />
      <TextInput
        accessibilityLabel="Text input field"
        style={{
          flex: 1,
          height: "100%",
          padding: 0,
          marginLeft: 6,
          fontFamily: "Unica77LL-Regular",
          fontSize: 14,
          lineHeight: 18,
          color: color("mono100"),
          textAlignVertical: "center",
          includeFontPadding: false,
        }}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor={color("mono60")}
        returnKeyType="search"
        maxLength={100}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {!!value && (
        <Touchable haptic accessibilityLabel="Clear search" onPress={onClear} hitSlop={8}>
          <CloseIcon fill="mono60" width={18} height={18} />
        </Touchable>
      )}
    </Flex>
  )
}

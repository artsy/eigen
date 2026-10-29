import { Input, Touchable } from "@artsy/palette-mobile"
import { AddressSearchSheet } from "app/Components/AddressAutocomplete/AddressSearchSheet"
import { LocationWithDetails } from "app/utils/googleMaps"
import { useState } from "react"
import { View } from "react-native"

interface AddressAutocompleteProps {
  title: string
  value: LocationWithDetails | null
  onChange: (address: LocationWithDetails) => void
  /** ISO 3166-1 alpha-2 code that limits suggestions to one country */
  country?: string
  testID?: string
}

/**
 * A field that opens a sheet to search street addresses with Google Places. The suggestions
 * live in the sheet so the keyboard can't cover them.
 */
export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  title,
  value,
  onChange,
  country,
  testID,
}) => {
  const [searchVisible, setSearchVisible] = useState(false)

  return (
    <>
      <Touchable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityValue={{ text: value?.name }}
        testID={testID}
        onPress={() => setSearchVisible(true)}
      >
        {/* The sheet does the typing, so the field only shows the picked address */}
        <View pointerEvents="none">
          <Input title={title} value={value?.name ?? ""} editable={false} />
        </View>
      </Touchable>

      <AddressSearchSheet
        visible={searchVisible}
        title={title}
        initialQuery={value?.name}
        country={country}
        onDismiss={() => setSearchVisible(false)}
        onSelect={onChange}
      />
    </>
  )
}

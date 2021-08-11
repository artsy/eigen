import { ArtsyKeyboardAvoidingView } from "lib/Components/ArtsyKeyboardAvoidingView"
import { SearchInput } from "lib/Components/SearchInput"
import { Flex, useColor } from "palette"
import React, { useState } from "react"

export const Search2: React.FC = () => {
  const color = useColor()
  const [_query, setQuery] = useState("")
  return (
    <ArtsyKeyboardAvoidingView>
      <Flex p={2} pb={1} style={{ borderBottomWidth: 1, borderColor: color("black10") }}>
        <SearchInput
          placeholder="Search artists"
          enableCancelButton
          onChangeText={(queryText) => {
            setQuery(queryText)
          }}
        />
      </Flex>
    </ArtsyKeyboardAvoidingView>
  )
}

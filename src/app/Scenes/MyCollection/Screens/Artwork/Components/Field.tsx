import { Flex } from "@artsy/palette-mobile"
import { Text } from "palette"
import { useState } from "react"
import { LayoutAnimation, TouchableWithoutFeedback } from "react-native"

const EMPTY_VALUE = "----"

export const Field: React.FC<{
  label: string
  value: string | null
  color?: "black100" | "black60"
  /** The length of text after which we truncate and add a read more button */
  truncateLimit?: number
}> = ({ label, value, color, truncateLimit = 0 }) => {
  const [expanded, setExpanded] = useState(false)

  if (!value) {
    return null
  }

  const truncatedValue = truncateLimit ? value.slice(0, truncateLimit) : value
  const canExpand = truncatedValue.length < value.length

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpanded(!expanded)
  }

  return (
    <Flex flexDirection="row" justifyContent="space-between" my={1}>
      <Text variant="xs" color="black100" pr={1}>
        {label}
      </Text>

      <Flex maxWidth="70%">
        <Text style={{ flex: 1 }} variant="xs" color={color ?? "black100"}>
          {expanded ? value : truncatedValue}
        </Text>
        {canExpand && (
          <TouchableWithoutFeedback onPress={toggle} testID="ReadMoreButton">
            <Flex>
              <Text
                style={{ textDecorationLine: "underline" }}
                variant="xs"
                color={color ?? "black100"}
                mt={1}
              >
                {expanded ? "Read Less" : "Read More"}
              </Text>
            </Flex>
          </TouchableWithoutFeedback>
        )}
      </Flex>
    </Flex>
  )
}

export const MetaDataField: React.FC<{
  label: string
  value: string | null | undefined
  truncateLimit?: number
}> = ({ label, value, truncateLimit }) => {
  return (
    <Field
      label={label}
      value={value || EMPTY_VALUE}
      color={!value ? "black60" : "black100"}
      truncateLimit={truncateLimit}
    />
  )
}

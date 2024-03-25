import { Box, Flex, Input2Props, Text, computeBorderColor, useColor } from "@artsy/palette-mobile"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { RemainingCharactersLabel } from "./RemainingCharactersLabel"

interface CreateNewArtworkListInputProps extends Input2Props {
  value: string
  maxLength: number
}

export const CreateNewArtworkListInput = ({ error, ...rest }: CreateNewArtworkListInputProps) => {
  const color = useColor()
  const borderColor = color(computeBorderColor({ error: !!error }))

  return (
    <Box>
      <BottomSheetInput {...rest} style={{ borderColor: borderColor }} />

      <Flex height={25} justifyContent="center" mt={1}>
        {!!error ? (
          <Text variant="xs" color="red100">
            {error}
          </Text>
        ) : (
          <RemainingCharactersLabel currentLength={rest.value.length} maxLength={rest.maxLength} />
        )}
      </Flex>
    </Box>
  )
}

import { InputProps } from "@artsy/palette-mobile"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { RemainingCharactersLabel } from "./RemainingCharactersLabel"

interface CreateNewArtworkListInputProps extends InputProps {
  value: string
  maxLength: number
}

export const CreateNewArtworkListInput = (props: CreateNewArtworkListInputProps) => {
  return (
    <>
      <BottomSheetInput {...props} />
      <RemainingCharactersLabel currentLength={props.value.length} maxLength={props.maxLength} />
    </>
  )
}

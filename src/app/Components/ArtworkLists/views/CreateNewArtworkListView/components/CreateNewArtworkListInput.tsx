import { Input2Props } from "@artsy/palette-mobile"
import { BottomSheetInput } from "app/Components/BottomSheetInput"

interface CreateNewArtworkListInputProps extends Input2Props {
  value: string
  maxLength: number
}

export const CreateNewArtworkListInput = ({ error, ...rest }: CreateNewArtworkListInputProps) => {
  return <BottomSheetInput {...rest} error={error} showLimit maxLength={rest.maxLength} />
}

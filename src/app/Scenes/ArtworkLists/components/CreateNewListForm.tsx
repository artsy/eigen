import { Button, Flex, Input, Spacer } from "@artsy/palette-mobile"
import { BottomSheetTextInput } from "app/Scenes/ArtworkLists/components/BottomSheetTextInput"
import { FC, useState } from "react"

export type CreateResult = {
  name: string
}

interface CreateNewListFormProps {
  useBottomSheetInput?: boolean
  onCreatePress: (result: CreateResult) => void
  onBackPress: () => void
}

export const CreateNewListForm: FC<CreateNewListFormProps> = ({
  useBottomSheetInput,
  onCreatePress,
  onBackPress,
}) => {
  const [name, setName] = useState("")

  const handleCreatePressed = () => {
    onCreatePress({
      name,
    })
  }

  const InputComponent = useBottomSheetInput ? BottomSheetTextInput : Input

  return (
    <Flex p={2}>
      <InputComponent
        value={name}
        placeholder={`Name your list ${useBottomSheetInput ? "(Bottom Sheet)" : ""}`}
        onChangeText={setName}
      />

      <Spacer y={2} />

      <Button block width="100%" onPress={handleCreatePressed} disabled={name.length === 0}>
        Create List
      </Button>

      <Spacer y={1} />

      <Button variant="outline" block width="100%" onPress={onBackPress}>
        Back
      </Button>
    </Flex>
  )
}

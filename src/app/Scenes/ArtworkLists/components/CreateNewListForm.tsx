import { Button, Flex, Input, Spacer } from "@artsy/palette-mobile"
import { FC, useState } from "react"

export type CreateResult = {
  name: string
}

interface CreateNewListFormProps {
  onCreatePress: (result: CreateResult) => void
  onBackPress: () => void
}

export const CreateNewListForm: FC<CreateNewListFormProps> = ({ onCreatePress, onBackPress }) => {
  const [name, setName] = useState("")

  const handleCreatePressed = () => {
    onCreatePress({
      name,
    })
  }

  return (
    <Flex p={2}>
      <Input value={name} placeholder="Name your list" onChangeText={setName} />

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

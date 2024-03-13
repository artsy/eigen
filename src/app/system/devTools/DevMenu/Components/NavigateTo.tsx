import { Button, Flex, Input, Spacer } from "@artsy/palette-mobile"
import { Expandable } from "app/Components/Expandable"
import { dismissModal, navigate } from "app/system/navigation/navigate"
import { useState } from "react"

export const NavigateTo: React.FC<{}> = () => {
  const [url, setUrl] = useState("")

  return (
    <Flex mx={2} mt={2}>
      <Expandable label="Navigate to" expanded={false}>
        <Spacer y={1} />
        <Flex flexDirection="row">
          <Input
            placeholder="Url to navigate to"
            onChangeText={(text) => setUrl(text)}
            autoCapitalize="none"
            returnKeyType="go"
          />
          <Spacer x={1} />
          <Button
            onPress={() => {
              if (!url) {
                return
              }

              dismissModal(() => navigate(url))
            }}
          >
            Go
          </Button>
        </Flex>
      </Expandable>
    </Flex>
  )
}

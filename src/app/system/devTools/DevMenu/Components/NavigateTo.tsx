import { Flex, Input } from "@artsy/palette-mobile"
import { dismissModal, navigate } from "app/system/navigation/navigate"
import { useState } from "react"

export const NavigateTo: React.FC<{}> = () => {
  const [url, setUrl] = useState("")

  return (
    <Flex mx={2} my={1}>
      <Flex flexDirection="row" justifyContent="space-between">
        <Flex width="100%">
          <Input
            placeholder="Url to navigate to"
            onChangeText={(text) => setUrl(text)}
            autoCapitalize="none"
            onSubmitEditing={() => {
              dismissModal(() => navigate(url))
            }}
            returnKeyType="go"
            value={url}
            autoCorrect={false}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

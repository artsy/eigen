import { useNavigation } from "@react-navigation/native"
import { Input } from "lib/Components/Input/Input"
import { Stack } from "lib/Components/Stack"
import { GlobalStore } from "lib/store/GlobalStore"
import { Button, Flex, Separator, Text } from "palette"
import React from "react"
import { SafeAreaView } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { LogInStore } from "./LogInStore"

export const LogInEnterPassword: React.FC = () => {
  const { setPassword } = LogInStore.useStoreActions((store) => store)
  const { password, email } = LogInStore.useStoreState((store) => store)
  const nav = useNavigation()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" style={{ flex: 1 }}>
        <Separator />
        <Stack spacing={3} py="2" px="2">
          <Stack>
            <Text variant="title">Enter your password</Text>
            <Input
              placeholder="Password"
              autoCapitalize="none"
              autoCorrect={false}
              defaultValue={password}
              onChangeText={(pw) => setPassword({ password: pw })}
              secureTextEntry
            />
          </Stack>
        </Stack>
      </ScrollView>
      <Flex p="2" pt="1">
        <Button
          block
          disabled={password.trim().length < 8}
          onPress={async () => {
            if (
              await GlobalStore.actions.auth.signIn({
                email,
                password,
              })
            ) {
              nav.reset({
                routes: [{ name: "Main" }],
              })
            }
          }}
        >
          Next
        </Button>
      </Flex>
    </SafeAreaView>
  )
}

import { useNavigation } from "@react-navigation/native"
import { Input } from "lib/Components/Input/Input"
import { Stack } from "lib/Components/Stack"
import { GlobalStore } from "lib/store/GlobalStore"
import { ArtsyLogoBlackIcon, Button, Flex, Separator, Text } from "palette"
import React from "react"
import { SafeAreaView } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { LogInStore } from "./LogInStore"

export const LogInEmail: React.FC = () => {
  const { setEmail } = LogInStore.useStoreActions((store) => store)
  const email = LogInStore.useStoreState((store) => store.email)
  const nav = useNavigation()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" style={{ flex: 1 }}>
        <Flex mt="2" mb="1" flexDirection="row" style={{ justifyContent: "center" }}>
          <ArtsyLogoBlackIcon scale={0.85} />
        </Flex>
        <Separator />
        <Stack spacing={2} py="2" px="2">
          <Stack spacing={1}>
            <Text variant="title">Enter your email address</Text>
            <Text>Log in with your email. If you don’t have an Artsy account yet, we’ll get one set up for you.</Text>
          </Stack>
          <Input
            placeholder="Email"
            autoCapitalize="none"
            autoCorrect={false}
            defaultValue={email}
            onChangeText={(text) => setEmail({ email: text.trim() })}
          />
        </Stack>
      </ScrollView>
      <Flex p="2" pt="1">
        <Button
          block
          onPress={async () => {
            if (await GlobalStore.actions.auth.userExists({ email })) {
              nav.navigate("LogInEnterPassword")
            }
          }}
        >
          Next
        </Button>
      </Flex>
    </SafeAreaView>
  )
}

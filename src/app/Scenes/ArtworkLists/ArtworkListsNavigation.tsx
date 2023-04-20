import { Box, Button, Flex, Input, Spacer, Text } from "@artsy/palette-mobile"
import {
  NavigationContainer,
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native"
import { TransitionPresets, createStackNavigator } from "@react-navigation/stack"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { ScrollableArtworkLists } from "app/Scenes/ArtworkLists/components/ScrollableArtworkLists"
import { FC, useState } from "react"

type ArtworkListsNavigationProps = {
  onClose: () => void
}

type ArtworkListsNavigationStack = {
  SelectListsForArtwork: {
    list?: {
      name: string
    }
    onClose: () => void
  }
  CreateNewList: undefined
}

const StackNavigator = createStackNavigator<ArtworkListsNavigationStack>()

export const ArtworkListsNavigation: FC<ArtworkListsNavigationProps> = ({ onClose }) => {
  return (
    <NavigationContainer independent>
      <StackNavigator.Navigator
        /**
         * *** Please pay attention ***
         *
         * force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
         * otherwise the camera will be "frozen" and it will be *impossible* to take a photo
         */
        detachInactiveScreens={false}
        screenOptions={{
          ...TransitionPresets.DefaultTransition,
          headerShown: false,
          headerMode: "screen",
        }}
      >
        <StackNavigator.Screen
          name="SelectListsForArtwork"
          initialParams={{ onClose }}
          component={SelectListsForArtwork}
        />
        <StackNavigator.Screen name="CreateNewList" component={CreateNewList} />
      </StackNavigator.Navigator>
    </NavigationContainer>
  )
}

const SelectListsForArtwork = () => {
  const navigation = useNavigation<NavigationProp<ArtworkListsNavigationStack>>()
  const route = useRoute<RouteProp<ArtworkListsNavigationStack, "SelectListsForArtwork">>()

  const handleCreateListPressed = () => {
    navigation.navigate("CreateNewList")
  }

  return (
    <Flex flex={1}>
      <FancyModalHeader onLeftButtonPress={route.params?.onClose} useXButton>
        Select lists for this artwork
      </FancyModalHeader>

      {!!route.params?.list && (
        <Box bg="green100" p={2}>
          <Text color="white100">List Created</Text>
          <Text color="white100">{route.params.list.name}</Text>
        </Box>
      )}

      <Box m={2}>
        <Button block width="100%" onPress={handleCreateListPressed}>
          Create New List
        </Button>
      </Box>

      <ScrollableArtworkLists />
    </Flex>
  )
}

const CreateNewList = () => {
  const [name, setName] = useState("")
  const navigation = useNavigation<NavigationProp<ArtworkListsNavigationStack>>()

  const handleBackPressed = () => {
    navigation.goBack()
  }

  const handleCreateListPressed = () => {
    // @ts-ignore
    navigation.navigate("SelectListsForArtwork", {
      list: {
        name,
      },
    })
  }

  return (
    <Flex p={2}>
      <Input value={name} placeholder="Name your list" onChangeText={setName} />

      <Spacer y={2} />

      <Button block width="100%" onPress={handleCreateListPressed} disabled={name.length === 0}>
        Create List
      </Button>

      <Spacer y={1} />

      <Button variant="outline" block width="100%" onPress={handleBackPressed}>
        Back
      </Button>
    </Flex>
  )
}

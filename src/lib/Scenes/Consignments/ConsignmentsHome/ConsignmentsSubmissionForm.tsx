// import Overview from "lib/Scenes/Consignments/Screens/Overview"
import { presentModal } from "lib/ModalStack"
import { dismissModal, navigate } from "lib/navigation/navigate"
import { Button, Flex, Text, Theme } from "palette"
import React from "react"
// import NavigatorIOS from "react-native-navigator-ios"

export const ConsignmentsSubmissionForm: React.FC = () => {
  // const initialRoute = { component: Overview }

  return (
    <Theme>
      {/* <NavigatorIOS initialRoute={initialRoute} navigationBarHidden={true} style={{ flex: 1 }} /> */}
      <Flex flex={1}>
        <Text>CONSIGN!!</Text>
        <Button onPress={() => navigate("/my-profile", { modal: true })}>second modal</Button>
        <Button onPress={() => dismissModal()}>close</Button>
      </Flex>
    </Theme>
  )
}

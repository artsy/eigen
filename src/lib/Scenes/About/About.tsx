import { MenuItem } from "lib/Components/MenuItem"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { navigate } from "lib/navigation/navigate"
import React from "react"
import { NativeModules, ScrollView } from "react-native"

export const About: React.FC<{}> = ({}) => {
  return (
    <PageWithSimpleHeader title="About">
      <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
        <MenuItem title="Terms of Use" onPress={() => navigate("/terms", { modal: true })} />
        <MenuItem title="Privacy Policy" onPress={() => navigate("/privacy", { modal: true })} />
        <MenuItem title="Version" disabled text={NativeModules.ARTemporaryAPIModule.appVersion} />
      </ScrollView>
    </PageWithSimpleHeader>
  )
}

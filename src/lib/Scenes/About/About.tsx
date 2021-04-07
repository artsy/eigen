import { MenuItem } from "lib/Components/MenuItem"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { navigate } from "lib/navigation/navigate"
import { appJson } from "lib/utils/jsonFiles"
import React from "react"
import { ScrollView } from "react-native"

export const About: React.FC<{}> = ({}) => {
  const appVersion = appJson().version
  return (
    <PageWithSimpleHeader title="About">
      <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
        <MenuItem title="Terms of Use" onPress={() => navigate("/terms", { modal: true })} />
        <MenuItem title="Privacy Policy" onPress={() => navigate("/privacy", { modal: true })} />
        <MenuItem title="Version" disabled text={appVersion} />
      </ScrollView>
    </PageWithSimpleHeader>
  )
}

import { MenuItem } from "lib/Components/MenuItem"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { useRef } from "react"
import { NativeModules, ScrollView } from "react-native"

export const About: React.FC<{}> = ({}) => {
  const navRef = useRef(null)
  return (
    <PageWithSimpleHeader title="About">
      <ScrollView ref={navRef} contentContainerStyle={{ paddingTop: 10 }}>
        <MenuItem
          title="Terms of Use"
          onPress={() => SwitchBoard.presentModalViewController(navRef.current!, "/terms")}
        />
        <MenuItem
          title="Privacy Policy"
          onPress={() => SwitchBoard.presentModalViewController(navRef.current!, "/privacy")}
        />
        <MenuItem title="Version" disabled text={NativeModules.ARTemporaryAPIModule.appVersion} />
      </ScrollView>
    </PageWithSimpleHeader>
  )
}

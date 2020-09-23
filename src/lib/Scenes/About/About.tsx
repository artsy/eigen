import { MenuItem } from "lib/Components/MenuItem"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import React, { useRef } from "react"
import { Linking, ScrollView } from "react-native"

export const TERMS_OF_USE_URL = "https://www.artsy.net/terms"
export const PRIVACY_POLICY_URL = "https://www.artsy.net/terms"

export const About: React.FC<{}> = ({}) => {
  const navRef = useRef(null)

  return (
    <PageWithSimpleHeader title="About">
      <ScrollView ref={navRef} contentContainerStyle={{ paddingTop: 10 }}>
        <MenuItem title="Terms of use" onPress={() => Linking.openURL(TERMS_OF_USE_URL)} />
        <MenuItem title="Privacy policy" onPress={() => Linking.openURL(PRIVACY_POLICY_URL)} />
        <MenuItem title="Version" disabled text="6.6.3" />
      </ScrollView>
    </PageWithSimpleHeader>
  )
}

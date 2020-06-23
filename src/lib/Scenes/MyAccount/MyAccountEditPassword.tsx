import { Input } from "lib/Components/Input/Input"
import React, { useState } from "react"

import { Join, Separator } from "@artsy/palette"

import { MyAccountFieldEditScreen } from "./Components/MyAccountFieldEditScreen"

export const MyAccountEditPassword: React.FC<{}> = ({}) => {
  const [oldPassword, setOldPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState<string>("")

  return (
    // @ts-ignore
    // tslint:disable-next-line:no-empty
    <MyAccountFieldEditScreen title={"Full Name"} canSave={oldPassword === newPasswordConfirmation} onSave={() => {}}>
      <Join separator={<Separator my={2} />}>
        <Input
          autoCompleteType="password"
          autoFocus
          onChangeText={setOldPassword}
          placeholder="Current password"
          secureTextEntry
          showClearButton
          title="Current password"
          value={oldPassword}
        />
        <>
          <Input
            autoFocus
            description="Must include at least one uppercase letter, one lowercase letter, and one number."
            onChangeText={setNewPassword}
            placeholder="New password"
            secureTextEntry
            showClearButton
            title="New password"
            value={newPassword}
          />
          <Input
            autoFocus
            containerStyle={{ marginTop: 30 }}
            onChangeText={setNewPasswordConfirmation}
            placeholder="Confirm new password"
            secureTextEntry
            showClearButton
            title="Confirm new password"
            value={newPasswordConfirmation}
          />
        </>
      </Join>
    </MyAccountFieldEditScreen>
  )
}

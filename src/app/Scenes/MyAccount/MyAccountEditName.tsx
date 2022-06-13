import { MyAccountEditNameQuery } from "__generated__/MyAccountEditNameQuery.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { PlaceholderBox } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { Input } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"
import { MyAccountEditName_me$data } from "../../../__generated__/MyAccountEditName_me.graphql"
import {
  MyAccountFieldEditScreen,
  MyAccountFieldEditScreenPlaceholder,
} from "./Components/MyAccountFieldEditScreen"
import { updateMyUserProfile } from "./updateMyUserProfile"

const MyAccountEditName: React.FC<{ me: MyAccountEditName_me$data; relay: RelayProp }> = ({
  me,
}) => {
  const [name, setName] = useState<string>(me.name ?? "")
  const [receivedErrors, setReceivedErrors] = useState<string | undefined>(undefined)
  const inputRef = useRef(null)

  useEffect(() => {
    setReceivedErrors(undefined)
  }, [name])

  return (
    <MyAccountFieldEditScreen
      title="Full Name"
      canSave={!!name.trim() && name.trim() !== me.name}
      onSave={async (dismiss) => {
        try {
          await updateMyUserProfile({ name })
          dismiss()
        } catch (e: any) {
          setReceivedErrors(e)
        }
      }}
    >
      <Input
        enableClearButton
        value={name}
        onChangeText={setName}
        autoFocus
        ref={inputRef}
        error={receivedErrors}
      />
    </MyAccountFieldEditScreen>
  )
}

const MyAccountEditNamePlaceholder: React.FC<{}> = ({}) => {
  return (
    <MyAccountFieldEditScreenPlaceholder title="Full Name">
      <PlaceholderBox height={40} />
    </MyAccountFieldEditScreenPlaceholder>
  )
}

const MyAccountEditNameContainer = createFragmentContainer(MyAccountEditName, {
  me: graphql`
    fragment MyAccountEditName_me on Me {
      name
    }
  `,
})

export const MyAccountEditNameQueryRenderer: React.FC<{}> = () => {
  return (
    <QueryRenderer<MyAccountEditNameQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyAccountEditNameQuery {
          me {
            ...MyAccountEditName_me
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: MyAccountEditNameContainer,
        renderPlaceholder: () => <MyAccountEditNamePlaceholder />,
      })}
      variables={{}}
    />
  )
}

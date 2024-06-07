import { CompleteMyProfileProviderQuery } from "__generated__/CompleteMyProfileProviderQuery.graphql"
import { StepsResult, useProfileCompletion } from "app/Scenes/MyProfile/hooks/useProfileCompletion"
import React, { createContext, useContext } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

interface CompleteMyProfileContextProps {
  steps: StepsResult
}

export const CompleteMyProfileContext = createContext<CompleteMyProfileContextProps>({
  steps: "loading",
})

interface CompleteMyProfileProviderProps {
  children: React.ReactNode
}

export const CompleteMyProfileProvider: React.FC<CompleteMyProfileProviderProps> = ({
  children,
}) => {
  const data = useLazyLoadQuery<CompleteMyProfileProviderQuery>(
    query,
    {},
    { fetchPolicy: "store-and-network" }
  )

  const { steps } = useProfileCompletion({ collectorProfile: data.me })

  return (
    <CompleteMyProfileContext.Provider value={{ steps }}>
      {children}
    </CompleteMyProfileContext.Provider>
  )
}

export const useCompleteMyProfileContext = () => {
  return useContext(CompleteMyProfileContext)
}

const query = graphql`
  query CompleteMyProfileProviderQuery {
    me {
      ...useProfileCompletion_collectorProfile
    }
  }
`

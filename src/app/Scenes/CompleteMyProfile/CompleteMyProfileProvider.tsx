import { CompleteMyProfileProviderQuery } from "__generated__/CompleteMyProfileProviderQuery.graphql"
import { Routes } from "app/Scenes/CompleteMyProfile/CompleteMyProfile"
import {
  StepsResult,
  useCompleteMyProfileSteps,
} from "app/Scenes/CompleteMyProfile/useCompleteMyProfileSteps"
import { LocationWithDetails } from "app/utils/googleMaps"
import React, { Dispatch, createContext, useContext, useMemo, useReducer } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

type User = Partial<NonNullable<CompleteMyProfileProviderQuery["response"]>["me"]>

export interface CompleteMyProfileContextProps {
  steps: StepsResult
  user: User
  progressState: State
  setProgressState: Dispatch<Action>
  progressStateWithoutUndefined: State
}

export const CompleteMyProfileContext = createContext<CompleteMyProfileContextProps>({
  steps: "loading",
  user: {},
  progressState: {},
  setProgressState: () => {},
  progressStateWithoutUndefined: {},
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

  const { steps } = useCompleteMyProfileSteps({ collectorProfile: data?.me })
  const [progressState, setProgressState] = useReducer(reducer, {})

  const progressStateWithoutUndefined: State = useMemo(
    () =>
      Object.entries(progressState)
        .filter(([_, value]) => !!value)
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
    [progressState]
  )

  return (
    <CompleteMyProfileContext.Provider
      value={{
        steps,
        user: data?.me ?? {},
        progressState,
        setProgressState,
        progressStateWithoutUndefined,
      }}
    >
      {children}
    </CompleteMyProfileContext.Provider>
  )
}

export const useCompleteMyProfileContext = () => {
  return useContext(CompleteMyProfileContext)
}

const query = graphql`
  query CompleteMyProfileProviderQuery {
    me @required(action: NONE) {
      internalID @required(action: NONE)
      email @required(action: NONE)
      initials @required(action: NONE)
      ...useCompleteMyProfileSteps_collectorProfile
    }
  }
`

export type State = {
  profession?: string
  location?: Partial<LocationWithDetails>
  iconUrl?: { localPath: string; geminiUrl: string }
  isIdentityVerified?: boolean
}

type Action = { type: keyof State; value: State[keyof State] }

const reducer = (state: State, action: Action) => {
  return {
    ...state,
    [action.type]: action.value,
  }
}

export const ROUTE_ACTION_TYPES: Record<Exclude<Routes, "ChangesSummary">, keyof State> = {
  LocationStep: "location",
  ProfessionStep: "profession",
  AvatarStep: "iconUrl",
  IdentityVerificationStep: "isIdentityVerified",
}

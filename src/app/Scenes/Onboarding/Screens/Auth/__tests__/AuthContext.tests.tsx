import { act, renderHook } from "@testing-library/react-native"
import {
  AuthContext,
  AuthContextModel,
  defaultState,
} from "app/Scenes/Onboarding/Screens/Auth/AuthContext"

describe("AuthContext", () => {
  const setup = (initialState: Partial<AuthContextModel>) => {
    const view = renderHook(
      () => ({
        state: AuthContext.useStoreState((state) => state),
        actions: AuthContext.useStoreActions((action) => action),
      }),
      {
        wrapper: ({ children }: any) => (
          <AuthContext.Provider runtimeModel={{ ...defaultState, ...initialState }}>
            {children}
          </AuthContext.Provider>
        ),
      }
    )

    return {
      getState: () => view.result.current.state,
      actions: view.result.current.actions,
    }
  }

  it("sets up intial context and action helpers", () => {
    const { getState, actions } = setup({})

    expect(Object.keys(getState())).toEqual([
      "currentScreen",
      "isModalExpanded",
      "isMounted",
      "previousScreens",
    ])

    expect(Object.keys(actions)).toEqual([
      "goBack",
      "setCurrentScreen",
      "setModalExpanded",
      "setParams",
    ])
  })

  describe("actions", () => {
    it("goBack", () => {
      const { getState, actions } = setup({
        currentScreen: { name: "SignUpNameStep" },
        previousScreens: [{ name: "LoginWelcomeStep" }, { name: "SignUpPasswordStep" }],
      })

      act(() => actions.goBack())

      expect(getState().currentScreen).toEqual({ name: "SignUpPasswordStep" })
    })

    it("doesn't goBack when there are no previous screens", () => {
      const { getState, actions } = setup({
        currentScreen: { name: "LoginWelcomeStep" },
        previousScreens: [],
      })

      act(() => actions.goBack())

      expect(getState().currentScreen).toEqual({ name: "LoginWelcomeStep" })
    })

    it("setCurrentScreen", () => {
      const { getState, actions } = setup({ currentScreen: { name: "LoginWelcomeStep" } })

      act(() => actions.setCurrentScreen({ name: "LoginPasswordStep" }))

      expect(getState().currentScreen).toEqual({ name: "LoginPasswordStep" })
    })

    it("setModalExpanded", () => {
      const { getState, actions } = setup({})

      act(() => actions.setModalExpanded(true))

      expect(getState().isModalExpanded).toBe(true)
      expect(getState().isMounted).toBe(true)

      act(() => actions.setModalExpanded(false))

      expect(getState().isModalExpanded).toBe(false)
      expect(getState().isMounted).toBe(true)
    })

    it("setParams", () => {
      const { getState, actions } = setup({})

      act(() => actions.setParams({ email: "foo@bar.baz" }))

      expect(getState().currentScreen?.params).toEqual({ email: "foo@bar.baz" })
    })
  })
})

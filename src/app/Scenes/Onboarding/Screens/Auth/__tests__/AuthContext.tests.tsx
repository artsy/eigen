import { act, renderHook } from "@testing-library/react-native"
import {
  AuthContext,
  AuthContextModel,
  defaultState,
} from "app/Scenes/Onboarding/Screens/Auth/AuthContext"

describe("AuthContext", () => {
  const setup = async (initialState: Partial<AuthContextModel>) => {
    const view = await renderHook(
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

  it("sets up intial context and action helpers", async () => {
    const { getState, actions } = await setup({})

    expect(Object.keys(getState())).toEqual([
      "currentScreen",
      "isModalExpanded",
      "isMounted",
      "previousScreens",
      "isAutomaticallySubscribed",
    ])

    expect(Object.keys(actions)).toEqual([
      "goBack",
      "setCurrentScreen",
      "setModalExpanded",
      "setParams",
      "setIsAutomaticallySubscribed",
    ])
  })

  describe("actions", () => {
    it("goBack", async () => {
      const { getState, actions } = await setup({
        currentScreen: { name: "SignUpNameStep" },
        previousScreens: [{ name: "LoginWelcomeStep" }, { name: "SignUpPasswordStep" }],
      })

      await act(() => actions.goBack())

      expect(getState().currentScreen).toEqual({ name: "SignUpPasswordStep" })
    })

    it("doesn't goBack when there are no previous screens", async () => {
      const { getState, actions } = await setup({
        currentScreen: { name: "LoginWelcomeStep" },
        previousScreens: [],
      })

      await act(() => actions.goBack())

      expect(getState().currentScreen).toEqual({ name: "LoginWelcomeStep" })
    })

    it("setCurrentScreen", async () => {
      const { getState, actions } = await setup({ currentScreen: { name: "LoginWelcomeStep" } })

      await act(() => actions.setCurrentScreen({ name: "LoginPasswordStep" }))

      expect(getState().currentScreen).toEqual({ name: "LoginPasswordStep" })
    })

    it("setModalExpanded", async () => {
      const { getState, actions } = await setup({})

      await act(() => actions.setModalExpanded(true))

      expect(getState().isModalExpanded).toBe(true)
      expect(getState().isMounted).toBe(true)

      await act(() => actions.setModalExpanded(false))

      expect(getState().isModalExpanded).toBe(false)
      expect(getState().isMounted).toBe(true)
    })

    it("setParams", async () => {
      const { getState, actions } = await setup({})

      await act(() => actions.setParams({ email: "foo@bar.baz" }))

      expect(getState().currentScreen?.params).toEqual({ email: "foo@bar.baz" })
    })
  })
})

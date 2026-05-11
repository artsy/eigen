import { GlobalStore } from "app/store/GlobalStore"

export const useEchoMessage = (name: string): string | undefined => {
  return GlobalStore.useAppState(
    (state) =>
      state.artsyPrefs.echo.state.messages.find((message) => message.name === name)?.content
  )
}

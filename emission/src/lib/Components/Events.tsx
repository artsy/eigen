export interface SwitchEvent {
  nativeEvent: {
    selectedIndex: number
  }
}

export type TabSelectionEvent = SwitchEvent

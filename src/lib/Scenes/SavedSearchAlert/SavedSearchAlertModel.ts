export interface SavedSearchAlertFormValues {
  name: string
}

export interface SavedSearchAlertFormPropsBase {
  artist: {
    id: string
    name: string
  }
}

export type SavedSearchAlertFormMode = "create" | "update"

import { PreviewPR } from "app/system/devTools/DevMenu/utils/previewPR"
import { action, Action } from "easy-peasy"

export interface PreviewPRModel {
  value: PreviewPR | null
  setValue: Action<this, PreviewPR | null>
}

export const getPreviewPRModel = (): PreviewPRModel => ({
  value: null,
  setValue: action((state, value) => {
    state.value = value
  }),
})

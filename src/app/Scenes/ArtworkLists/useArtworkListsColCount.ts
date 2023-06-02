import { isPad } from "app/utils/hardware"

export const useArtworkListsColCount = () => {
  if (isPad()) {
    return 3
  }

  return 2
}

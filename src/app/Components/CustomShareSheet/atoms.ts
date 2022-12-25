import { atom, useAtom } from "jotai"
import { Item } from "./types"

const visibleAtom = atom(false)
const itemAtom = atom<Item | null>(null)

export const useCustomShareSheet = () => {
  const [, setVisible] = useAtom(visibleAtom)
  const [item, setItem] = useAtom(itemAtom)

  const show = (i: typeof item) => {
    setItem(i)
    setVisible(true)
  }

  const hide = () => void setVisible(false)

  return { show, hide }
}

export const useCustomShareSheetInternal = () => {
  const { show, hide } = useCustomShareSheet()
  const [visible] = useAtom(visibleAtom)
  const [item] = useAtom(itemAtom)

  return { visible, item, show, hide }
}

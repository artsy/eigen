import { Ref } from "react"

export interface RailScrollRef {
  scrollToTop: () => void
}

export interface RailScrollProps {
  scrollRef: Ref<RailScrollRef>
}

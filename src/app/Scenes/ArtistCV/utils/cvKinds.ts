export type CVKind = "solo" | "group" | "fair"

export const CV_KIND_LABELS: Record<CVKind, string> = {
  solo: "Solo shows",
  group: "Group shows",
  fair: "Fair booths",
}

export const CV_KIND_ORDER: CVKind[] = ["solo", "group", "fair"]

export type ShareSheetItem =
  | { type: "artwork"; slug: string; currentImageIndex?: number }
  | { type: "sale"; slug: string }
  | { type: "artist"; slug: string }

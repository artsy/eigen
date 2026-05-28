export type AuthIntent =
  | "save_artwork"
  | "follow_artist"
  | "contact_gallery"
  | "make_offer"
  | "bid"
  | "purchase"
  | "create_alert"
  | "generic"

export interface AuthBottomSheetPresentOptions {
  intent?: AuthIntent
}

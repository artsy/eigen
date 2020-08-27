import { MyBids_me } from "__generated__/MyBids_me.graphql"
import { MyBids_sales } from "__generated__/MyBids_sales.graphql"

export type LotStanding = NonNullable<
  NonNullable<NonNullable<MyBids_me["auctionsLotStandingConnection"]>["edges"]>[0]
>["node"]
export type Sale = NonNullable<NonNullable<NonNullable<MyBids_sales["edges"]>[0]>["node"]>

export const CARD_HEIGHT = 72

import { isEmpty } from "lodash"

interface SaleProps {
  isAuction: boolean | null | undefined
  isClosed: boolean | null | undefined
}

export const isOpenOrUpcomingSale = (sale: SaleProps | null | undefined) => {
  return Boolean(!isEmpty(sale) && sale?.isAuction && !sale?.isClosed)
}

import { isEmpty } from "lodash"

interface SaleProps {
  isAuction: boolean | null
  isClosed: boolean | null
}

export const isOpenOrUpcomingSale = (sale: SaleProps | null) => {
  return Boolean(!isEmpty(sale) && sale?.isAuction && !sale?.isClosed)
}

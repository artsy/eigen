/** An enum for the different hard-coded routes in Emission */
export enum Router {
  /** The VC for submission modal */
  ConsignmentsStartSubmission = "/sell/submissions/new",
  /** The screen showing your consignments */
  SellingOverview = "/user/selling",
  /** Artsy Privacy Policy */
  PrivacyPage = "/privacy",
  /** Artsy TOS */
  TermsOfService = "/terms",
}

export interface PartialShowForRouting {
  is_fair_booth: boolean | null | undefined
  slug: string
  href: string | null | undefined
}

/** Takes a subset of a Show and makes a linkable URL */
export const hrefForPartialShow = (show: PartialShowForRouting) => {
  const { is_fair_booth } = show
  const href = show.href || `show/${show.slug}`
  if (is_fair_booth) {
    return `${href}?entity=fair-booth`
  } else {
    return href
  }
}

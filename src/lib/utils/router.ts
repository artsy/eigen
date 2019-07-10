/** An enum for the different hard-coded routes in Emission */
export enum Router {
  /** The VC for submission modal */
  ConsignmentsStartSubmission = "/consign/submission",
  /** The screen showing your consignments */
  SellingOverview = "/user/selling",
  /** User settings, note that it's not the same as forces, as force's has more settings today */
  UserSettingsiOS = "/profile/edit/ios",
  /** Artsy Privacy Policy */
  PrivacyPage = "/privacy",
  /** Artsy TOS */
  TermsOfService = "/terms",
}

export interface PartialShowForRouting {
  is_fair_booth: boolean
  gravityID: string
  href: string
}

/** Takes a subset of a Show and makes a linkable URL */
export const hrefForPartialShow = (show: PartialShowForRouting) => {
  const { is_fair_booth } = show
  if (is_fair_booth) {
    return `${show.gravityID}?entity=fair-booth`
  } else {
    return show.href || `show/${show.gravityID}`
  }
}

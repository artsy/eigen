interface IdentityVerificationRequireable {
  requireIdentityVerification: boolean
}

interface IdentityVerifiable {
  identityVerified: boolean
}

interface Bidder {
  qualifiedForBidding: boolean
}

/**
 * Determine if the current user needs to perform identity verification
 * for the sale.
 *
 * Note: If the user is already registered to bid, then the sale doesn't
 * requireIdentityVerification OR the user was manually approved by an
 * admin. In either case, they don't need identity verification at this
 * time.
 */
export const bidderNeedsIdentityVerification = ({
  sale,
  user,
  bidder,
}: {
  sale: IdentityVerificationRequireable
  user?: IdentityVerifiable
  bidder?: Bidder
}) => {
  return !bidder?.qualifiedForBidding && sale.requireIdentityVerification && !user?.identityVerified
}

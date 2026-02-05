# Legacy Commerce GraphQL Schema Inventory - Eigen

**Last Updated**: 2026-02-05

---

## Executive Summary

### Usage Statistics

- **Queries Used**: 1 (`commerceMyOrders`)
- **Mutations Used**: 3 (all for order creation)
- **Mutations Defined but Unused**: 24+
- **Component Files**: 8
- **Test Files**: 4+

### Critical Finding

⚠️ **Eigen uses a very limited subset of the commerce schema**:
- Only 3 mutations for initial order creation
- Only 1 query for fetching user orders
- No seller-side operations, no order management (approve, reject, ship, etc.)
- Rest of checkout flow likely happens in webview

---

## GraphQL Queries

### 1. `commerceMyOrders` ✅ ACTIVELY USED

**Parameters**: `first`, `filters` (e.g., PAYMENT_FAILED), `states`, `mode`, `sellerId`, `sort`

**Used In**:
- **[PaymentFailureBanner.tsx](src/app/Scenes/HomeView/Components/PaymentFailureBanner.tsx)** - Shows banner when user has payment failures
- **[OrderHistory.tsx](src/app/Scenes/OrderHistory/OrderHistory.tsx)** - Displays paginated order list
- **[useHomeViewTracking.ts](src/app/Scenes/HomeView/hooks/useHomeViewTracking.ts)** - Analytics context

**Returns**: `CommerceOrderConnectionWithTotalCount` with order edges containing `code`, `internalID`, `mode`, `state`, line items

---

### 2. `commerceOrder` & `commerceOrders` ⚠️ DEFINED BUT NOT USED

Defined in schema but no usage found in Eigen codebase.

---

## GraphQL Mutations

### 1. `commerceCreateOrderWithArtwork` ✅ ACTIVELY USED

**Purpose**: Create direct purchase order when user clicks "Buy Now"

**Location**: [useCreateOrder.ts](src/app/Scenes/Artwork/hooks/useCreateOrder.ts)

**Input**:
```typescript
{
  artworkId: String!
  editionSetId?: String
  quantity?: Int
}
```

**Used By**: [BuyNowButton.tsx](src/app/Scenes/Artwork/Components/CommercialButtons/BuyNowButton.tsx)

**Returns**: Union type:
- Success: `CommerceOrderWithMutationSuccess` → `{ order: { internalID, mode } }`
- Failure: `CommerceOrderWithMutationFailure` → `{ error: { type, code, data } }`

---

### 2. `commerceCreateOfferOrderWithArtwork` ✅ ACTIVELY USED

**Purpose**: Create offer order to initiate negotiation

**Locations**:
- [MakeOfferButton.tsx](src/app/Scenes/Artwork/Components/CommercialButtons/MakeOfferButton.tsx) - Uses legacy `commitMutation`
- [InquiryMakeOfferButton.tsx](src/app/Scenes/Inbox/Components/Conversations/InquiryMakeOfferButton.tsx) - Offer via conversation

**Input**:
```typescript
{
  artworkId: String!
  editionSetId?: String
  partnerOfferId?: String
}
```

**Returns**: Same union type as above

---

### 3. `commerceCreatePartnerOfferOrder` ✅ ACTIVELY USED

**Purpose**: Create order from limited-time partner promotional offer

**Location**: [usePartnerOfferCheckoutMutation.tsx](src/app/Scenes/PartnerOffer/mutations/usePartnerOfferCheckoutMutation.tsx)

**Input**:
```typescript
{
  partnerOfferId: String!
  editionSetId?: String
  impulseConversationId?: String
  quantity?: Int
}
```

**Used By**:
- [PartnerOfferContainer.tsx](src/app/Scenes/PartnerOffer/PartnerOfferContainer.tsx) - Auto-executes on mount
- [BuyNowButton.tsx](src/app/Scenes/Artwork/Components/CommercialButtons/BuyNowButton.tsx) - Detects active offers

**Special Error Codes**:
- `expired_partner_offer` - Offer expired
- `not_acquireable` - Artwork unavailable

**Features**: Sentry error logging in production

---

## Unused Mutations (24+)

These are **defined in schema** but **NOT used** in Eigen:

### Order Submission & Approval
`commerceSubmitOrder`, `commerceSubmitOrderWithOffer`, `commerceSubmitPendingOffer`, `commerceApproveOrder`

### Buyer Offer Actions
`commerceAddInitialOfferToOrder`, `commerceBuyerAcceptOffer`, `commerceBuyerCounterOffer`, `commerceBuyerRejectOffer`

### Seller Offer Actions
`commerceSellerAcceptOffer`, `commerceSellerAcceptProvisionalOffer`, `commerceSellerCounterOffer`, `commerceSellerRejectOffer`

### Payment Operations
`commerceSetPayment`, `commerceSetPaymentByStripeIntent`, `commerceFixFailedPayment`, `commerceCreateBankDebitSetupForOrder`

### Shipping Operations
`commerceSetShipping`, `commerceSelectShippingOption`, `commerceConfirmFulfillment`, `commerceConfirmPickup`, `commerceFulfillAtOnce`

### Inquiry Orders
`commerceCreateInquiryOfferOrderWithArtwork`, `commerceCreateInquiryOrderWithArtwork`

### Miscellaneous
`commerceUpdateImpulseConversationId`, `commerceOptIn`, `commerceOptInReport`

---

## Component Files Using Commerce Schema

### Purchase Flow

**1. [BuyNowButton.tsx](src/app/Scenes/Artwork/Components/CommercialButtons/BuyNowButton.tsx)**
- Mutations: `commerceCreateOrderWithArtwork`, `commerceCreatePartnerOfferOrder`
- Logic: Detects active partner offers, routes to appropriate mutation
- Error handling: Toast messages

**2. [useCreateOrder.ts](src/app/Scenes/Artwork/hooks/useCreateOrder.ts)**
- Hook wrapping `commerceCreateOrderWithArtwork`
- Modern `useMutation` pattern

**3. [usePartnerOfferCheckoutMutation.tsx](src/app/Scenes/PartnerOffer/mutations/usePartnerOfferCheckoutMutation.tsx)**
- Hook wrapping `commerceCreatePartnerOfferOrder`
- Sentry error logging

**4. [PartnerOfferContainer.tsx](src/app/Scenes/PartnerOffer/PartnerOfferContainer.tsx)**
- Auto-executes partner offer mutation on mount
- Countdown timer, error modals

### Offer Flow

**5. [MakeOfferButton.tsx](src/app/Scenes/Artwork/Components/CommercialButtons/MakeOfferButton.tsx)**
- Mutation: `commerceCreateOfferOrderWithArtwork`
- Uses legacy `commitMutation` API ⚠️

**6. [InquiryMakeOfferButton.tsx](src/app/Scenes/Inbox/Components/Conversations/InquiryMakeOfferButton.tsx)**
- Same mutation within conversation context

### Order Display

**7. [PaymentFailureBanner.tsx](src/app/Scenes/HomeView/Components/PaymentFailureBanner.tsx)**
- Query: `commerceMyOrders(filters: [PAYMENT_FAILED])`
- Auto-refetches on screen focus
- Shows banner with order code/count

**8. [OrderHistory.tsx](src/app/Scenes/OrderHistory/OrderHistory.tsx)** + **[OrderHistoryRow.tsx](src/app/Scenes/OrderHistory/OrderHistoryRow.tsx)**
- Query: `commerceMyOrders` with pagination
- Displays order list with artwork thumbnails, status, pricing

---

## Generated TypeScript Files

**Mutations**:
- `useCreateOrderMutation.graphql.ts`
- `usePartnerOfferCheckoutMutation.graphql.ts`
- `MakeOfferButtonOrderMutation.graphql.ts`
- `InquiryMakeOfferButtonOrderMutation.graphql.ts`

**Queries/Fragments**:
- `PaymentFailureBanner_Fragment.graphql.ts`
- `PaymentFailureBannerQuery.graphql.ts`
- `PaymentFailureBannerRefetchQuery.graphql.ts`
- `OrderHistoryRow_order.graphql.ts`
- `OrderHistory_me.graphql.ts`

---

## Test Files

1. **[PaymentFailureBanner.tests.tsx](src/app/Scenes/HomeView/Components/__tests__/PaymentFailureBanner.tests.tsx)**
   - Tests `commerceMyOrders` with PAYMENT_FAILED filter
   - Scenarios: single/multiple failures, no failures, refetch, navigation

2. **[PartnerOfferContainer.tests.tsx](src/app/Scenes/PartnerOffer/__tests__/PartnerOfferContainer.tests.tsx)**
   - Tests `commerceCreatePartnerOfferOrder` responses
   - Scenarios: success, expired offer, unavailable artwork, generic errors

3. **[OrderHistoryRow.tests.tsx](src/app/Scenes/OrderHistory/__tests__/OrderHistoryRow.tests.tsx)** + **[OrderHistory.tests.tsx](src/app/Scenes/OrderHistory/__tests__/OrderHistory.tests.tsx)**
   - Tests order rendering, pagination, empty states

---

## Application Areas

### 1. Artwork Purchase Flow
- User taps "Buy Now" → `commerceCreateOrderWithArtwork` → navigate to order confirmation
- Components: BuyNowButton, useCreateOrder

### 2. Offer Negotiation
- User taps "Make an Offer" → `commerceCreateOfferOrderWithArtwork` → offer submission screen
- Components: MakeOfferButton, InquiryMakeOfferButton

### 3. Limited-Time Partner Offers
- User accepts partner offer → `commerceCreatePartnerOfferOrder` → order confirmation
- Features: countdown timer, expiration handling, Sentry logging
- Components: BuyNowButton (with detection), PartnerOfferContainer

### 4. Payment Status Monitoring
- Query: `commerceMyOrders(filters: [PAYMENT_FAILED])`
- Banner on home screen, auto-refetch on focus
- Component: PaymentFailureBanner

### 5. Order History
- Query: `commerceMyOrders` with pagination
- Infinite scroll, pull-to-refresh, order details
- Components: OrderHistory, OrderHistoryRow

---

## Files Requiring Migration

### P0 - Critical (Core Purchase Flow)

1. **[useCreateOrder.ts](src/app/Scenes/Artwork/hooks/useCreateOrder.ts)**
   - Mutation: `commerceCreateOrderWithArtwork`
   - Impact: Blocks all direct purchases

2. **[BuyNowButton.tsx](src/app/Scenes/Artwork/Components/CommercialButtons/BuyNowButton.tsx)**
   - Mutations: Both `commerceCreateOrderWithArtwork` and `commerceCreatePartnerOfferOrder`
   - Impact: Primary CTA on all artwork pages

3. **[usePartnerOfferCheckoutMutation.tsx](src/app/Scenes/PartnerOffer/mutations/usePartnerOfferCheckoutMutation.tsx)**
   - Mutation: `commerceCreatePartnerOfferOrder`
   - Impact: Blocks partner offer acceptance

### P1 - High (Offer Flow)

4. **[MakeOfferButton.tsx](src/app/Scenes/Artwork/Components/CommercialButtons/MakeOfferButton.tsx)**
   - Mutation: `commerceCreateOfferOrderWithArtwork`
   - Note: Uses legacy `commitMutation` - migrate to `useMutation`

5. **[InquiryMakeOfferButton.tsx](src/app/Scenes/Inbox/Components/Conversations/InquiryMakeOfferButton.tsx)**
   - Same mutation, inquiry context

### P1 - High (Payment Monitoring)

6. **[PaymentFailureBanner.tsx](src/app/Scenes/HomeView/Components/PaymentFailureBanner.tsx)**
   - Query: `commerceMyOrders(filters: [PAYMENT_FAILED])`
   - Impact: Users won't be notified of payment failures

### P2 - Medium (Order Display)

7. **[OrderHistory.tsx](src/app/Scenes/OrderHistory/OrderHistory.tsx)** + **[OrderHistoryRow.tsx](src/app/Scenes/OrderHistory/OrderHistoryRow.tsx)**
   - Query: `commerceMyOrders` with pagination
   - Fragment: `OrderHistoryRow_order` on `CommerceOrder`
   - Impact: Order history screen breaks

8. **[PartnerOfferContainer.tsx](src/app/Scenes/PartnerOffer/PartnerOfferContainer.tsx)**
   - Mutation: `commerceCreatePartnerOfferOrder`
   - Impact: Dedicated partner offer screen

---

## Migration Strategy

### Phase 1: Analysis ✅
1. ✅ Inventory complete
2. **Next**: Map old → new schema
3. **Next**: Identify breaking changes

### Phase 2: Preparation
- Create feature flags for gradual rollout
- Setup monitoring (success/failure rates)
- Prepare rollback plan
- Generate new TypeScript types

### Phase 3: Implementation (5 Weeks)

**Week 1: Core Purchase**
- Update useCreateOrder + BuyNowButton
- Feature flag, staging tests

**Week 2: Partner Offers**
- Update usePartnerOfferCheckoutMutation + PartnerOfferContainer

**Week 3: Offer Flow**
- Update MakeOfferButton + InquiryMakeOfferButton
- Migrate commitMutation → useMutation

**Week 4: Status & History**
- Update PaymentFailureBanner + OrderHistory components

**Week 5: Testing & Rollout**
- E2E testing, update test files
- Gradual rollout with monitoring

### Phase 4: Cleanup
- Remove old code, feature flags
- Delete old generated files

---

## Risk Assessment

**High Risk**: BuyNowButton (critical purchase flow), PaymentFailureBanner (user notifications), Partner offers (time-sensitive)

**Medium Risk**: Offer creation, Order history

**Low Risk**: Order display (read-only)

---

## Key Type Definitions

### Input Types
```typescript
// CommerceCreateOrderWithArtworkInput
{ artworkId: String!, editionSetId?: String, quantity?: Int }

// CommerceCreateOfferOrderWithArtworkInput
{ artworkId: String!, editionSetId?: String, partnerOfferId?: String }

// CommerceCreatePartnerOfferOrderInput
{ partnerOfferId: String!, editionSetId?: String, impulseConversationId?: String, quantity?: Int }
```

### Response Types
```typescript
// Success
{ __typename: "CommerceOrderWithMutationSuccess", order: { internalID, mode } }

// Failure
{ __typename: "CommerceOrderWithMutationFailure", error: { type, code, data } }
```

### Enums
- `CommerceOrderModeEnum`: BUY | OFFER
- `CommerceOrderStateEnum`: ABANDONED, APPROVED, CANCELED, FULFILLED, PENDING, SUBMITTED, etc.
- `CommerceOrderConnectionFilterEnum`: PAYMENT_FAILED, etc.

---

## Implementation Patterns

### Modern Pattern (Preferred)
```typescript
const { mutate } = useCreateOrder()
await mutate({ variables: { input: { artworkId } } })
```

### Legacy Pattern (MakeOfferButton only)
```typescript
commitMutation(relayEnvironment, {
  mutation,
  variables: { input },
  onCompleted: (response) => { /* navigate */ },
  onError: (error) => { /* show toast */ }
})
```

### Error Handling
```typescript
if (orderOrError?.__typename === "CommerceOrderWithMutationFailure") {
  const { code } = orderOrError.error
  if (code === "expired_partner_offer") { /* show modal */ }
  else { Toast.show("An error occurred") }
}
```

### Navigation
```typescript
navigate(`/orders/${order.internalID}`)
navigate(`/orders/${order.internalID}/offer`) // For offers
```

---

## Testing Checklist

- [ ] Regular purchase flow works end-to-end
- [ ] Partner offer purchase works
- [ ] Offer creation from artwork page
- [ ] Offer creation from inquiry
- [ ] Payment failure banner displays/refetches correctly
- [ ] Order history pagination works
- [ ] All error states handled (expired, unavailable)
- [ ] Analytics events fire correctly
- [ ] Sentry logging works
- [ ] All tests pass
- [ ] No TypeScript errors

---

## Questions for New API Design

1. Will new API maintain union type pattern for success/error responses?
2. Will order IDs remain consistent (internalID for navigation)?
3. Will error codes remain the same (expired_partner_offer, not_acquireable)?
4. How will pagination work?
5. Will filtering options remain (PAYMENT_FAILED)?
6. Any new required fields?
7. Will mutation input structure change significantly?
8. How to handle dual APIs during migration period?

---

## Quick Reference

### All Commerce Mutations Used
1. `commerceCreateOrderWithArtwork` - Buy order
2. `commerceCreateOfferOrderWithArtwork` - Offer order
3. `commerceCreatePartnerOfferOrder` - Partner offer order

### All Commerce Queries Used
1. `commerceMyOrders` - User's orders

### Files by Priority
**P0**: useCreateOrder.ts, BuyNowButton.tsx, usePartnerOfferCheckoutMutation.tsx
**P1**: MakeOfferButton.tsx, InquiryMakeOfferButton.tsx, PaymentFailureBanner.tsx
**P2**: OrderHistory.tsx, OrderHistoryRow.tsx, PartnerOfferContainer.tsx

---

**End of Document**

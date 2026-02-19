# Feature Flags Cleanup Audit

**Audit Date:** 2026-02-19
**Criteria:** Feature flags with `readyForRelease: true` for more than 6 months (before 2025-08-19)

## Summary

Found **18 feature flags** that have been stable for over 6 months and are candidates for cleanup. These flags should be evaluated for removal, with their code paths either permanently enabled or removed.

### Echo Production Status (checked 2026-02-19)

- **17 flags are ENABLED** (`true`) in production - prime candidates for cleanup
- **1 flag is DISABLED** (`false`) in production - `AREnableArtworksConnectionForAuction` (the oldest flag!)

---

## Ancient Flags (2+ years old)

### 1. AREnableArtworksConnectionForAuction

- **Stable since:** 2022-07-26 (~3.5 years)
- **Description:** Use artworksConnection for Auction screen
- **Echo Flag:** `AREnableArtworksConnectionForAuction`
- **Echo Status:** ❌ **DISABLED** (`false`)
- **Notes:** ⚠️ Already has TODO comment: "need to refresh it before releasing to avoid leaking the feature in not ready releases, marked as ready since 15 months ago". This flag has been ready for 3.5 years but is DISABLED in production - likely dead code that should be removed.
- **Priority:** 🔴 CRITICAL - Dead code removal candidate

### 2. ARImpressionsTrackingHomeItemViews

- **Stable since:** 2023-04-24 (~2.8 years)
- **Description:** Enable Tracking Items views on Home Screen
- **Echo Flag:** `ARImpressionsTrackingHomeItemViews`
- **Echo Status:** ✅ **ENABLED** (`true`)
- **Priority:** 🔴 HIGH

### 3. AREnableNewAuctionsRailCard

- **Stable since:** 2023-04-27 (~2.8 years)
- **Description:** Enable New Auctions Home Rail Card
- **Echo Flag:** `AREnableNewAuctionsRailCard`
- **Echo Status:** ✅ **ENABLED** (`true`)
- **Priority:** 🔴 HIGH

### 4. AREnableAdditionalSiftAndroidTracking

- **Stable since:** 2023-07-17 (~2.6 years)
- **Description:** Send additional events to Sift on Android
- **Echo Flag:** `AREnableAdditionalSiftAndroidTracking`
- **Echo Status:** ✅ **ENABLED** (`true`)
- **Priority:** 🔴 HIGH

### 5. AREnableAuctionHeaderAlertCTA

- **Stable since:** 2023-09-18 (~2.4 years)
- **Description:** Enable Auction Header Alert CTA
- **Echo Flag:** `AREnableAuctionHeaderAlertCTA`
- **Echo Status:** ✅ **ENABLED** (`true`)
- **Priority:** 🔴 HIGH

### 6. ARShowCreateAlertInArtistArtworksListFooter

- **Stable since:** 2023-09-21 (~2.4 years)
- **Description:** Show create alert in artist artworks list footer
- **Echo Flag:** `ARShowCreateAlertInArtistArtworksListFooter`
- **Echo Status:** ✅ **ENABLED** (`true`)
- **Priority:** 🔴 HIGH

---

## Very Old Flags (1-2 years)

### 7. AREnablePartnerOffer

- **Stable since:** 2024-02-02 (~2 years)
- **Description:** Enable partner offer content in the app
- **Echo Flag:** `AREnablePartnerOffer`
- **Echo Status:** ✅ **ENABLED** (`true`)
- **Priority:** 🟡 MEDIUM-HIGH

### 8. AREnablePartnerOffersNotificationSwitch

- **Stable since:** 2024-02-08 (~2 years)
- **Description:** Enable partner offers notification switch
- **Echo Flag:** `AREnablePartnerOffersNotificationSwitch`
- **Echo Status:** ✅ **ENABLED** (`true`)
- **Priority:** 🟡 MEDIUM-HIGH

### 9. AREnableAlertBottomSheet

- **Stable since:** 2024-03-14 (~1.9 years)
- **Description:** Enable tapping on alerts to show bottom sheet
- **Echo Flag:** `AREnableAlertBottomSheet`
- **Echo Status:** ✅ **ENABLED** (`true`)
- **Priority:** 🟡 MEDIUM-HIGH

### 10. AREnableArtworkListOfferability

- **Stable since:** 2024-04-09 (~1.9 years)
- **Description:** Enable Parnter Offer v1.5, edit sharing artwork list with partners for offers
- **Echo Flag:** `AREnableArtworkListOfferability`
- **Echo Status:** ✅ **ENABLED** (`true`)
- **Priority:** 🟡 MEDIUM-HIGH

### 11. AREnableCollectionsWithoutHeaderImage

- **Stable since:** 2024-08-16 (~1.5 years)
- **Description:** Remove the header image from collections
- **Echo Flag:** `AREnableCollectionsWithoutHeaderImage`
- **Echo Status:** ✅ **ENABLED** (`true`)
- **Priority:** 🟡 MEDIUM

### 12. AREnableExpiredPartnerOffers

- **Stable since:** 2024-08-16 (~1.5 years)
- **Description:** Enable expired partner offers handling
- **Echo Flag:** `AREnableExpiredPartnerOffers`
- **Echo Status:** ✅ **ENABLED** (`true`)
- **Priority:** 🟡 MEDIUM

### 13. AREnablePaymentFailureBanner

- **Stable since:** 2024-11-06 (~1.3 years)
- **Description:** Enable payment failure banner
- **Echo Flag:** `AREnablePaymentFailureBanner`
- **Echo Status:** ✅ **ENABLED** (`true`)
- **Priority:** 🟡 MEDIUM

---

## Old Flags (6 months - 1 year)

### 14. AREnableHidingDislikedArtworks

- **Stable since:** 2025-01-28 (~1 year)
- **Description:** Enable hiding disliked artworks
- **Echo Flag:** `AREnableHidingDislikedArtworks`
- **Echo Status:** ✅ **ENABLED** (`true`)
- **Priority:** 🟢 MEDIUM-LOW

### 15. AREnableProgressiveOnboardingAlerts

- **Stable since:** 2025-01-30 (~1 year)
- **Description:** Enable progressive onboarding alerts
- **Echo Flag:** `AREnableProgressiveOnboardingAlerts`
- **Echo Status:** ✅ **ENABLED** (`true`)
- **Priority:** 🟢 MEDIUM-LOW

### 16. ARDarkModeSupport

- **Stable since:** 2025-04-24 (~10 months)
- **Description:** Support dark mode
- **Echo Flag:** `ARDarkModeSupport`
- **Echo Status:** ✅ **ENABLED** (`true`)
- **Priority:** 🟢 LOW

### 17. AREnabledDiscoverDailyNegativeSignals

- **Stable since:** 2025-07-31 (~6.6 months)
- **Description:** Enable negative signals in Discover Daily
- **Echo Flag:** `AREnabledDiscoverDailyNegativeSignals`
- **Echo Status:** ✅ **ENABLED** (`true`)
- **Priority:** 🟢 LOW

### 18. ARShowOnboardingPriceRangeScreen

- **Stable since:** 2025-07-31 (~6.6 months)
- **Description:** Show onboarding price range screen
- **Echo Flag:** `ARShowOnboardingPriceRangeScreen`
- **Echo Status:** ✅ **ENABLED** (`true`)
- **Priority:** 🟢 LOW

---

## Next Steps

1. ✅ **Echo Flag Check:** COMPLETED - 17 enabled, 1 disabled
2. **Code Usage Analysis:** For each flag, identify all locations where it's referenced
3. **Cleanup Strategy:**
   - **For enabled flags (17 total):** Remove flag checks and "false" code paths, keep only the "true" behavior
   - **For disabled flag (AREnableArtworksConnectionForAuction):** Investigate why it's disabled, then remove both flag and associated code
4. **Cleanup Process:** For each flag:
   - Find all usages in codebase
   - Remove the flag check
   - Remove the unwanted code path
   - Remove the flag definition from `features.ts`
   - (Optional) Remove the echo flag from echo config after deployment
5. **Testing:** Ensure no regressions after flag removal

## Cleanup Checklist

- [ ] AREnableArtworksConnectionForAuction (PRIORITY)
- [x] ARImpressionsTrackingHomeItemViews - **COMPLETED 2026-02-19**
- [x] AREnableNewAuctionsRailCard - **COMPLETED 2026-02-19**
- [x] AREnableAdditionalSiftAndroidTracking - **COMPLETED 2026-02-19**
- [x] AREnableAuctionHeaderAlertCTA - **COMPLETED 2026-02-19**
- [x] ARShowCreateAlertInArtistArtworksListFooter - **COMPLETED 2026-02-19**
- [ ] AREnablePartnerOffer
- [ ] AREnablePartnerOffersNotificationSwitch
- [ ] AREnableAlertBottomSheet
- [ ] AREnableArtworkListOfferability
- [ ] AREnableCollectionsWithoutHeaderImage
- [ ] AREnableExpiredPartnerOffers
- [ ] AREnablePaymentFailureBanner
- [ ] AREnableHidingDislikedArtworks
- [ ] AREnableProgressiveOnboardingAlerts
- [ ] ARDarkModeSupport
- [ ] AREnabledDiscoverDailyNegativeSignals
- [ ] ARShowOnboardingPriceRangeScreen

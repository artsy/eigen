import moment from "moment"
import React from "react"
import "react-native"

import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import SaleListItem from "./SaleListItem"

describe("SaleListItem", () => {
  it("renders without throwing an error", () => {
    renderWithWrappersTL(
      <SaleListItem sale={props as any} containerWidth={750} index={0} columnCount={4} />
    )
  })

  describe("SalesRail Subtitle", () => {
    describe("with cascading feature flag switched ON", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({
          AREnableCascadingEndTimerSalePageGrid: true,
        })
      })
      it("renders formattedStartDateTime as the subtitle", () => {
        const wrapper = renderWithWrappersTL(
          <SaleListItem sale={props as any} containerWidth={750} index={0} columnCount={4} />
        )

        expect(wrapper.getByText(props.formattedStartDateTime)).toBeDefined()
        expect(wrapper.queryByText(props.displayTimelyAt)).toBeNull()
      })
    })
    describe("with cascading feature flag switched OF", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({
          AREnableCascadingEndTimerSalePageGrid: false,
        })
      })
      it("renders the correct subtitle based on auction type", async () => {
        const wrapper = renderWithWrappersTL(
          <SaleListItem sale={props as any} containerWidth={750} index={0} columnCount={4} />
        )
        expect(wrapper.queryByText(props.formattedStartDateTime)).toBeNull()
        expect(wrapper.queryByText(props.displayTimelyAt)).not.toBeNull()
      })
    })
  })
})

const props = {
  id: "freemans-modern-and-contemporary-works-of-art",
  name: "Freeman's: Modern & Contemporary Works of Art",
  href: "http://foo.bar",
  is_open: true,
  is_live_open: false,
  start_at: moment().add(2, "hour").toISOString(),
  end_at: null,
  registration_ends_at: moment().subtract(1, "day").toISOString(),
  live_start_at: moment().add(5, "hour").toISOString(),
  live_url_if_open: null,
  displayTimelyAt: "Live in 2 hours",
  formattedStartDateTime: "Live May 19 at 11:00pm CEST",
  cover_image: {
    url: "https://d32dm0rphc51dk.cloudfront.net/eeqLfwMMAYA8XOmeYEb7Rg/source.jpg",
  },
}

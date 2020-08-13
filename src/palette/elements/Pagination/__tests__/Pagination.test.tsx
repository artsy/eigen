import { mount } from "enzyme"
import { set } from "lodash/fp"
import React from "react"
import { Theme } from "../../../Theme"
import { LargePagination, SmallPagination } from "../Pagination"

describe("Pagination", () => {
  const paginationProps = {
    cursor: {
      first: { page: 1, cursor: "Y3Vyc29yMg==", isCurrent: false },
      last: { page: 20, cursor: "Y3Vyc29yMw==", isCurrent: false },
      around: [
        { page: 6, cursor: "Y3Vyc29yMw==", isCurrent: true },
        { page: 7, cursor: "Y3Vyc29yMg==", isCurrent: false },
        { page: 8, cursor: "Y3Vyc29yMw==", isCurrent: false },
        { page: 9, cursor: "Y3Vyc29yMw==", isCurrent: false },
      ],
      previous: { page: 5, cursor: "Y3Vyc29yMw==", isCurrent: false },
      " $refType": null,
    },
    callbacks: {
      onClick: () => {
        /* */
      },
      onNext: () => {
        /* */
      },
    },
  }

  const { cursor, callbacks } = paginationProps
  let matchMedia

  beforeAll(() => {
    matchMedia = window.matchMedia
    window.matchMedia = undefined // Immediately set matching media query inMockBoot
  })

  afterAll(() => {
    window.matchMedia = matchMedia
  })

  describe("LargePagination", () => {
    it("disables next button if hasNextPage=false", () => {
      const wrapper = mount(
        <Theme>
          <LargePagination
            hasNextPage={false}
            pageCursors={cursor}
            {...callbacks}
          />
        </Theme>
      )
      expect(wrapper.find("NextButton").html()).toContain('class="disabled')
    })

    it("disables previous button if pageCursors.previous is falsy", () => {
      const updatedProps = set(
        "cursor.previous",
        undefined,
        paginationProps
      ) as any

      const wrapper = mount(
        <Theme>
          <LargePagination
            hasNextPage
            pageCursors={updatedProps.cursor}
            {...callbacks}
          />
        </Theme>
      )

      expect(wrapper.find("PrevButton").html()).toContain('class="disabled')
    })

    it("triggers next callback on next button click", () => {
      const spy = jest.fn()
      const wrapper = mount(
        <Theme>
          <LargePagination
            hasNextPage
            pageCursors={cursor}
            {...callbacks}
            onNext={spy}
          />
        </Theme>
      )
      wrapper.find("NextButton a").simulate("click")
      expect(spy).toHaveBeenCalled()
    })

    it("triggers onClick callback on previous button click", () => {
      const spy = jest.fn()
      const wrapper = mount(
        <Theme>
          <LargePagination
            hasNextPage
            pageCursors={cursor}
            {...callbacks}
            onClick={spy}
          />
        </Theme>
      )
      wrapper.find("PrevButton a").simulate("click")
      expect(spy).toHaveBeenCalled()
    })

    it("triggers on click on number click", () => {
      const spy = jest.fn()
      const wrapper = mount(
        <Theme>
          <LargePagination
            hasNextPage
            pageCursors={cursor}
            {...callbacks}
            onClick={spy}
          />
        </Theme>
      )
      wrapper
        .find("Page")
        .first()
        .simulate("click")

      expect(spy).toHaveBeenCalled()
    })

    it("renders first, last and page range", () => {
      const wrapper = mount(
        <Theme>
          <LargePagination hasNextPage pageCursors={cursor} {...callbacks} />
        </Theme>
      )
      const html = wrapper.html()
      const pages = ["1", "...", "6", "7", "8", "9", "...", "20"]
      pages.forEach(page => {
        expect(html).toContain(`>${page}<`)
      })
    })
  })

  describe("SmallPagination", () => {
    it("does not render pages", () => {
      const wrapper = mount(
        <Theme>
          <SmallPagination hasNextPage pageCursors={cursor} {...callbacks} />
        </Theme>
      )
      expect(wrapper.find("Page").length).toEqual(0)
      expect(wrapper.find("PageSpan").length).toEqual(0)
    })

    it("triggers next callback on previous button click", () => {
      const spy = jest.fn()
      const wrapper = mount(
        <Theme>
          <SmallPagination
            hasNextPage
            pageCursors={cursor}
            {...callbacks}
            onClick={spy}
          />
        </Theme>
      )

      wrapper
        .find("ButtonWithBorder")
        .first()
        .simulate("click")

      expect(spy).toHaveBeenCalled()
    })

    it("triggers onClick callback on next button click", () => {
      const spy = jest.fn()
      const wrapper = mount(
        <Theme>
          <SmallPagination
            hasNextPage
            pageCursors={cursor}
            {...callbacks}
            onNext={spy}
          />
        </Theme>
      )
      wrapper
        .find("ButtonWithBorder")
        .last()
        .simulate("click")

      expect(spy).toHaveBeenCalled()
    })
  })
})

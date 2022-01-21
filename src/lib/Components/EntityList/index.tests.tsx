// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { Theme } from "palette"
import React from "react"
import { EntityList } from "./index"

describe("EntityList", () => {
  it("correctly renders one item", () => {
    const wrapper = mount(
      <Theme>
        <EntityList
          prefix="Works by"
          list={[
            {
              internalID: "12345",
              slug: "foxy-production",
              name: "Foxy Production",
              href: "/foxy-production",
            },
          ]}
          count={1}
          displayedItems={2}
        />
      </Theme>
    )

    expect(wrapper.text()).toEqual("Works by Foxy Production")
  })

  it("correctly renders multiple items", () => {
    const wrapper = mount(
      <Theme>
        <EntityList
          prefix="Works by"
          list={[
            {
              internalID: "12345",
              slug: "derya-akay",
              name: "Zarouhie Abdalian",
              href: "/artist/zarouhie-abdalian",
            },
            {
              internalID: "12345",
              slug: "derya-akay",
              name: "Derya Akay",
              href: "/artist/derya-akay",
            },
          ]}
          count={20}
          displayedItems={2}
        />
      </Theme>
    )

    expect(wrapper.text()).toEqual("Works by Zarouhie Abdalian, Derya Akay and 18 others")
  })
})

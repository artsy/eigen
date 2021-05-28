import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button } from "palette"
import React from "react"
import { Image } from "react-native"
import { OrderHistoryRow } from "../OrderHistoryRow"

describe("Order history row", () => {
  const mockOrder = {
    code: "755082335",
    internalID: "d1105415-4a55-4c3b-b71d-bfae06ec92df",
    state: "SUBMITTED",
    buyerTotal: "11,200",
    createdAt: "2021-05-18T14:45:20+03:00",
    itemsTotal: "€11,000",
    lineItems: {
      edges: [
        {
          node: {
            artwork: {
              image: {
                resized: {
                  url:
                    "https://d196wkiy8qx2u5.cloudfront.net?resize_to=fit&width=55&height=44&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2Ft06Xa3hKNRbLcO2t6MWOyQ%2Flarge.jpg",
                },
              },
              partner: {
                name: "Andrea Festa Fine Art",
              },
              title: "NUDIST NO. 5",
              artistNames: "Torbjørn Rødland",
            },
          },
        },
      ],
    },
  }

  it("Render order with image", async () => {
    const tree = renderWithWrappers(<OrderHistoryRow order={mockOrder as any} />)
    expect(extractText(tree.root.findByProps({ "data-test-id": "artist-names" }))).toBe("Torbjørn Rødland")
    expect(extractText(tree.root.findByProps({ "data-test-id": "partner-name" }))).toBe("Andrea Festa Fine Art")
    expect(extractText(tree.root.findByProps({ "data-test-id": "date" }))).toBe("5/18/2021")
    expect(extractText(tree.root.findByProps({ "data-test-id": "price" }))).toBe("11,200")
    expect(extractText(tree.root.findByProps({ "data-test-id": "order-status" }))).toBe("submitted")
    expect(extractText(tree.root.findByProps({ "data-test-id": "view-order" }))).toContain("View Order")
    expect(extractText(tree.root.findByType(Button))).toContain("View Order")
    expect(tree.root.findAllByType(Image)).toHaveLength(1)
    expect(tree.root.findByProps({ "data-test-id": "image" })).toBeTruthy()
    expect(tree.root.findAllByProps({ "data-test-id": "image-box" })).toHaveLength(0)
  })

  it("Render order without image", async () => {
    const tree = renderWithWrappers(
      <OrderHistoryRow
        order={
          {
            ...mockOrder,
            lineItems: {
              edges: [
                {
                  node: {
                    artwork: {
                      image: null,
                      partner: {
                        name: "Andrea Festa Fine Art",
                      },
                      title: "NUDIST NO. 5",
                      artistNames: "Torbjørn Rødland",
                    },
                  },
                },
              ],
            },
          } as any
        }
      />
    )
    expect(extractText(tree.root.findByProps({ "data-test-id": "artist-names" }))).toBe("Torbjørn Rødland")
    expect(extractText(tree.root.findByProps({ "data-test-id": "partner-name" }))).toBe("Andrea Festa Fine Art")
    expect(extractText(tree.root.findByProps({ "data-test-id": "date" }))).toBe("5/18/2021")
    expect(extractText(tree.root.findByProps({ "data-test-id": "price" }))).toBe("11,200")
    expect(extractText(tree.root.findByProps({ "data-test-id": "order-status" }))).toBe("submitted")
    expect(extractText(tree.root.findByProps({ "data-test-id": "view-order" }))).toContain("View Order")
    expect(extractText(tree.root.findByType(Button))).toContain("View Order")
    expect(tree.root.findAllByType(Image)).toHaveLength(0)
    expect(tree.root.findAllByProps({ "data-test-id": "image" })).toHaveLength(0)
    expect(tree.root.findByProps({ "data-test-id": "image-box" })).toBeTruthy()
  })
})

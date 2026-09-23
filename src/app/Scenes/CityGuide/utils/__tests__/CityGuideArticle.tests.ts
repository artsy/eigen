import { CityGuideArticle_articles$data } from "__generated__/CityGuideArticle_articles.graphql"
import { toArticleRows } from "app/Scenes/CityGuide/utils/CityGuideArticle"

const attachment = ({
  id,
  position,
  publishedAtISO,
}: {
  id: string
  position: number
  publishedAtISO: string | null
}) => ({
  internalID: id,
  position,
  article: {
    internalID: `article-${id}`,
    slug: `slug-${id}`,
    title: `Title ${id}`,
    thumbnailTitle: null,
    byline: null,
    href: `/article/${id}`,
    publishedAt: publishedAtISO,
    publishedAtISO,
    thumbnailImage: null,
  },
})

const asAttachments = (rows: ReturnType<typeof attachment>[]) =>
  rows as unknown as CityGuideArticle_articles$data

describe("toArticleRows", () => {
  it("orders newest publishedAt first", () => {
    const rows = toArticleRows(
      asAttachments([
        attachment({ id: "old", position: 0, publishedAtISO: "2024-01-01T00:00:00.000Z" }),
        attachment({ id: "new", position: 1, publishedAtISO: "2024-06-01T00:00:00.000Z" }),
        attachment({ id: "mid", position: 2, publishedAtISO: "2024-03-01T00:00:00.000Z" }),
      ])
    )

    expect(rows.map((row) => row.id)).toEqual(["new", "mid", "old"])
  })

  it("puts articles with no publishedAt last, in their existing position order", () => {
    const rows = toArticleRows(
      asAttachments([
        attachment({ id: "no-date-a", position: 0, publishedAtISO: null }),
        attachment({ id: "dated", position: 1, publishedAtISO: "2024-01-01T00:00:00.000Z" }),
        attachment({ id: "no-date-b", position: 2, publishedAtISO: null }),
      ])
    )

    expect(rows.map((row) => row.id)).toEqual(["dated", "no-date-a", "no-date-b"])
  })

  it("breaks ties (equal or missing publishedAt) by position", () => {
    const rows = toArticleRows(
      asAttachments([
        attachment({ id: "same-date-b", position: 1, publishedAtISO: "2024-01-01T00:00:00.000Z" }),
        attachment({ id: "same-date-a", position: 0, publishedAtISO: "2024-01-01T00:00:00.000Z" }),
        attachment({ id: "no-date-b", position: 3, publishedAtISO: null }),
        attachment({ id: "no-date-a", position: 2, publishedAtISO: null }),
      ])
    )

    expect(rows.map((row) => row.id)).toEqual([
      "same-date-a",
      "same-date-b",
      "no-date-a",
      "no-date-b",
    ])
  })
})

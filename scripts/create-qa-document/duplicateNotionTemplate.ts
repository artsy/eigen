import { notion, extractPageId } from "./notion"

// ---------------------------------------------------------------------------
// Duplicates the Mobile App QA Notion template into a new dated page.
//
// `POST /pages` takes a `template` parameter whose `template_id` may be *any*
// page the integration can see, so Notion performs the duplication server-side.
// That matters because a page's fidelity lives in places the create endpoints
// can't reach: row order and column order are properties of a database *view*,
// not of its data source, and `created_by` columns, formulas and Notion-hosted
// images can't be authored through the API at all.
//
// An earlier version of this file rebuilt the page block-by-block instead. It
// could only ever approximate the template — the regression table came out in
// arbitrary row order, which matters because its test cases reference the row
// above them ("Same as ☝️…"). Letting Notion do the copy removes that whole
// class of problem, so there is deliberately no hand-rolled fallback: a wrong
// QA document is worse than a failed job.
//
// Defaults to the Mobile App QA template → the Mobile App QA destination page
// (both in constants.ts). Pass a template url/id to override the source.
// ---------------------------------------------------------------------------

interface RichText {
  type?: string
  text?: { content: string; link: { url: string } | null }
  annotations?: Record<string, unknown>
  [key: string]: unknown
}

interface Block {
  id: string
  type: string
  has_children: boolean
  [key: string]: unknown
}

interface PageProperty {
  type: string
  title?: RichText[]
}

interface Page {
  id: string
  url: string
  parent: Record<string, unknown>
  properties: Record<string, PageProperty>
  icon?: Record<string, unknown> | null
  cover?: Record<string, unknown> | null
}

// Strip read-only fields from rich text so the payload is accepted on write.
const cleanRichText = (rich: RichText[] = []): RichText[] =>
  rich
    .filter(
      (r): r is RichText & { text: NonNullable<RichText["text"]> } => r.type === "text" && !!r.text
    )
    .map((r) => ({
      type: "text",
      text: { content: r.text.content, link: r.text.link ?? null },
      annotations: r.annotations,
    }))

// Fetch every child block of a block/page, following pagination.
const fetchAllChildren = async (blockId: string): Promise<Block[]> => {
  const blocks: Block[] = []
  let cursor: string | undefined
  do {
    const query = cursor ? `?start_cursor=${cursor}&page_size=100` : "?page_size=100"
    const res = await notion<{ results: Block[]; next_cursor: string | null; has_more: boolean }>(
      `/blocks/${blockId}/children${query}`
    )
    blocks.push(...res.results)
    cursor = res.has_more ? res.next_cursor ?? undefined : undefined
  } while (cursor)
  return blocks
}

// An icon/cover we can re-send on create. Emoji and external URLs are plain
// values we can copy; a Notion-hosted file is an expiring URL that would need a
// fresh upload, so it's dropped rather than sent as an invalid reference.
export const copyableAsset = (
  asset: Record<string, unknown> | null | undefined
): Record<string, unknown> | null => {
  if (!asset) return null
  if (asset.type === "emoji" && asset.emoji) return { type: "emoji", emoji: asset.emoji }
  if (asset.type === "external" && asset.external) {
    return { type: "external", external: asset.external }
  }
  return null
}

const getTitle = (page: Page): { key: string; rich: RichText[] } => {
  const entry = Object.entries(page.properties).find(([, prop]) => prop.type === "title")
  if (!entry) return { key: "title", rich: [] }
  const [key, prop] = entry
  return { key, rich: prop.title ?? [] }
}

// Placeholders in the template title that we fill on duplication. The title is:
//   "2026-MM-DD Mobile App QA (version A.B.C, iOS build 2026.W.X.Y.Z Android build XYZ)"
const DATE_PLACEHOLDER = /(?:\d{4}|YYYY)-MM-DD/g // e.g. "2026-MM-DD"
const VERSION_PLACEHOLDER = /A\.B\.C/g // e.g. "version A.B.C"
const IOS_BUILD_PLACEHOLDER = /\d{4}\.W\.X\.Y\.Z/g // e.g. "iOS build 2026.W.X.Y.Z"
const ANDROID_BUILD_PLACEHOLDER = /XYZ/g // e.g. "Android build XYZ"

// Replace a placeholder in the title's text segments with a concrete value.
// (Notion's API rejects a dynamic "@today" mention outside of templates, so we
// supply computed date/version/build strings instead.)
const replaceInTitle = (rich: RichText[], pattern: RegExp, value: string): RichText[] =>
  rich.map((seg) =>
    seg.text?.content
      ? { ...seg, text: { ...seg.text, content: seg.text.content.replace(pattern, value) } }
      : seg
  )

const titleText = (rich: RichText[]): string => rich.map((seg) => seg.text?.content ?? "").join("")

// The placeholder text in the template's changelog code block.
const CHANGELOG_PLACEHOLDER = "Paste changelog here"

// Find the id of the first code block under `blockId` (searched recursively)
// whose text contains `match`; falls back to the first code block found.
const findCodeBlock = async (blockId: string, match: string): Promise<string | null> => {
  const children = await fetchAllChildren(blockId)
  let fallback: string | null = null
  for (const b of children) {
    if (b.type === "code") {
      const richText = (b.code as { rich_text?: { plain_text?: string }[] }).rich_text ?? []
      const plain = richText.map((r) => r.plain_text ?? "").join("")
      if (plain.includes(match)) return b.id
      if (!fallback) fallback = b.id
    } else if (b.has_children) {
      const nested = await findCodeBlock(b.id, match)
      if (nested) return nested
    }
  }
  return fallback
}

// Notion caps a single rich-text object's `content` at 2000 chars. A long
// changelog must therefore be split across multiple rich-text objects, which
// Notion concatenates back together within the block. We prefer to cut on a
// newline so lines stay intact, and hard-cut only when a single line exceeds
// the limit. The pieces are consecutive substrings, so their concatenation is
// byte-for-byte the original text regardless of where the cuts land.
const NOTION_TEXT_LIMIT = 2000

export const splitForRichText = (text: string, limit = NOTION_TEXT_LIMIT): string[] => {
  if (text.length <= limit) return [text]
  const chunks: string[] = []
  let rest = text
  while (rest.length > limit) {
    const window = rest.slice(0, limit)
    const nl = window.lastIndexOf("\n")
    const cut = nl > 0 ? nl + 1 : limit // keep the newline with this chunk
    chunks.push(rest.slice(0, cut))
    rest = rest.slice(cut)
  }
  if (rest) chunks.push(rest)
  return chunks
}

// Replace a code block's contents (language and everything else untouched).
const setCodeBlock = async (blockId: string, text: string): Promise<void> => {
  const rich_text = splitForRichText(text).map((content) => ({
    type: "text",
    text: { content },
  }))
  await notion(`/blocks/${blockId}`, {
    method: "PATCH",
    body: JSON.stringify({ code: { rich_text } }),
  })
}

// Drop the changelog into the copy's changelog code block.
const fillChangelog = async (pageId: string, changelog: string): Promise<void> => {
  const codeBlockId = await findCodeBlock(pageId, CHANGELOG_PLACEHOLDER)
  if (!codeBlockId) {
    console.warn("⚠️  No code block found to fill with the changelog.")
    return
  }
  console.log("Filling changelog code block…")
  await setCodeBlock(codeBlockId, changelog)
}

// Idempotency guard: return the URL of an existing child page under the
// destination whose title contains every string in `mustInclude` (e.g. the
// version), or null if none exists.
export const findExistingCopy = async (
  destinationUrlOrId: string,
  mustInclude: string[]
): Promise<string | null> => {
  const destId = extractPageId(destinationUrlOrId)
  const children = await fetchAllChildren(destId)
  for (const b of children) {
    if (b.type !== "child_page") continue
    const title = (b.child_page as { title?: string }).title ?? ""
    if (mustInclude.every((s) => title.includes(s))) {
      return `https://www.notion.so/${b.id.replace(/-/g, "")}`
    }
  }
  return null
}

// Notion applies a template asynchronously: the create call returns immediately
// and the page is briefly blank while the server fills it in. Poll until content
// shows up (the docs' suggested alternative to subscribing to
// `page.content_updated`).
const TEMPLATE_POLL_INTERVAL_MS = 2_000
const TEMPLATE_POLL_TIMEOUT_MS = 120_000

const waitForTemplateContent = async (pageId: string): Promise<boolean> => {
  const deadline = Date.now() + TEMPLATE_POLL_TIMEOUT_MS
  while (Date.now() < deadline) {
    const children = await fetchAllChildren(pageId)
    if (children.length > 0) return true
    await new Promise((r) => setTimeout(r, TEMPLATE_POLL_INTERVAL_MS))
  }
  return false
}

interface DuplicateOptions {
  version?: string
  today: string
  // iOS build number, e.g. "2026.07.13.18" (fills the "2026.W.X.Y.Z" placeholder).
  iosBuild?: string
  // Android build number, e.g. "2026071318" (fills the "XYZ" placeholder).
  androidBuild?: string
  // Changelog markdown to drop into the template's changelog code block.
  changelog?: string
}

export const duplicateTemplate = async (
  templateUrlOrId: string,
  destinationUrlOrId: string,
  { version, today, iosBuild, androidBuild, changelog }: DuplicateOptions
): Promise<string> => {
  const templateId = extractPageId(templateUrlOrId)
  const destinationId = extractPageId(destinationUrlOrId)
  console.log(`Reading template ${templateId}…`)
  const template = await notion<Page>(`/pages/${templateId}`)

  // Copy the template's title, stamping today's date over the date placeholder
  // and (when given) the release version + iOS/Android build numbers over their
  // placeholders.
  const { rich } = getTitle(template)
  let newTitle: RichText[] = replaceInTitle(cleanRichText(rich), DATE_PLACEHOLDER, today)
  if (version !== undefined) {
    if (!titleText(newTitle).includes("A.B.C")) {
      console.warn(`⚠️  No version placeholder (A.B.C) found in title to fill with ${version}.`)
    }
    newTitle = replaceInTitle(newTitle, VERSION_PLACEHOLDER, version)
  }
  if (iosBuild !== undefined) {
    newTitle = replaceInTitle(newTitle, IOS_BUILD_PLACEHOLDER, iosBuild)
  }
  if (androidBuild !== undefined) {
    newTitle = replaceInTitle(newTitle, ANDROID_BUILD_PLACEHOLDER, androidBuild)
  }

  const icon = copyableAsset(template.icon)
  const cover = copyableAsset(template.cover)

  console.log(`Duplicating template into destination ${destinationId}…`)
  const newPage = await notion<Page>("/pages", {
    method: "POST",
    body: JSON.stringify({
      parent: { type: "page_id", page_id: destinationId },
      properties: { title: { title: newTitle } },
      ...(icon ? { icon } : {}),
      ...(cover ? { cover } : {}),
      template: { type: "template_id", template_id: templateId },
    }),
  })

  if (!(await waitForTemplateContent(newPage.id))) {
    throw new Error(
      `Template application timed out after ${
        TEMPLATE_POLL_TIMEOUT_MS / 1000
      }s; page left empty at ${newPage.url}`
    )
  }

  // Applying the template can overwrite the title we passed on create, so stamp
  // the placeholders again now that the server is done.
  await notion(`/pages/${newPage.id}`, {
    method: "PATCH",
    body: JSON.stringify({ properties: { title: { title: newTitle } } }),
  })

  if (changelog) await fillChangelog(newPage.id, changelog)

  console.log(`✅ Duplicated template → ${newPage.url}`)
  return newPage.url
}

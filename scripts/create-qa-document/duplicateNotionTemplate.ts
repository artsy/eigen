import { notion, extractPageId } from "./notion"

// ---------------------------------------------------------------------------
// Notion has no "duplicate page" endpoint. This recreates a template page by
// reading its title + block tree and rebuilding them as a new subpage at the
// end of a destination page.
//
// Defaults to the Mobile App QA template → the Mobile App QA destination page
// (both in constants.ts). Pass a template url/id to override the source.
// ---------------------------------------------------------------------------

// Block types that can't be re-created through the public API, or that need
// bespoke structural handling we don't support yet. We copy everything else and
// warn (loudly, never silently) for these so nothing looks like it succeeded.
const UNSUPPORTED_BLOCK_TYPES = new Set([
  "child_page",
  "column_list",
  "column",
  "table",
  "table_row",
  "synced_block",
  "link_preview",
  "template",
  "ai_block",
  "unsupported",
])

// Property types we can't recreate in a database schema: system/computed values,
// or types that require external references we can't reconstruct.
const UNSUPPORTED_PROP_TYPE_LIST = [
  "created_by",
  "created_time",
  "last_edited_by",
  "last_edited_time",
  "rollup",
  "relation",
  "status",
  "unique_id",
  "button",
  "verification",
]
const UNSUPPORTED_PROP_TYPES = new Set(UNSUPPORTED_PROP_TYPE_LIST)

// Property value types that can't be written when creating a row (computed).
const READONLY_VALUE_TYPES = new Set([...UNSUPPORTED_PROP_TYPE_LIST, "formula"])

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

// Recursively drop null-valued fields. The API returns blocks with fields like
// `icon: null`, but the create endpoint rejects null (it wants an object or the
// field absent); omitting a field means "use the default", which is what we want.
const stripNulls = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stripNulls)
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      if (v !== null) out[k] = stripNulls(v)
    }
    return out
  }
  return value
}

// Blocks that carry a file, which is either Notion-hosted (type "file", an
// expiring URL we can't re-upload) or "external" (a plain URL we can copy).
const FILE_BLOCK_TYPES = new Set(["image", "video", "file", "pdf", "audio"])

// Turn a fetched block into a writable block payload (no ids/timestamps).
// Returns null for block types we can't recreate.
const cleanBlock = (block: Block): Record<string, unknown> | null => {
  if (UNSUPPORTED_BLOCK_TYPES.has(block.type)) return null

  const payload = { ...(block[block.type] as Record<string, unknown>) }

  if (FILE_BLOCK_TYPES.has(block.type)) {
    // Only external file URLs survive a copy; Notion-hosted files would need a
    // fresh upload, so skip them rather than send an invalid payload.
    if (payload.type !== "external" || !payload.external) return null
    const clean: Record<string, unknown> = { type: "external", external: payload.external }
    if (Array.isArray(payload.caption)) clean.caption = cleanRichText(payload.caption as RichText[])
    return { object: "block", type: block.type, [block.type]: clean }
  }

  // rich_text is the common carrier of formatted content; clean it if present.
  if (Array.isArray(payload.rich_text)) {
    payload.rich_text = cleanRichText(payload.rich_text as RichText[])
  }
  // Children are appended separately (recursively), never inline here.
  delete payload.children

  return stripNulls({ object: "block", type: block.type, [block.type]: payload }) as Record<
    string,
    unknown
  >
}

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

const chunk = <T>(arr: T[], size: number): T[][] => {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

// Recursively copy the children of `sourceId` onto `destId`. `rootPageId` is the
// nearest page ancestor in the destination — inline databases can only be
// created under a page, so nested databases are placed there rather than in
// their exact spot.
//
// We walk children in order, buffering plain blocks and flushing them right
// before each embedded database, so databases keep their position relative to
// surrounding content (e.g. sitting under their own heading).
const copyChildren = async (
  sourceId: string,
  destId: string,
  rootPageId: string
): Promise<void> => {
  const children = await fetchAllChildren(sourceId)
  let buffer: { source: Block; cleaned: Record<string, unknown> }[] = []

  const flush = async (): Promise<void> => {
    if (buffer.length === 0) return
    const batch = buffer
    buffer = []
    // Append in batches of 100 (API limit); created results come back in order.
    const created: Block[] = []
    for (const part of chunk(batch, 100)) {
      const res = await notion<{ results: Block[] }>(`/blocks/${destId}/children`, {
        method: "PATCH",
        body: JSON.stringify({ children: part.map((e) => e.cleaned) }),
      })
      created.push(...res.results)
    }
    // Recurse for any block that had nested children.
    for (let i = 0; i < batch.length; i++) {
      if (batch[i].source.has_children && created[i]) {
        await copyChildren(batch[i].source.id, created[i].id, rootPageId)
      }
    }
  }

  for (const source of children) {
    if (source.type === "child_database") {
      await flush()
      await copyDatabase(source.id, rootPageId)
      continue
    }
    const cleaned = cleanBlock(source)
    if (!cleaned) {
      console.warn(`⚠️  Skipping non-copyable block: ${source.type}`)
      continue
    }
    buffer.push({ source, cleaned })
  }
  await flush()
}

interface PropertyConfig {
  type: string
  [key: string]: unknown
}

// Build a create-database schema from a data source's property configs,
// dropping property types we can't recreate.
const buildSchema = (properties: Record<string, PropertyConfig>): Record<string, unknown> => {
  const schema: Record<string, unknown> = {}
  for (const [name, prop] of Object.entries(properties)) {
    const type = prop.type
    if (UNSUPPORTED_PROP_TYPES.has(type)) {
      console.warn(`   ⚠️  skipping property "${name}" (${type} can't be created via API)`)
      continue
    }
    const config = (prop[type] as Record<string, unknown>) ?? {}
    if (type === "select" || type === "multi_select") {
      const options = ((config.options as { name: string; color: string }[]) ?? []).map((o) => ({
        name: o.name,
        color: o.color,
      }))
      schema[name] = { type, [type]: { options } }
    } else if (type === "formula") {
      schema[name] = { type, formula: { expression: config.expression } }
    } else if (type === "number") {
      schema[name] = { type, number: { format: config.format ?? "number" } }
    } else {
      schema[name] = { type, [type]: {} }
    }
  }
  return schema
}

// Build writable row properties from a source row's property values, skipping
// computed values and any property not present in the new schema.
const buildRowProperties = (
  properties: Record<string, PropertyConfig>,
  schema: Record<string, unknown>
): Record<string, unknown> => {
  const out: Record<string, unknown> = {}
  for (const [name, prop] of Object.entries(properties)) {
    if (!(name in schema) || READONLY_VALUE_TYPES.has(prop.type)) continue
    const v = prop[prop.type] as never
    switch (prop.type) {
      case "title":
      case "rich_text":
        out[name] = { [prop.type]: cleanRichText(v) }
        break
      case "multi_select":
        out[name] = {
          multi_select: ((v as { name: string }[]) ?? []).map((o) => ({ name: o.name })),
        }
        break
      case "select":
        if (v) out[name] = { select: { name: (v as { name: string }).name } }
        break
      case "checkbox":
        out[name] = { checkbox: Boolean(v) }
        break
      case "url":
      case "email":
      case "phone_number":
        if (v) out[name] = { [prop.type]: v }
        break
      case "number":
        if (v !== null && v !== undefined) out[name] = { number: v }
        break
      case "date":
        if (v) {
          const d = v as { start: string; end: string | null; time_zone: string | null }
          out[name] = { date: { start: d.start, end: d.end, time_zone: d.time_zone } }
        }
        break
      case "people":
        out[name] = { people: ((v as { id: string }[]) ?? []).map((p) => ({ id: p.id })) }
        break
      case "files": {
        // Notion-hosted files have expiring URLs that can't be re-uploaded via
        // the API; only external file links can be copied.
        const files = ((v as { type: string; name: string; external?: { url: string } }[]) ?? [])
          .filter(
            (f): f is { type: string; name: string; external: { url: string } } =>
              f.type === "external" && !!f.external
          )
          .map((f) => ({ name: f.name, external: { url: f.external.url } }))
        if (files.length) out[name] = { files }
        break
      }
      default:
        break
    }
  }
  return out
}

// Rebuild an embedded database (schema + rows) as an inline database under a page.
const copyDatabase = async (sourceDbId: string, destPageId: string): Promise<void> => {
  const database = await notion<{
    title: RichText[]
    data_sources: { id: string; name: string }[]
  }>(`/databases/${sourceDbId}`)
  const sourceDs = database.data_sources[0]
  if (!sourceDs) return

  const source = await notion<{ properties: Record<string, PropertyConfig> }>(
    `/data_sources/${sourceDs.id}`
  )
  const schema = buildSchema(source.properties)

  console.log(`   Creating database "${sourceDs.name}"…`)
  const newDb = await notion<{ id: string; data_sources: { id: string }[] }>("/databases", {
    method: "POST",
    body: JSON.stringify({
      parent: { type: "page_id", page_id: destPageId },
      title: cleanRichText(database.title),
      is_inline: true,
      initial_data_source: { properties: schema },
    }),
  })
  const newDsId = newDb.data_sources[0].id

  let cursor: string | undefined
  let count = 0
  do {
    const res = await notion<{
      results: { id: string; properties: Record<string, PropertyConfig> }[]
      next_cursor: string | null
      has_more: boolean
    }>(`/data_sources/${sourceDs.id}/query`, {
      method: "POST",
      body: JSON.stringify({ start_cursor: cursor, page_size: 100 }),
    })
    for (const row of res.results) {
      const newRow = await notion<{ id: string }>("/pages", {
        method: "POST",
        body: JSON.stringify({
          parent: { type: "data_source_id", data_source_id: newDsId },
          properties: buildRowProperties(row.properties, schema),
        }),
      })
      // Rows can have page bodies of their own; copy them too.
      await copyChildren(row.id, newRow.id, newRow.id)
      count++
    }
    cursor = res.has_more ? res.next_cursor ?? undefined : undefined
  } while (cursor)
  console.log(`   → copied ${count} row(s) into "${sourceDs.name}"`)
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

  console.log(`Creating new page under destination ${destinationId}…`)
  const newPage = await notion<Page>("/pages", {
    method: "POST",
    body: JSON.stringify({
      parent: { type: "page_id", page_id: destinationId },
      properties: { title: { title: newTitle } },
    }),
  })

  console.log("Copying block content…")
  await copyChildren(templateId, newPage.id, newPage.id)

  if (changelog) {
    const codeBlockId = await findCodeBlock(newPage.id, CHANGELOG_PLACEHOLDER)
    if (codeBlockId) {
      console.log("Filling changelog code block…")
      await setCodeBlock(codeBlockId, changelog)
    } else {
      console.warn("⚠️  No code block found to fill with the changelog.")
    }
  }

  console.log(`✅ Duplicated template → ${newPage.url}`)
  return newPage.url
}

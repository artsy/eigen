/**
 * Prepares an Art Assistant prompt for analytics.
 *
 * Two things happen here, and both are deliberate:
 *
 * 1. Obvious PII is replaced with placeholders. This is a floor, not a
 *    guarantee — it runs on-device, so a miss can't be fixed for users who
 *    don't upgrade, and no regex catches a name or "I just sold my business".
 *    The server-side turn record does the pass we can actually patch.
 * 2. The result is truncated. Segment rejects events over 32KB, and a prompt's
 *    analytical value is in its intent, which survives truncation.
 *
 * `prompt_length` on the event carries the pre-truncation length so we can see
 * what proportion of prompts we're cutting.
 */

export const MAX_PROMPT_LENGTH = 500

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.]{2,}/g

// Runs before the phone pass, which would otherwise claim card numbers first.
const CARD = /\b(?:\d[ -]?){13,19}\b/g

/**
 * Deliberately loose, then narrowed in the replacer by digit count. A pure
 * regex matches art-world number ranges — "paintings from 1960 - 1970",
 * "48 x 60, budget 12000" — and over-redaction silently corrupts exactly the
 * prompts we're collecting this data to read.
 */
const PHONE_CANDIDATE = /\+?\(?\d[\d\s().-]{6,}\d/g
const MIN_PHONE_DIGITS = 10
const MIN_PHONE_DIGITS_WITH_COUNTRY_CODE = 8

const redactPhones = (text: string): string =>
  text.replace(PHONE_CANDIDATE, (match) => {
    const digitCount = match.replace(/\D/g, "").length
    const looksLikePhone =
      digitCount >= MIN_PHONE_DIGITS ||
      (match.startsWith("+") && digitCount >= MIN_PHONE_DIGITS_WITH_COUNTRY_CODE)

    return looksLikePhone ? "<PHONE>" : match
  })

export const sanitizePrompt = (prompt: string): string => {
  const redacted = redactPhones(
    prompt.trim().replace(EMAIL, "<EMAIL>").replace(CARD, "<CARD>")
  )

  return redacted.slice(0, MAX_PROMPT_LENGTH)
}

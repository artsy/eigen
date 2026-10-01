export interface PreviewPR {
  channel: string
  prNumber: number
  title: string
  sha: string
}

export const PREVIEW_LABEL = "preview"

const PREVIEW_CHANNEL_PREFIX = "review-app-"

export const getPreviewChannel = (prNumber: number) => `${PREVIEW_CHANNEL_PREFIX}${prNumber}`

export const parsePreviewChannel = (channel?: string | null) => {
  const match = channel?.match(/^review-app-(\d+)$/)
  return match ? Number(match[1]) : null
}

export const fetchPreviewPR = async (prNumber: number): Promise<PreviewPR> => {
  const response = await fetch(`https://api.github.com/repos/artsy/eigen/pulls/${prNumber}`, {
    headers: { Accept: "application/vnd.github+json" },
  })

  if (response.status === 404) {
    throw new Error(`PR #${prNumber} not found`)
  }

  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status})`)
  }

  const pr = await response.json()

  if (pr.state !== "open") {
    throw new Error(`PR #${prNumber} is not open`)
  }

  const labels: Array<{ name: string }> = pr.labels ?? []
  if (!labels.some((label) => label.name === PREVIEW_LABEL)) {
    throw new Error(`PR #${prNumber} doesn't have the "${PREVIEW_LABEL}" label`)
  }

  return {
    channel: getPreviewChannel(prNumber),
    prNumber,
    title: pr.title,
    sha: pr.head.sha,
  }
}

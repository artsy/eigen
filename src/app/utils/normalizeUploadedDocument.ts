import { DocumentPickerResponse } from "@react-native-documents/picker"
import { isDocument } from "app/utils/showDocumentsAndPhotosActionSheet"
import { Image as RNPickerImage } from "react-native-image-crop-picker"
import { v4 as uuid } from "uuid"

export type NormalizedDocument = {
  abortUploading: (() => void) | undefined | null
  assetId: string | undefined | null
  bucket?: string | null | undefined
  errorMessage: string | undefined | null
  externalUrl: string | undefined | null
  geminiToken: string | undefined | null
  id: string
  item: RNPickerImage | DocumentPickerResponse | null
  loading: boolean
  name: string | undefined | null
  progress: number | undefined | null
  removed: boolean
  size: string | undefined | null
  sourceKey?: string | null | undefined
}

export function normalizeUploadedDocument(
  document: RNPickerImage | DocumentPickerResponse,
  errorMessage?: string,
  externalUrl?: string
): NormalizedDocument {
  const name = isDocument(document)
    ? document.name
    : document.filename || document.path.replace(/^.*[\\/]/, "")

  return {
    id: uuid(),
    assetId: undefined,
    externalUrl,
    item: document,
    name: name,
    size: document.size?.toString(),
    geminiToken: undefined,
    abortUploading: undefined,
    progress: undefined,
    removed: false,
    loading: false,
    errorMessage,
  }
}

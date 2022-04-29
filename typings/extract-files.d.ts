// Type definitions for extract-files 12.0.0
// Project: https://github.com/jaydenseric/extract-files#readme
// Definitions by: Edward Sammut Alessi <https://github.com/Slessi>
//                 Alex K <https://github.com/lynxtaa>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "extract-files/isExtractableFile.mjs" {
  export default function isExtractableFile(value: any): boolean
}

declare module "extract-files/extractFiles.mjs" {
  export type ExtractableFile = File | Blob

  export default function extractFiles<TFile = ExtractableFile>(
    value: any,
    isExtractableFile?: (value: any) => boolean,
    path?: string
  ): {
    clone: any
    files: Map<TFile, string[]>
  }
}

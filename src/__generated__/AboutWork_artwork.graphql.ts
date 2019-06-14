/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _AboutWork_artwork$ref: unique symbol;
export type AboutWork_artwork$ref = typeof _AboutWork_artwork$ref;
export type AboutWork_artwork = {
    readonly additional_information: string | null;
    readonly description: string | null;
    readonly " $refType": AboutWork_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "AboutWork_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "additional_information",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "description",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'e963c94de9fd2f6e3d84eeca9166dfc0';
export default node;

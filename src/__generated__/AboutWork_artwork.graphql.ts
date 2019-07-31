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
      "alias": "additional_information",
      "name": "additionalInformation",
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
(node as any).hash = 'f3da3330656a55193835199d037e7749';
export default node;

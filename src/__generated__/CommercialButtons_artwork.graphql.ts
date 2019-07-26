/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _CommercialButtons_artwork$ref: unique symbol;
export type CommercialButtons_artwork$ref = typeof _CommercialButtons_artwork$ref;
export type CommercialButtons_artwork = {
    readonly slug: string;
    readonly internalID: string;
    readonly isAcquireable: boolean | null;
    readonly isOfferable: boolean | null;
    readonly isBiddable: boolean | null;
    readonly isInquireable: boolean | null;
    readonly " $refType": CommercialButtons_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CommercialButtons_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isAcquireable",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isOfferable",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isBiddable",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isInquireable",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'da4f2cc65d735350f0a389a6f27e236e';
export default node;

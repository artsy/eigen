/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _Header_artist$ref: unique symbol;
export type Header_artist$ref = typeof _Header_artist$ref;
export type Header_artist = {
    readonly _id: string;
    readonly gravityID: string;
    readonly name: string | null;
    readonly nationality: string | null;
    readonly birthday: string | null;
    readonly counts: ({
        readonly follows: any | null;
    }) | null;
    readonly " $refType": Header_artist$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Header_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "_id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "gravityID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "nationality",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "birthday",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "counts",
      "storageKey": null,
      "args": null,
      "concreteType": "ArtistCounts",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "follows",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '04821936a0e40e0605a1d2d8d877fbcd';
export default node;

/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _Biography_artist$ref: unique symbol;
export type Biography_artist$ref = typeof _Biography_artist$ref;
export type Biography_artist = {
    readonly bio: string | null;
    readonly blurb: string | null;
    readonly " $refType": Biography_artist$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "Biography_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "bio",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "blurb",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "__id",
      "name": "id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'c69d884d6a5b77e0d57f6324d613c6be';
export default node;

/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _Collection_collection$ref: unique symbol;
export type Collection_collection$ref = typeof _Collection_collection$ref;
export type Collection_collection = {
    readonly slug: string;
    readonly title: string;
    readonly description: string | null;
    readonly headerImage: string | null;
    readonly category: string;
    readonly credit: string | null;
    readonly " $refType": Collection_collection$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Collection_collection",
  "type": "MarketingCollection",
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
      "name": "title",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "description",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "headerImage",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "category",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "credit",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '54fe3fc0e4a55f9f23d15714f3fe8dc6';
export default node;

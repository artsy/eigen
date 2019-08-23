/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { CollectionHeader_collection$ref } from "./CollectionHeader_collection.graphql";
declare const _Collection_collection$ref: unique symbol;
export type Collection_collection$ref = typeof _Collection_collection$ref;
export type Collection_collection = {
    readonly slug: string;
    readonly title: string;
    readonly description: string | null;
    readonly headerImage: string | null;
    readonly category: string;
    readonly credit: string | null;
    readonly " $fragmentRefs": CollectionHeader_collection$ref;
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
    },
    {
      "kind": "FragmentSpread",
      "name": "CollectionHeader_collection",
      "args": null
    }
  ]
};
(node as any).hash = '272bdcb6bf0e1ce2656b47a173b123cb';
export default node;

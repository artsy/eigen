/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { CollectionHeader_collection$ref } from "./CollectionHeader_collection.graphql";
declare const _Collection_collection$ref: unique symbol;
export type Collection_collection$ref = typeof _Collection_collection$ref;
export type Collection_collection = {
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
      "kind": "FragmentSpread",
      "name": "CollectionHeader_collection",
      "args": null
    }
  ]
};
(node as any).hash = 'ce918671e232657859d23f6badbebe8b';
export default node;

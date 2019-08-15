/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _Collection_collection$ref: unique symbol;
export type Collection_collection$ref = typeof _Collection_collection$ref;
export type Collection_collection = {
    readonly slug: string;
    readonly title: string;
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
    }
  ]
};
(node as any).hash = '128ac40022072eca1ad579dc5db74f86';
export default node;

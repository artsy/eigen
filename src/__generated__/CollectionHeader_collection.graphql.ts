/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type CollectionHeader_collection = {
    readonly title: string;
    readonly description: string | null;
    readonly " $refType": "CollectionHeader_collection";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CollectionHeader_collection",
  "type": "MarketingCollection",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
    }
  ]
};
(node as any).hash = '6b59485ca672dd49d5364f76eb414413';
export default node;

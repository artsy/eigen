/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { Show_show$ref } from "./Show_show.graphql";
declare const _SmallList_shows$ref: unique symbol;
export type SmallList_shows$ref = typeof _SmallList_shows$ref;
export type SmallList_shows = ReadonlyArray<{
    readonly " $fragmentRefs": Show_show$ref;
    readonly " $refType": SmallList_shows$ref;
}>;



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "SmallList_shows",
  "type": "PartnerShow",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "Show_show",
      "args": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '7fc693edca8ffe74cb41102a5bc9cb22';
export default node;

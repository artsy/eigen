/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { Detail_show$ref } from "./Detail_show.graphql";
declare const _Show_show$ref: unique symbol;
export type Show_show$ref = typeof _Show_show$ref;
export type Show_show = {
    readonly " $fragmentRefs": Detail_show$ref;
    readonly " $refType": Show_show$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "Show_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "Detail_show",
      "args": null
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
(node as any).hash = '3508bfae54d51fc89eb5bed696d4305b';
export default node;

/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _Shows_show$ref: unique symbol;
export type Shows_show$ref = typeof _Shows_show$ref;
export type Shows_show = {
    readonly city: string | null;
    readonly " $refType": Shows_show$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "Shows_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "city",
      "args": null,
      "storageKey": null
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
(node as any).hash = '71c29e48ccd64b4e08ba331c242e5f80';
export default node;

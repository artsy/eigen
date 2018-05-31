/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type SelectMaxBid_me = {
    readonly has_qualified_credit_cards: boolean | null;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "SelectMaxBid_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "has_qualified_credit_cards",
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
(node as any).hash = '72fa085d788fdef62afd86aaa9a3bc31';
export default node;

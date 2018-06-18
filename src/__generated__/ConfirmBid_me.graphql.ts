/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type ConfirmBid_me = {
    readonly has_qualified_credit_cards: boolean | null;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "ConfirmBid_me",
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
(node as any).hash = '455acce8913497a2e138528a5d7d1fac';
export default node;

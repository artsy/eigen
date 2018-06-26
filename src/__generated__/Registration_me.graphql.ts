/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type Registration_me = {
    readonly has_qualified_credit_cards: boolean | null;
    readonly bidders: ReadonlyArray<({
            readonly qualified_for_bidding: boolean | null;
        }) | null> | null;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "Registration_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "saleID",
      "type": "String"
    }
  ],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "has_qualified_credit_cards",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "bidders",
      "storageKey": null,
      "args": [
        {
          "kind": "Variable",
          "name": "sale_id",
          "variableName": "saleID",
          "type": "String"
        }
      ],
      "concreteType": "Bidder",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "qualified_for_bidding",
          "args": null,
          "storageKey": null
        },
        v0
      ]
    },
    v0
  ]
};
})();
(node as any).hash = '2cc1e990b6a0dae57dd6ec9149f7257d';
export default node;

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 40c9b846079ff55332ad001a346e421a */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RegisterToBidButtonTestsQueryVariables = {};
export type RegisterToBidButtonTestsQueryResponse = {
    readonly sale: {
        readonly " $fragmentRefs": FragmentRefs<"RegisterToBidButton_sale">;
    } | null;
};
export type RegisterToBidButtonTestsQuery = {
    readonly response: RegisterToBidButtonTestsQueryResponse;
    readonly variables: RegisterToBidButtonTestsQueryVariables;
};



/*
query RegisterToBidButtonTestsQuery {
  sale(id: "the-sale") {
    ...RegisterToBidButton_sale
    id
  }
}

fragment RegisterToBidButton_sale on Sale {
  slug
  startAt
  endAt
  requireIdentityVerification
  registrationStatus {
    qualifiedForBidding
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "the-sale"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v3 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v4 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "RegisterToBidButtonTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Sale",
        "kind": "LinkedField",
        "name": "sale",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "RegisterToBidButton_sale"
          }
        ],
        "storageKey": "sale(id:\"the-sale\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "RegisterToBidButtonTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Sale",
        "kind": "LinkedField",
        "name": "sale",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "slug",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "startAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "endAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "requireIdentityVerification",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Bidder",
            "kind": "LinkedField",
            "name": "registrationStatus",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "qualifiedForBidding",
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          (v1/*: any*/)
        ],
        "storageKey": "sale(id:\"the-sale\")"
      }
    ]
  },
  "params": {
    "id": "40c9b846079ff55332ad001a346e421a",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "sale": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Sale"
        },
        "sale.endAt": (v2/*: any*/),
        "sale.id": (v3/*: any*/),
        "sale.registrationStatus": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Bidder"
        },
        "sale.registrationStatus.id": (v3/*: any*/),
        "sale.registrationStatus.qualifiedForBidding": (v4/*: any*/),
        "sale.requireIdentityVerification": (v4/*: any*/),
        "sale.slug": (v3/*: any*/),
        "sale.startAt": (v2/*: any*/)
      }
    },
    "name": "RegisterToBidButtonTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '9c3843ff8d86d5bc2444ed9045c588fc';
export default node;

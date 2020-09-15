/* tslint:disable */
/* eslint-disable */
/* @relayHash af4b8cb3b1be08c1929192b5e416b42a */

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
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v3 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v4 = {
  "type": "Boolean",
  "enumValues": null,
  "plural": false,
  "nullable": true
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "RegisterToBidButtonTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale",
        "storageKey": "sale(id:\"the-sale\")",
        "args": (v0/*: any*/),
        "concreteType": "Sale",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "RegisterToBidButton_sale",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "RegisterToBidButtonTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale",
        "storageKey": "sale(id:\"the-sale\")",
        "args": (v0/*: any*/),
        "concreteType": "Sale",
        "plural": false,
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
            "name": "startAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "endAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "requireIdentityVerification",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "registrationStatus",
            "storageKey": null,
            "args": null,
            "concreteType": "Bidder",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "qualifiedForBidding",
                "args": null,
                "storageKey": null
              },
              (v1/*: any*/)
            ]
          },
          (v1/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "RegisterToBidButtonTestsQuery",
    "id": "40c9b846079ff55332ad001a346e421a",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "sale": {
          "type": "Sale",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "sale.id": (v2/*: any*/),
        "sale.slug": {
          "type": "ID",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "sale.startAt": (v3/*: any*/),
        "sale.endAt": (v3/*: any*/),
        "sale.requireIdentityVerification": (v4/*: any*/),
        "sale.registrationStatus": {
          "type": "Bidder",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "sale.registrationStatus.qualifiedForBidding": (v4/*: any*/),
        "sale.registrationStatus.id": (v2/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = '9c3843ff8d86d5bc2444ed9045c588fc';
export default node;

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 8506c73e47280ff41b07eee447ac1b7d */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleInfoTestsQueryVariables = {};
export type SaleInfoTestsQueryResponse = {
    readonly sale: {
        readonly " $fragmentRefs": FragmentRefs<"SaleInfo_sale">;
    } | null;
};
export type SaleInfoTestsQuery = {
    readonly response: SaleInfoTestsQueryResponse;
    readonly variables: SaleInfoTestsQueryVariables;
};



/*
query SaleInfoTestsQuery {
  sale(id: "the-sale") {
    ...SaleInfo_sale
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

fragment SaleInfo_sale on Sale {
  ...RegisterToBidButton_sale
  description
  endAt
  isWithBuyersPremium
  liveStartAt
  name
  startAt
  timeZone
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
    "name": "SaleInfoTestsQuery",
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
            "name": "SaleInfo_sale"
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
    "name": "SaleInfoTestsQuery",
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
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "description",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isWithBuyersPremium",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "liveStartAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "timeZone",
            "storageKey": null
          },
          (v1/*: any*/)
        ],
        "storageKey": "sale(id:\"the-sale\")"
      }
    ]
  },
  "params": {
    "id": "8506c73e47280ff41b07eee447ac1b7d",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "sale": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Sale"
        },
        "sale.description": (v2/*: any*/),
        "sale.endAt": (v2/*: any*/),
        "sale.id": (v3/*: any*/),
        "sale.isWithBuyersPremium": (v4/*: any*/),
        "sale.liveStartAt": (v2/*: any*/),
        "sale.name": (v2/*: any*/),
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
        "sale.startAt": (v2/*: any*/),
        "sale.timeZone": (v2/*: any*/)
      }
    },
    "name": "SaleInfoTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '2b07ca5d4c437c448baa0729d58e157a';
export default node;

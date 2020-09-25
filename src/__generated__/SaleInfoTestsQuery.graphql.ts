/* tslint:disable */
/* eslint-disable */
/* @relayHash e0aa17f7fa25cf79c3de46d2a350becb */

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
  description
  endAt
  liveStartAt
  name
  startAt
  timeZone
  ...RegisterToBidButton_sale
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
    "name": "SaleInfoTestsQuery",
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
            "name": "SaleInfo_sale",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SaleInfoTestsQuery",
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
            "name": "description",
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
            "name": "liveStartAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "name",
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
            "name": "timeZone",
            "args": null,
            "storageKey": null
          },
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
    "name": "SaleInfoTestsQuery",
    "id": "adb8820966f22b360ca98b4d4030740a",
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
        "sale.description": (v3/*: any*/),
        "sale.endAt": (v3/*: any*/),
        "sale.liveStartAt": (v3/*: any*/),
        "sale.name": (v3/*: any*/),
        "sale.startAt": (v3/*: any*/),
        "sale.timeZone": (v3/*: any*/),
        "sale.slug": {
          "type": "ID",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
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
(node as any).hash = '2b07ca5d4c437c448baa0729d58e157a';
export default node;

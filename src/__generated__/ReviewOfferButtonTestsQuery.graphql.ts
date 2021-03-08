/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 9a5b818fabc584e064d09063d4c90649 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ReviewOfferButtonTestsQueryVariables = {
    orderID: string;
};
export type ReviewOfferButtonTestsQueryResponse = {
    readonly order: {
        readonly " $fragmentRefs": FragmentRefs<"ReviewOfferButton_order">;
    } | null;
};
export type ReviewOfferButtonTestsQuery = {
    readonly response: ReviewOfferButtonTestsQueryResponse;
    readonly variables: ReviewOfferButtonTestsQueryVariables;
};



/*
query ReviewOfferButtonTestsQuery(
  $orderID: ID!
) {
  order: commerceOrder(id: $orderID) {
    __typename
    ...ReviewOfferButton_order
    id
  }
}

fragment ReviewOfferButton_order on CommerceOfferOrder {
  internalID
  state
  stateReason
  stateExpiresAt(format: "MMM D")
  lastOffer {
    fromParticipant
    createdAt
    id
  }
  offers(first: 5) {
    edges {
      node {
        internalID
        id
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "orderID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "orderID"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v4 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v5 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v6 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "CommerceOffer"
},
v7 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ReviewOfferButtonTestsQuery",
    "selections": [
      {
        "alias": "order",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "commerceOrder",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ReviewOfferButton_order"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ReviewOfferButtonTestsQuery",
    "selections": [
      {
        "alias": "order",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "commerceOrder",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "state",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "stateReason",
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "format",
                    "value": "MMM D"
                  }
                ],
                "kind": "ScalarField",
                "name": "stateExpiresAt",
                "storageKey": "stateExpiresAt(format:\"MMM D\")"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "CommerceOffer",
                "kind": "LinkedField",
                "name": "lastOffer",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "fromParticipant",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "createdAt",
                    "storageKey": null
                  },
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 5
                  }
                ],
                "concreteType": "CommerceOfferConnection",
                "kind": "LinkedField",
                "name": "offers",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CommerceOfferEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "CommerceOffer",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "offers(first:5)"
              }
            ],
            "type": "CommerceOfferOrder",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "9a5b818fabc584e064d09063d4c90649",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "order": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceOrder"
        },
        "order.__typename": (v4/*: any*/),
        "order.id": (v5/*: any*/),
        "order.internalID": (v5/*: any*/),
        "order.lastOffer": (v6/*: any*/),
        "order.lastOffer.createdAt": (v4/*: any*/),
        "order.lastOffer.fromParticipant": {
          "enumValues": [
            "BUYER",
            "SELLER"
          ],
          "nullable": true,
          "plural": false,
          "type": "CommerceOrderParticipantEnum"
        },
        "order.lastOffer.id": (v5/*: any*/),
        "order.offers": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceOfferConnection"
        },
        "order.offers.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "CommerceOfferEdge"
        },
        "order.offers.edges.node": (v6/*: any*/),
        "order.offers.edges.node.id": (v5/*: any*/),
        "order.offers.edges.node.internalID": (v5/*: any*/),
        "order.state": {
          "enumValues": [
            "ABANDONED",
            "APPROVED",
            "CANCELED",
            "FULFILLED",
            "PENDING",
            "REFUNDED",
            "SUBMITTED"
          ],
          "nullable": false,
          "plural": false,
          "type": "CommerceOrderStateEnum"
        },
        "order.stateExpiresAt": (v7/*: any*/),
        "order.stateReason": (v7/*: any*/)
      }
    },
    "name": "ReviewOfferButtonTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'e05e7f152950ace6b33fe6675ee32439';
export default node;

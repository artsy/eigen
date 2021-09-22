/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 9b74a83863445e6f195990d587ca8c5c */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SummarySectionTestsQueryVariables = {};
export type SummarySectionTestsQueryResponse = {
    readonly commerceOrder: {
        readonly internalID: string;
        readonly " $fragmentRefs": FragmentRefs<"SummarySection_section">;
    } | null;
};
export type SummarySectionTestsQuery = {
    readonly response: SummarySectionTestsQueryResponse;
    readonly variables: SummarySectionTestsQueryVariables;
};



/*
query SummarySectionTestsQuery {
  commerceOrder(id: "some-id") {
    __typename
    internalID
    ...SummarySection_section
    id
  }
}

fragment SummarySection_section on CommerceOrder {
  __isCommerceOrder: __typename
  mode
  buyerTotal(precision: 2)
  taxTotal(precision: 2)
  shippingTotal(precision: 2)
  totalListPrice(precision: 2)
  lineItems(first: 1) {
    edges {
      node {
        selectedShippingQuote {
          displayName
          id
        }
        id
      }
    }
  }
  ... on CommerceOfferOrder {
    lastOffer {
      amount(precision: 2)
      fromParticipant
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "some-id"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v2 = [
  {
    "kind": "Literal",
    "name": "precision",
    "value": 2
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
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
  "nullable": true,
  "plural": false,
  "type": "String"
},
v6 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SummarySectionTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "commerceOrder",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "SummarySection_section"
          }
        ],
        "storageKey": "commerceOrder(id:\"some-id\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SummarySectionTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
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
          (v1/*: any*/),
          {
            "kind": "TypeDiscriminator",
            "abstractKey": "__isCommerceOrder"
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "mode",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v2/*: any*/),
            "kind": "ScalarField",
            "name": "buyerTotal",
            "storageKey": "buyerTotal(precision:2)"
          },
          {
            "alias": null,
            "args": (v2/*: any*/),
            "kind": "ScalarField",
            "name": "taxTotal",
            "storageKey": "taxTotal(precision:2)"
          },
          {
            "alias": null,
            "args": (v2/*: any*/),
            "kind": "ScalarField",
            "name": "shippingTotal",
            "storageKey": "shippingTotal(precision:2)"
          },
          {
            "alias": null,
            "args": (v2/*: any*/),
            "kind": "ScalarField",
            "name": "totalListPrice",
            "storageKey": "totalListPrice(precision:2)"
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 1
              }
            ],
            "concreteType": "CommerceLineItemConnection",
            "kind": "LinkedField",
            "name": "lineItems",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "CommerceLineItemEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CommerceLineItem",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "CommerceShippingQuote",
                        "kind": "LinkedField",
                        "name": "selectedShippingQuote",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "displayName",
                            "storageKey": null
                          },
                          (v3/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "lineItems(first:1)"
          },
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
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
                    "args": (v2/*: any*/),
                    "kind": "ScalarField",
                    "name": "amount",
                    "storageKey": "amount(precision:2)"
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "fromParticipant",
                    "storageKey": null
                  },
                  (v3/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "CommerceOfferOrder",
            "abstractKey": null
          }
        ],
        "storageKey": "commerceOrder(id:\"some-id\")"
      }
    ]
  },
  "params": {
    "id": "9b74a83863445e6f195990d587ca8c5c",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "commerceOrder": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceOrder"
        },
        "commerceOrder.__isCommerceOrder": (v4/*: any*/),
        "commerceOrder.__typename": (v4/*: any*/),
        "commerceOrder.buyerTotal": (v5/*: any*/),
        "commerceOrder.id": (v6/*: any*/),
        "commerceOrder.internalID": (v6/*: any*/),
        "commerceOrder.lastOffer": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceOffer"
        },
        "commerceOrder.lastOffer.amount": (v5/*: any*/),
        "commerceOrder.lastOffer.fromParticipant": {
          "enumValues": [
            "BUYER",
            "SELLER"
          ],
          "nullable": true,
          "plural": false,
          "type": "CommerceOrderParticipantEnum"
        },
        "commerceOrder.lastOffer.id": (v6/*: any*/),
        "commerceOrder.lineItems": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceLineItemConnection"
        },
        "commerceOrder.lineItems.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "CommerceLineItemEdge"
        },
        "commerceOrder.lineItems.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceLineItem"
        },
        "commerceOrder.lineItems.edges.node.id": (v6/*: any*/),
        "commerceOrder.lineItems.edges.node.selectedShippingQuote": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceShippingQuote"
        },
        "commerceOrder.lineItems.edges.node.selectedShippingQuote.displayName": (v4/*: any*/),
        "commerceOrder.lineItems.edges.node.selectedShippingQuote.id": (v6/*: any*/),
        "commerceOrder.mode": {
          "enumValues": [
            "BUY",
            "OFFER"
          ],
          "nullable": true,
          "plural": false,
          "type": "CommerceOrderModeEnum"
        },
        "commerceOrder.shippingTotal": (v5/*: any*/),
        "commerceOrder.taxTotal": (v5/*: any*/),
        "commerceOrder.totalListPrice": (v5/*: any*/)
      }
    },
    "name": "SummarySectionTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '87ec933055f0fdb2de8cfb0f1bbf5185';
export default node;

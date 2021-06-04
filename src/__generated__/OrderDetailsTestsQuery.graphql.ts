/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 7bcada5bd2cfa2f37d99bae8211e33cb */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OrderDetailsTestsQueryVariables = {};
export type OrderDetailsTestsQueryResponse = {
    readonly order: {
        readonly " $fragmentRefs": FragmentRefs<"OrderDetails_order">;
    } | null;
    readonly me: {
        readonly name: string | null;
    } | null;
};
export type OrderDetailsTestsQuery = {
    readonly response: OrderDetailsTestsQueryResponse;
    readonly variables: OrderDetailsTestsQueryVariables;
};



/*
query OrderDetailsTestsQuery {
  order: commerceOrder(id: "order-id") {
    __typename
    ...OrderDetails_order
    id
  }
  me {
    name
    id
  }
}

fragment ArtworkInfoSection_artwork on CommerceOrder {
  __isCommerceOrder: __typename
  lineItems(first: 1) {
    edges {
      node {
        artwork {
          medium
          editionOf
          dimensions {
            in
            cm
          }
          date
          image {
            url(version: "square60")
          }
          title
          artistNames
          id
        }
        id
      }
    }
  }
}

fragment OrderDetails_order on CommerceOrder {
  __isCommerceOrder: __typename
  lineItems(first: 1) {
    edges {
      node {
        artwork {
          partner {
            name
            id
          }
          id
        }
        id
      }
    }
  }
  createdAt
  requestedFulfillment {
    __typename
    ... on CommerceShip {
      __typename
    }
    ... on CommercePickup {
      __typename
    }
  }
  code
  ...ArtworkInfoSection_artwork
  ...ShipsToSection_address
  ...SoldBySection_soldBy
}

fragment ShipsToSection_address on CommerceOrder {
  __isCommerceOrder: __typename
  requestedFulfillment {
    __typename
    ... on CommerceShip {
      addressLine1
      addressLine2
      city
      country
      phoneNumber
      postalCode
      region
    }
  }
}

fragment SoldBySection_soldBy on CommerceOrder {
  __isCommerceOrder: __typename
  lineItems(first: 1) {
    edges {
      node {
        fulfillments(first: 1) {
          edges {
            node {
              trackingId
              id
            }
          }
        }
        id
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "order-id"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = [
  (v1/*: any*/),
  (v4/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "OrderDetailsTestsQuery",
    "selections": [
      {
        "alias": "order",
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "commerceOrder",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "OrderDetails_order"
          }
        ],
        "storageKey": "commerceOrder(id:\"order-id\")"
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          (v1/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "OrderDetailsTestsQuery",
    "selections": [
      {
        "alias": "order",
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "commerceOrder",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "TypeDiscriminator",
            "abstractKey": "__isCommerceOrder"
          },
          {
            "alias": null,
            "args": (v3/*: any*/),
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
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "artwork",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Partner",
                            "kind": "LinkedField",
                            "name": "partner",
                            "plural": false,
                            "selections": (v5/*: any*/),
                            "storageKey": null
                          },
                          (v4/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "medium",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "editionOf",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "dimensions",
                            "kind": "LinkedField",
                            "name": "dimensions",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "in",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "cm",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "date",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "image",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "version",
                                    "value": "square60"
                                  }
                                ],
                                "kind": "ScalarField",
                                "name": "url",
                                "storageKey": "url(version:\"square60\")"
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "title",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "artistNames",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": (v3/*: any*/),
                        "concreteType": "CommerceFulfillmentConnection",
                        "kind": "LinkedField",
                        "name": "fulfillments",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CommerceFulfillmentEdge",
                            "kind": "LinkedField",
                            "name": "edges",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CommerceFulfillment",
                                "kind": "LinkedField",
                                "name": "node",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "trackingId",
                                    "storageKey": null
                                  },
                                  (v4/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "fulfillments(first:1)"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "lineItems(first:1)"
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "createdAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "requestedFulfillment",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "addressLine1",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "addressLine2",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "city",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "country",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "phoneNumber",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "postalCode",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "region",
                    "storageKey": null
                  }
                ],
                "type": "CommerceShip",
                "abstractKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "code",
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": "commerceOrder(id:\"order-id\")"
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "7bcada5bd2cfa2f37d99bae8211e33cb",
    "metadata": {},
    "name": "OrderDetailsTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '256ff19a85686a62616295c42e63501c';
export default node;

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 6cbe758069973caad756e33f49aceff6 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkPriceEstimateTestsQueryVariables = {};
export type MyCollectionArtworkPriceEstimateTestsQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkPriceEstimate_artwork">;
    } | null;
    readonly marketPriceInsights: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkPriceEstimate_marketPriceInsights">;
    } | null;
};
export type MyCollectionArtworkPriceEstimateTestsQuery = {
    readonly response: MyCollectionArtworkPriceEstimateTestsQueryResponse;
    readonly variables: MyCollectionArtworkPriceEstimateTestsQueryVariables;
};



/*
query MyCollectionArtworkPriceEstimateTestsQuery {
  artwork(id: "foo") {
    ...MyCollectionArtworkPriceEstimate_artwork
    id
  }
  marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
    ...MyCollectionArtworkPriceEstimate_marketPriceInsights
    id
  }
}

fragment MyCollectionArtworkPriceEstimate_artwork on Artwork {
  pricePaid {
    display
  }
  internalID
  sizeBucket
  slug
}

fragment MyCollectionArtworkPriceEstimate_marketPriceInsights on MarketPriceInsights {
  highRangeCents
  largeHighRangeCents
  largeLowRangeCents
  largeMidRangeCents
  lowRangeCents
  mediumHighRangeCents
  mediumLowRangeCents
  mediumMidRangeCents
  midRangeCents
  smallHighRangeCents
  smallLowRangeCents
  smallMidRangeCents
  artsyQInventory
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "foo"
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "artistId",
    "value": "some-artist-id"
  },
  {
    "kind": "Literal",
    "name": "medium",
    "value": "painting"
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
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v4 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v5 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "BigInt"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionArtworkPriceEstimateTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkPriceEstimate_artwork"
          }
        ],
        "storageKey": "artwork(id:\"foo\")"
      },
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MarketPriceInsights",
        "kind": "LinkedField",
        "name": "marketPriceInsights",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkPriceEstimate_marketPriceInsights"
          }
        ],
        "storageKey": "marketPriceInsights(artistId:\"some-artist-id\",medium:\"painting\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MyCollectionArtworkPriceEstimateTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Money",
            "kind": "LinkedField",
            "name": "pricePaid",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "display",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "internalID",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "sizeBucket",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "slug",
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": "artwork(id:\"foo\")"
      },
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MarketPriceInsights",
        "kind": "LinkedField",
        "name": "marketPriceInsights",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "highRangeCents",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "largeHighRangeCents",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "largeLowRangeCents",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "largeMidRangeCents",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "lowRangeCents",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "mediumHighRangeCents",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "mediumLowRangeCents",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "mediumMidRangeCents",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "midRangeCents",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "smallHighRangeCents",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "smallLowRangeCents",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "smallMidRangeCents",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "artsyQInventory",
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": "marketPriceInsights(artistId:\"some-artist-id\",medium:\"painting\")"
      }
    ]
  },
  "params": {
    "id": "6cbe758069973caad756e33f49aceff6",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "artwork.id": (v3/*: any*/),
        "artwork.internalID": (v3/*: any*/),
        "artwork.pricePaid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Money"
        },
        "artwork.pricePaid.display": (v4/*: any*/),
        "artwork.sizeBucket": (v4/*: any*/),
        "artwork.slug": (v3/*: any*/),
        "marketPriceInsights": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MarketPriceInsights"
        },
        "marketPriceInsights.artsyQInventory": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Int"
        },
        "marketPriceInsights.highRangeCents": (v5/*: any*/),
        "marketPriceInsights.id": (v3/*: any*/),
        "marketPriceInsights.largeHighRangeCents": (v5/*: any*/),
        "marketPriceInsights.largeLowRangeCents": (v5/*: any*/),
        "marketPriceInsights.largeMidRangeCents": (v5/*: any*/),
        "marketPriceInsights.lowRangeCents": (v5/*: any*/),
        "marketPriceInsights.mediumHighRangeCents": (v5/*: any*/),
        "marketPriceInsights.mediumLowRangeCents": (v5/*: any*/),
        "marketPriceInsights.mediumMidRangeCents": (v5/*: any*/),
        "marketPriceInsights.midRangeCents": (v5/*: any*/),
        "marketPriceInsights.smallHighRangeCents": (v5/*: any*/),
        "marketPriceInsights.smallLowRangeCents": (v5/*: any*/),
        "marketPriceInsights.smallMidRangeCents": (v5/*: any*/)
      }
    },
    "name": "MyCollectionArtworkPriceEstimateTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '003d92ec79b7c4f5233d1c57ea5b04b7';
export default node;

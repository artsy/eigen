/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 1a93cef46acdd481a44b4a935b6b9c67 */

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
  costCurrencyCode
  costMinor
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
  "nullable": true,
  "plural": false,
  "type": "String"
},
v4 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
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
            "kind": "ScalarField",
            "name": "costCurrencyCode",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "costMinor",
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
    "id": "1a93cef46acdd481a44b4a935b6b9c67",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "artwork.costCurrencyCode": (v3/*: any*/),
        "artwork.costMinor": (v4/*: any*/),
        "artwork.id": (v5/*: any*/),
        "artwork.internalID": (v5/*: any*/),
        "artwork.sizeBucket": (v3/*: any*/),
        "artwork.slug": (v5/*: any*/),
        "marketPriceInsights": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MarketPriceInsights"
        },
        "marketPriceInsights.artsyQInventory": (v4/*: any*/),
        "marketPriceInsights.highRangeCents": (v6/*: any*/),
        "marketPriceInsights.id": (v5/*: any*/),
        "marketPriceInsights.largeHighRangeCents": (v6/*: any*/),
        "marketPriceInsights.largeLowRangeCents": (v6/*: any*/),
        "marketPriceInsights.largeMidRangeCents": (v6/*: any*/),
        "marketPriceInsights.lowRangeCents": (v6/*: any*/),
        "marketPriceInsights.mediumHighRangeCents": (v6/*: any*/),
        "marketPriceInsights.mediumLowRangeCents": (v6/*: any*/),
        "marketPriceInsights.mediumMidRangeCents": (v6/*: any*/),
        "marketPriceInsights.midRangeCents": (v6/*: any*/),
        "marketPriceInsights.smallHighRangeCents": (v6/*: any*/),
        "marketPriceInsights.smallLowRangeCents": (v6/*: any*/),
        "marketPriceInsights.smallMidRangeCents": (v6/*: any*/)
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

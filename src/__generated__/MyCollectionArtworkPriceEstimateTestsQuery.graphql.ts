/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash e1d69042a5c3f99f1f7167fd85323e96 */

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
  }
}

fragment MyCollectionArtworkPriceEstimate_artwork on Artwork {
  costCurrencyCode
  costMinor
  sizeBucket
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
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v3 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
},
v4 = {
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
            "name": "sizeBucket",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
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
          }
        ],
        "storageKey": "marketPriceInsights(artistId:\"some-artist-id\",medium:\"painting\")"
      }
    ]
  },
  "params": {
    "id": "e1d69042a5c3f99f1f7167fd85323e96",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "artwork.costCurrencyCode": (v2/*: any*/),
        "artwork.costMinor": (v3/*: any*/),
        "artwork.id": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ID"
        },
        "artwork.sizeBucket": (v2/*: any*/),
        "marketPriceInsights": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MarketPriceInsights"
        },
        "marketPriceInsights.artsyQInventory": (v3/*: any*/),
        "marketPriceInsights.highRangeCents": (v4/*: any*/),
        "marketPriceInsights.largeHighRangeCents": (v4/*: any*/),
        "marketPriceInsights.largeLowRangeCents": (v4/*: any*/),
        "marketPriceInsights.largeMidRangeCents": (v4/*: any*/),
        "marketPriceInsights.lowRangeCents": (v4/*: any*/),
        "marketPriceInsights.mediumHighRangeCents": (v4/*: any*/),
        "marketPriceInsights.mediumLowRangeCents": (v4/*: any*/),
        "marketPriceInsights.mediumMidRangeCents": (v4/*: any*/),
        "marketPriceInsights.midRangeCents": (v4/*: any*/),
        "marketPriceInsights.smallHighRangeCents": (v4/*: any*/),
        "marketPriceInsights.smallLowRangeCents": (v4/*: any*/),
        "marketPriceInsights.smallMidRangeCents": (v4/*: any*/)
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

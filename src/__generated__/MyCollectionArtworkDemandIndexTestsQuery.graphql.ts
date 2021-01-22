/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 529f0a3da3f170f5454ab6542eac22f6 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkDemandIndexTestsQueryVariables = {};
export type MyCollectionArtworkDemandIndexTestsQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkDemandIndex_artwork">;
    } | null;
    readonly marketPriceInsights: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkDemandIndex_marketPriceInsights">;
    } | null;
};
export type MyCollectionArtworkDemandIndexTestsQuery = {
    readonly response: MyCollectionArtworkDemandIndexTestsQueryResponse;
    readonly variables: MyCollectionArtworkDemandIndexTestsQueryVariables;
};



/*
query MyCollectionArtworkDemandIndexTestsQuery {
  artwork(id: "some-artwork-id") {
    ...MyCollectionArtworkDemandIndex_artwork
    id
  }
  marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
    ...MyCollectionArtworkDemandIndex_marketPriceInsights
    id
  }
}

fragment MyCollectionArtworkDemandIndex_artwork on Artwork {
  internalID
  slug
}

fragment MyCollectionArtworkDemandIndex_marketPriceInsights on MarketPriceInsights {
  demandRank
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "some-artwork-id"
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
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionArtworkDemandIndexTestsQuery",
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
            "name": "MyCollectionArtworkDemandIndex_artwork"
          }
        ],
        "storageKey": "artwork(id:\"some-artwork-id\")"
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
            "name": "MyCollectionArtworkDemandIndex_marketPriceInsights"
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
    "name": "MyCollectionArtworkDemandIndexTestsQuery",
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
            "name": "internalID",
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
        "storageKey": "artwork(id:\"some-artwork-id\")"
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
            "name": "demandRank",
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": "marketPriceInsights(artistId:\"some-artist-id\",medium:\"painting\")"
      }
    ]
  },
  "params": {
    "id": "529f0a3da3f170f5454ab6542eac22f6",
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
        "artwork.slug": (v3/*: any*/),
        "marketPriceInsights": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MarketPriceInsights"
        },
        "marketPriceInsights.demandRank": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Float"
        },
        "marketPriceInsights.id": (v3/*: any*/)
      }
    },
    "name": "MyCollectionArtworkDemandIndexTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'fff5977d298543eae7a09e441e67923b';
export default node;

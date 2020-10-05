/* tslint:disable */
/* eslint-disable */
/* @relayHash dcbaec099101d434cddf847a0237ace5 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleArtworkTileRailCardTestsQueryVariables = {};
export type SaleArtworkTileRailCardTestsQueryResponse = {
    readonly saleArtwork: {
        readonly " $fragmentRefs": FragmentRefs<"SaleArtworkTileRailCard_saleArtwork">;
    } | null;
};
export type SaleArtworkTileRailCardTestsQuery = {
    readonly response: SaleArtworkTileRailCardTestsQueryResponse;
    readonly variables: SaleArtworkTileRailCardTestsQueryVariables;
};



/*
query SaleArtworkTileRailCardTestsQuery {
  saleArtwork(id: "the-sale") {
    ...SaleArtworkTileRailCard_saleArtwork
    id
  }
}

fragment SaleArtworkTileRailCard_saleArtwork on SaleArtwork {
  artwork {
    artistNames
    date
    href
    image {
      imageURL: url(version: "small")
      aspectRatio
    }
    internalID
    slug
    saleMessage
    title
    id
  }
  counts {
    bidderPositions
  }
  currentBid {
    display
  }
  lotLabel
  sale {
    isAuction
    isClosed
    displayTimelyAt
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
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v5 = {
  "type": "Boolean",
  "enumValues": null,
  "plural": false,
  "nullable": true
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "SaleArtworkTileRailCardTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "saleArtwork",
        "storageKey": "saleArtwork(id:\"the-sale\")",
        "args": (v0/*: any*/),
        "concreteType": "SaleArtwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "SaleArtworkTileRailCard_saleArtwork",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SaleArtworkTileRailCardTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "saleArtwork",
        "storageKey": "saleArtwork(id:\"the-sale\")",
        "args": (v0/*: any*/),
        "concreteType": "SaleArtwork",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artwork",
            "storageKey": null,
            "args": null,
            "concreteType": "Artwork",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "artistNames",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "date",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "href",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "image",
                "storageKey": null,
                "args": null,
                "concreteType": "Image",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": "imageURL",
                    "name": "url",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "version",
                        "value": "small"
                      }
                    ],
                    "storageKey": "url(version:\"small\")"
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "aspectRatio",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "internalID",
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
                "name": "saleMessage",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "title",
                "args": null,
                "storageKey": null
              },
              (v1/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "counts",
            "storageKey": null,
            "args": null,
            "concreteType": "SaleArtworkCounts",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "bidderPositions",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "currentBid",
            "storageKey": null,
            "args": null,
            "concreteType": "SaleArtworkCurrentBid",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "display",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "lotLabel",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "sale",
            "storageKey": null,
            "args": null,
            "concreteType": "Sale",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isAuction",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isClosed",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "displayTimelyAt",
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
    "name": "SaleArtworkTileRailCardTestsQuery",
    "id": "96febd82056beb8a2264e84e64a0312f",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "saleArtwork": {
          "type": "SaleArtwork",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "saleArtwork.id": (v2/*: any*/),
        "saleArtwork.artwork": {
          "type": "Artwork",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "saleArtwork.counts": {
          "type": "SaleArtworkCounts",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "saleArtwork.currentBid": {
          "type": "SaleArtworkCurrentBid",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "saleArtwork.lotLabel": (v3/*: any*/),
        "saleArtwork.sale": {
          "type": "Sale",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "saleArtwork.artwork.artistNames": (v3/*: any*/),
        "saleArtwork.artwork.date": (v3/*: any*/),
        "saleArtwork.artwork.href": (v3/*: any*/),
        "saleArtwork.artwork.image": {
          "type": "Image",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "saleArtwork.artwork.internalID": (v4/*: any*/),
        "saleArtwork.artwork.slug": (v4/*: any*/),
        "saleArtwork.artwork.saleMessage": (v3/*: any*/),
        "saleArtwork.artwork.title": (v3/*: any*/),
        "saleArtwork.artwork.id": (v2/*: any*/),
        "saleArtwork.counts.bidderPositions": {
          "type": "FormattedNumber",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "saleArtwork.currentBid.display": (v3/*: any*/),
        "saleArtwork.sale.isAuction": (v5/*: any*/),
        "saleArtwork.sale.isClosed": (v5/*: any*/),
        "saleArtwork.sale.displayTimelyAt": (v3/*: any*/),
        "saleArtwork.sale.id": (v2/*: any*/),
        "saleArtwork.artwork.image.imageURL": (v3/*: any*/),
        "saleArtwork.artwork.image.aspectRatio": {
          "type": "Float",
          "enumValues": null,
          "plural": false,
          "nullable": false
        }
      }
    }
  }
};
})();
(node as any).hash = '6984680176745967effebe8d3fdbcccb';
export default node;

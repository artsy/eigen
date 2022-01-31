/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 52db835f8bbedfc2ae7f76a832f640ae */

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
    realizedPrice
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
    "name": "SaleArtworkTileRailCardTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "SaleArtwork",
        "kind": "LinkedField",
        "name": "saleArtwork",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "SaleArtworkTileRailCard_saleArtwork"
          }
        ],
        "storageKey": "saleArtwork(id:\"the-sale\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SaleArtworkTileRailCardTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "SaleArtwork",
        "kind": "LinkedField",
        "name": "saleArtwork",
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
                "kind": "ScalarField",
                "name": "artistNames",
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
                "kind": "ScalarField",
                "name": "href",
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
                    "alias": "imageURL",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "version",
                        "value": "small"
                      }
                    ],
                    "kind": "ScalarField",
                    "name": "url",
                    "storageKey": "url(version:\"small\")"
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "aspectRatio",
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
                "name": "slug",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "saleMessage",
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
                "name": "realizedPrice",
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "SaleArtworkCounts",
            "kind": "LinkedField",
            "name": "counts",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "bidderPositions",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "SaleArtworkCurrentBid",
            "kind": "LinkedField",
            "name": "currentBid",
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
            "name": "lotLabel",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Sale",
            "kind": "LinkedField",
            "name": "sale",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isAuction",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isClosed",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "displayTimelyAt",
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          (v1/*: any*/)
        ],
        "storageKey": "saleArtwork(id:\"the-sale\")"
      }
    ]
  },
  "params": {
    "id": "52db835f8bbedfc2ae7f76a832f640ae",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "saleArtwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtwork"
        },
        "saleArtwork.artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "saleArtwork.artwork.artistNames": (v2/*: any*/),
        "saleArtwork.artwork.date": (v2/*: any*/),
        "saleArtwork.artwork.href": (v2/*: any*/),
        "saleArtwork.artwork.id": (v3/*: any*/),
        "saleArtwork.artwork.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "saleArtwork.artwork.image.aspectRatio": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Float"
        },
        "saleArtwork.artwork.image.imageURL": (v2/*: any*/),
        "saleArtwork.artwork.internalID": (v3/*: any*/),
        "saleArtwork.artwork.realizedPrice": (v2/*: any*/),
        "saleArtwork.artwork.saleMessage": (v2/*: any*/),
        "saleArtwork.artwork.slug": (v3/*: any*/),
        "saleArtwork.artwork.title": (v2/*: any*/),
        "saleArtwork.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCounts"
        },
        "saleArtwork.counts.bidderPositions": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FormattedNumber"
        },
        "saleArtwork.currentBid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCurrentBid"
        },
        "saleArtwork.currentBid.display": (v2/*: any*/),
        "saleArtwork.id": (v3/*: any*/),
        "saleArtwork.lotLabel": (v2/*: any*/),
        "saleArtwork.sale": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Sale"
        },
        "saleArtwork.sale.displayTimelyAt": (v2/*: any*/),
        "saleArtwork.sale.id": (v3/*: any*/),
        "saleArtwork.sale.isAuction": (v4/*: any*/),
        "saleArtwork.sale.isClosed": (v4/*: any*/)
      }
    },
    "name": "SaleArtworkTileRailCardTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '6984680176745967effebe8d3fdbcccb';
export default node;

/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { SelectMaxBid_sale_artwork$ref } from "./SelectMaxBid_sale_artwork.graphql";
export type SelectMaxBidRefetchQueryVariables = {
    readonly saleArtworkID: string;
};
export type SelectMaxBidRefetchQueryResponse = {
    readonly sale_artwork: {
        readonly " $fragmentRefs": SelectMaxBid_sale_artwork$ref;
    } | null;
};
export type SelectMaxBidRefetchQuery = {
    readonly response: SelectMaxBidRefetchQueryResponse;
    readonly variables: SelectMaxBidRefetchQueryVariables;
};



/*
query SelectMaxBidRefetchQuery(
  $saleArtworkID: String!
) {
  sale_artwork: saleArtwork(id: $saleArtworkID) {
    ...SelectMaxBid_sale_artwork
    id
  }
}

fragment SelectMaxBid_sale_artwork on SaleArtwork {
  increments(useMyMaxBid: true) {
    display
    cents
  }
  internalID
  ...ConfirmBid_sale_artwork
}

fragment ConfirmBid_sale_artwork on SaleArtwork {
  internalID
  sale {
    slug
    live_start_at: liveStartAt
    end_at: endAt
    id
  }
  artwork {
    slug
    title
    date
    artist_names: artistNames
    image {
      url(version: "small")
    }
    id
  }
  lot_label: lotLabel
  ...BidResult_sale_artwork
}

fragment BidResult_sale_artwork on SaleArtwork {
  minimum_next_bid: minimumNextBid {
    amount
    cents
    display
  }
  sale {
    live_start_at: liveStartAt
    end_at: endAt
    slug
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "saleArtworkID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "saleArtworkID"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "display",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "cents",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "SelectMaxBidRefetchQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "sale_artwork",
        "name": "saleArtwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "SaleArtwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "SelectMaxBid_sale_artwork",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SelectMaxBidRefetchQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "sale_artwork",
        "name": "saleArtwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "SaleArtwork",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "increments",
            "storageKey": "increments(useMyMaxBid:true)",
            "args": [
              {
                "kind": "Literal",
                "name": "useMyMaxBid",
                "value": true
              }
            ],
            "concreteType": "BidIncrementsFormatted",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
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
            "kind": "LinkedField",
            "alias": null,
            "name": "sale",
            "storageKey": null,
            "args": null,
            "concreteType": "Sale",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              {
                "kind": "ScalarField",
                "alias": "live_start_at",
                "name": "liveStartAt",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": "end_at",
                "name": "endAt",
                "args": null,
                "storageKey": null
              },
              (v5/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artwork",
            "storageKey": null,
            "args": null,
            "concreteType": "Artwork",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "title",
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
                "alias": "artist_names",
                "name": "artistNames",
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
                    "alias": null,
                    "name": "url",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "version",
                        "value": "small"
                      }
                    ],
                    "storageKey": "url(version:\"small\")"
                  }
                ]
              },
              (v5/*: any*/)
            ]
          },
          {
            "kind": "ScalarField",
            "alias": "lot_label",
            "name": "lotLabel",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "minimum_next_bid",
            "name": "minimumNextBid",
            "storageKey": null,
            "args": null,
            "concreteType": "SaleArtworkMinimumNextBid",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "amount",
                "args": null,
                "storageKey": null
              },
              (v3/*: any*/),
              (v2/*: any*/)
            ]
          },
          (v5/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "SelectMaxBidRefetchQuery",
    "id": "fd436b31f24c56a13fb50c67d76fbddb",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '33225a98d43577668bd0e8b4d687c651';
export default node;

/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { SelectMaxBid_sale_artwork$ref } from "./SelectMaxBid_sale_artwork.graphql";
export type BidFlowSelectMaxBidRendererQueryVariables = {
    readonly saleArtworkNodeID: string;
};
export type BidFlowSelectMaxBidRendererQueryResponse = {
    readonly node: {
        readonly " $fragmentRefs": SelectMaxBid_sale_artwork$ref;
    } | null;
};
export type BidFlowSelectMaxBidRendererQuery = {
    readonly response: BidFlowSelectMaxBidRendererQueryResponse;
    readonly variables: BidFlowSelectMaxBidRendererQueryVariables;
};



/*
query BidFlowSelectMaxBidRendererQuery(
  $saleArtworkNodeID: ID!
) {
  node(id: $saleArtworkNodeID) {
    __typename
    ...SelectMaxBid_sale_artwork
    id
  }
}

fragment SelectMaxBid_sale_artwork on SaleArtwork {
  id
  increments(useMyMaxBid: true) {
    display
  }
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
  sale {
    liveStartAt
    endAt
    slug
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "saleArtworkNodeID",
    "type": "ID!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "saleArtworkNodeID"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "BidFlowSelectMaxBidRendererQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": null,
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
    "name": "BidFlowSelectMaxBidRendererQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "__typename",
            "args": null,
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "type": "SaleArtwork",
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
                  (v3/*: any*/),
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
                  (v2/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "liveStartAt",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "endAt",
                    "args": null,
                    "storageKey": null
                  }
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
                  (v3/*: any*/),
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
                  (v2/*: any*/)
                ]
              },
              {
                "kind": "ScalarField",
                "alias": "lot_label",
                "name": "lotLabel",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "BidFlowSelectMaxBidRendererQuery",
    "id": "f8fb2d7ad9bb72b52884f1e2e45fe513",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '0c7839106fb0dafe42b93b4c41d3cb43';
export default node;

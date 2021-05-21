/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash e7639181bed16646fb2556e926c3665f */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairFollowedArtistsRailTestsQueryVariables = {
    fairID: string;
};
export type FairFollowedArtistsRailTestsQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"FairFollowedArtistsRail_fair">;
    } | null;
};
export type FairFollowedArtistsRailTestsQueryRawResponse = {
    readonly fair: ({
        readonly internalID: string;
        readonly slug: string;
        readonly followedArtistArtworks: ({
            readonly edges: ReadonlyArray<({
                readonly artwork: ({
                    readonly id: string;
                    readonly internalID: string;
                    readonly slug: string;
                    readonly href: string | null;
                    readonly artistNames: string | null;
                    readonly image: ({
                        readonly imageURL: string | null;
                    }) | null;
                    readonly saleMessage: string | null;
                }) | null;
            }) | null> | null;
            readonly id: string;
        }) | null;
        readonly id: string;
    }) | null;
};
export type FairFollowedArtistsRailTestsQuery = {
    readonly response: FairFollowedArtistsRailTestsQueryResponse;
    readonly variables: FairFollowedArtistsRailTestsQueryVariables;
    readonly rawResponse: FairFollowedArtistsRailTestsQueryRawResponse;
};



/*
query FairFollowedArtistsRailTestsQuery(
  $fairID: String!
) {
  fair(id: $fairID) {
    ...FairFollowedArtistsRail_fair
    id
  }
}

fragment ArtworkTileRailCard_artwork on Artwork {
  slug
  internalID
  href
  artistNames
  image {
    imageURL
  }
  saleMessage
}

fragment FairFollowedArtistsRail_fair on Fair {
  internalID
  slug
  followedArtistArtworks: filterArtworksConnection(first: 20, input: {includeArtworksByFollowedArtists: true}) {
    edges {
      artwork: node {
        id
        internalID
        slug
        ...ArtworkTileRailCard_artwork
      }
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "fairID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "fairID"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "FairFollowedArtistsRailTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "FairFollowedArtistsRail_fair"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "FairFollowedArtistsRailTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": "followedArtistArtworks",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 20
              },
              {
                "kind": "Literal",
                "name": "input",
                "value": {
                  "includeArtworksByFollowedArtists": true
                }
              }
            ],
            "concreteType": "FilterArtworksConnection",
            "kind": "LinkedField",
            "name": "filterArtworksConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "FilterArtworksEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": "artwork",
                    "args": null,
                    "concreteType": "Artwork",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      (v2/*: any*/),
                      (v3/*: any*/),
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
                        "kind": "ScalarField",
                        "name": "artistNames",
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
                            "args": null,
                            "kind": "ScalarField",
                            "name": "imageURL",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "saleMessage",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "storageKey": "filterArtworksConnection(first:20,input:{\"includeArtworksByFollowedArtists\":true})"
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "e7639181bed16646fb2556e926c3665f",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "fair": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Fair"
        },
        "fair.followedArtistArtworks": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FilterArtworksConnection"
        },
        "fair.followedArtistArtworks.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "FilterArtworksEdge"
        },
        "fair.followedArtistArtworks.edges.artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "fair.followedArtistArtworks.edges.artwork.artistNames": (v5/*: any*/),
        "fair.followedArtistArtworks.edges.artwork.href": (v5/*: any*/),
        "fair.followedArtistArtworks.edges.artwork.id": (v6/*: any*/),
        "fair.followedArtistArtworks.edges.artwork.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "fair.followedArtistArtworks.edges.artwork.image.imageURL": (v5/*: any*/),
        "fair.followedArtistArtworks.edges.artwork.internalID": (v6/*: any*/),
        "fair.followedArtistArtworks.edges.artwork.saleMessage": (v5/*: any*/),
        "fair.followedArtistArtworks.edges.artwork.slug": (v6/*: any*/),
        "fair.followedArtistArtworks.id": (v6/*: any*/),
        "fair.id": (v6/*: any*/),
        "fair.internalID": (v6/*: any*/),
        "fair.slug": (v6/*: any*/)
      }
    },
    "name": "FairFollowedArtistsRailTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '2063a2cf6c405bbbe06fc94476fc9f67';
export default node;

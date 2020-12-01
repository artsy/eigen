/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 0830c66cbfb8a52a2d77c54fe9ca03c6 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistShows2TestsQueryVariables = {
    artistID: string;
};
export type ArtistShows2TestsQueryResponse = {
    readonly artist: {
        readonly slug: string;
        readonly " $fragmentRefs": FragmentRefs<"ArtistShows2_artist">;
    } | null;
};
export type ArtistShows2TestsQuery = {
    readonly response: ArtistShows2TestsQueryResponse;
    readonly variables: ArtistShows2TestsQueryVariables;
};



/*
query ArtistShows2TestsQuery(
  $artistID: String!
) {
  artist(id: $artistID) {
    slug
    ...ArtistShows2_artist_2RVLr2
    id
  }
}

fragment ArtistShow_show on Show {
  slug
  href
  is_fair_booth: isFairBooth
  cover_image: coverImage {
    url(version: "large")
  }
  ...Metadata_show
}

fragment ArtistShows2_artist_2RVLr2 on Artist {
  slug
  name
  pastShows: showsConnection(status: "closed", first: 10) {
    edges {
      node {
        id
        ...ArtistShow_show
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment Metadata_show on Show {
  kind
  name
  exhibition_period: exhibitionPeriod
  status_update: statusUpdate
  status
  partner {
    __typename
    ... on Partner {
      name
    }
    ... on ExternalPartner {
      name
      id
    }
    ... on Node {
      __isNode: __typename
      id
    }
  }
  location {
    city
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "artistID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artistID"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  {
    "kind": "Literal",
    "name": "status",
    "value": "closed"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v7 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v8 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v9 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistShows2TestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "args": [
              {
                "kind": "Variable",
                "name": "artistID",
                "variableName": "artistID"
              }
            ],
            "kind": "FragmentSpread",
            "name": "ArtistShows2_artist"
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
    "name": "ArtistShows2TestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": "pastShows",
            "args": (v4/*: any*/),
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ShowEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Show",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "href",
                        "storageKey": null
                      },
                      {
                        "alias": "is_fair_booth",
                        "args": null,
                        "kind": "ScalarField",
                        "name": "isFairBooth",
                        "storageKey": null
                      },
                      {
                        "alias": "cover_image",
                        "args": null,
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "coverImage",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "large"
                              }
                            ],
                            "kind": "ScalarField",
                            "name": "url",
                            "storageKey": "url(version:\"large\")"
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "kind",
                        "storageKey": null
                      },
                      (v3/*: any*/),
                      {
                        "alias": "exhibition_period",
                        "args": null,
                        "kind": "ScalarField",
                        "name": "exhibitionPeriod",
                        "storageKey": null
                      },
                      {
                        "alias": "status_update",
                        "args": null,
                        "kind": "ScalarField",
                        "name": "statusUpdate",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "status",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "partner",
                        "plural": false,
                        "selections": [
                          (v6/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v3/*: any*/)
                            ],
                            "type": "Partner",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v3/*: any*/),
                              (v5/*: any*/)
                            ],
                            "type": "ExternalPartner",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v5/*: any*/)
                            ],
                            "type": "Node",
                            "abstractKey": "__isNode"
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Location",
                        "kind": "LinkedField",
                        "name": "location",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "city",
                            "storageKey": null
                          },
                          (v5/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v6/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "PageInfo",
                "kind": "LinkedField",
                "name": "pageInfo",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endCursor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hasNextPage",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "showsConnection(first:10,status:\"closed\")"
          },
          {
            "alias": "pastShows",
            "args": (v4/*: any*/),
            "filters": [
              "status"
            ],
            "handle": "connection",
            "key": "ArtistShows2_pastShows",
            "kind": "LinkedHandle",
            "name": "showsConnection"
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "0830c66cbfb8a52a2d77c54fe9ca03c6",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artist": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artist"
        },
        "artist.id": (v7/*: any*/),
        "artist.name": (v8/*: any*/),
        "artist.pastShows": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ShowConnection"
        },
        "artist.pastShows.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ShowEdge"
        },
        "artist.pastShows.edges.cursor": (v9/*: any*/),
        "artist.pastShows.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Show"
        },
        "artist.pastShows.edges.node.__typename": (v9/*: any*/),
        "artist.pastShows.edges.node.cover_image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "artist.pastShows.edges.node.cover_image.url": (v8/*: any*/),
        "artist.pastShows.edges.node.exhibition_period": (v8/*: any*/),
        "artist.pastShows.edges.node.href": (v8/*: any*/),
        "artist.pastShows.edges.node.id": (v7/*: any*/),
        "artist.pastShows.edges.node.is_fair_booth": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Boolean"
        },
        "artist.pastShows.edges.node.kind": (v8/*: any*/),
        "artist.pastShows.edges.node.location": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Location"
        },
        "artist.pastShows.edges.node.location.city": (v8/*: any*/),
        "artist.pastShows.edges.node.location.id": (v7/*: any*/),
        "artist.pastShows.edges.node.name": (v8/*: any*/),
        "artist.pastShows.edges.node.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "PartnerTypes"
        },
        "artist.pastShows.edges.node.partner.__isNode": (v9/*: any*/),
        "artist.pastShows.edges.node.partner.__typename": (v9/*: any*/),
        "artist.pastShows.edges.node.partner.id": (v7/*: any*/),
        "artist.pastShows.edges.node.partner.name": (v8/*: any*/),
        "artist.pastShows.edges.node.slug": (v7/*: any*/),
        "artist.pastShows.edges.node.status": (v8/*: any*/),
        "artist.pastShows.edges.node.status_update": (v8/*: any*/),
        "artist.pastShows.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "artist.pastShows.pageInfo.endCursor": (v8/*: any*/),
        "artist.pastShows.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "artist.slug": (v7/*: any*/)
      }
    },
    "name": "ArtistShows2TestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'fd36237c026d46005acab44240ff4b81';
export default node;

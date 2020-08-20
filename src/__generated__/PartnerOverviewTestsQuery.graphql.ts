/* tslint:disable */
/* eslint-disable */
/* @relayHash e2bad6e831817d01cc268b0e4cd4f76d */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PartnerOverviewTestsQueryVariables = {};
export type PartnerOverviewTestsQueryResponse = {
    readonly partner: {
        readonly " $fragmentRefs": FragmentRefs<"PartnerOverview_partner">;
    } | null;
};
export type PartnerOverviewTestsQueryRawResponse = {
    readonly partner: ({
        readonly internalID: string;
        readonly name: string | null;
        readonly cities: ReadonlyArray<string | null> | null;
        readonly profile: ({
            readonly bio: string | null;
            readonly id: string | null;
        }) | null;
        readonly artists: ({
            readonly pageInfo: {
                readonly hasNextPage: boolean;
                readonly startCursor: string | null;
                readonly endCursor: string | null;
            };
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly internalID: string;
                    readonly slug: string;
                    readonly name: string | null;
                    readonly initials: string | null;
                    readonly href: string | null;
                    readonly is_followed: boolean | null;
                    readonly nationality: string | null;
                    readonly birthday: string | null;
                    readonly deathday: string | null;
                    readonly image: ({
                        readonly url: string | null;
                    }) | null;
                    readonly counts: ({
                        readonly artworks: number | null;
                    }) | null;
                    readonly __typename: "Artist";
                }) | null;
                readonly cursor: string;
                readonly id: string | null;
            }) | null> | null;
        }) | null;
        readonly slug: string;
        readonly locations: ({
            readonly totalCount: number | null;
        }) | null;
        readonly id: string | null;
    }) | null;
};
export type PartnerOverviewTestsQuery = {
    readonly response: PartnerOverviewTestsQueryResponse;
    readonly variables: PartnerOverviewTestsQueryVariables;
    readonly rawResponse: PartnerOverviewTestsQueryRawResponse;
};



/*
query PartnerOverviewTestsQuery {
  partner(id: "gagosian") {
    ...PartnerOverview_partner
    id
  }
}

fragment ArtistListItem_artist on Artist {
  id
  internalID
  slug
  name
  initials
  href
  is_followed: isFollowed
  nationality
  birthday
  deathday
  image {
    url
  }
}

fragment PartnerLocationSection_partner on Partner {
  slug
  name
  cities
  locations: locationsConnection(first: 0) {
    totalCount
  }
}

fragment PartnerOverview_partner on Partner {
  internalID
  name
  cities
  profile {
    bio
    id
  }
  artists: artistsConnection(sort: SORTABLE_ID_ASC, first: 10) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        ...ArtistListItem_artist
        counts {
          artworks
        }
        __typename
      }
      cursor
      id
    }
  }
  ...PartnerLocationSection_partner
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "gagosian"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
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
    "name": "sort",
    "value": "SORTABLE_ID_ASC"
  }
],
v5 = {
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
    "name": "PartnerOverviewTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "partner",
        "storageKey": "partner(id:\"gagosian\")",
        "args": (v0/*: any*/),
        "concreteType": "Partner",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "PartnerOverview_partner",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "PartnerOverviewTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "partner",
        "storageKey": "partner(id:\"gagosian\")",
        "args": (v0/*: any*/),
        "concreteType": "Partner",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "cities",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "profile",
            "storageKey": null,
            "args": null,
            "concreteType": "Profile",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "bio",
                "args": null,
                "storageKey": null
              },
              (v3/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "artists",
            "name": "artistsConnection",
            "storageKey": "artistsConnection(first:10,sort:\"SORTABLE_ID_ASC\")",
            "args": (v4/*: any*/),
            "concreteType": "ArtistPartnerConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "pageInfo",
                "storageKey": null,
                "args": null,
                "concreteType": "PageInfo",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "hasNextPage",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "startCursor",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "endCursor",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtistPartnerEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Artist",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      (v1/*: any*/),
                      (v5/*: any*/),
                      (v2/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "initials",
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
                        "kind": "ScalarField",
                        "alias": "is_followed",
                        "name": "isFollowed",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "nationality",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "birthday",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "deathday",
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
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "counts",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "ArtistCounts",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "artworks",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "__typename",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "cursor",
                    "args": null,
                    "storageKey": null
                  },
                  (v3/*: any*/)
                ]
              }
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": "artists",
            "name": "artistsConnection",
            "args": (v4/*: any*/),
            "handle": "connection",
            "key": "Partner_artists",
            "filters": [
              "sort"
            ]
          },
          (v5/*: any*/),
          {
            "kind": "LinkedField",
            "alias": "locations",
            "name": "locationsConnection",
            "storageKey": "locationsConnection(first:0)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 0
              }
            ],
            "concreteType": "LocationConnection",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "totalCount",
                "args": null,
                "storageKey": null
              }
            ]
          },
          (v3/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "PartnerOverviewTestsQuery",
    "id": "96f92618f749eb7dd57038ad3cf202f8",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '9d7ba1102dd3bf9fc758cb46ae6e9cb4';
export default node;

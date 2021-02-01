/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash f74e751f1133e0bae82eada52ee7a7f8 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type GlobalMapTestsQueryVariables = {
    citySlug: string;
    maxInt: number;
};
export type GlobalMapTestsQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"GlobalMap_viewer">;
};
export type GlobalMapTestsQueryRawResponse = {
    readonly city: ({
        readonly name: string;
        readonly slug: string;
        readonly coordinates: ({
            readonly lat: number | null;
            readonly lng: number | null;
        }) | null;
        readonly sponsoredContent: ({
            readonly introText: string | null;
            readonly artGuideUrl: string | null;
            readonly featuredShows: ReadonlyArray<({
                readonly slug: string;
                readonly internalID: string;
                readonly id: string;
                readonly name: string | null;
                readonly status: string | null;
                readonly isStubShow: boolean | null;
                readonly href: string | null;
                readonly is_followed: boolean | null;
                readonly exhibition_period: string | null;
                readonly cover_image: ({
                    readonly url: string | null;
                }) | null;
                readonly location: ({
                    readonly coordinates: ({
                        readonly lat: number | null;
                        readonly lng: number | null;
                    }) | null;
                    readonly id: string;
                }) | null;
                readonly type: string | null;
                readonly start_at: string | null;
                readonly end_at: string | null;
                readonly partner: ({
                    readonly __typename: "Partner";
                    readonly __isNode: "Partner";
                    readonly id: string;
                    readonly name: string | null;
                    readonly type: string | null;
                } | {
                    readonly __typename: "ExternalPartner";
                    readonly __isNode: "ExternalPartner";
                    readonly id: string;
                } | {
                    readonly __typename: string;
                    readonly __isNode: string;
                    readonly id: string;
                }) | null;
            }) | null> | null;
            readonly shows: ({
                readonly totalCount: number | null;
            }) | null;
        }) | null;
        readonly upcomingShows: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly slug: string;
                    readonly internalID: string;
                    readonly id: string;
                    readonly isStubShow: boolean | null;
                    readonly name: string | null;
                    readonly status: string | null;
                    readonly href: string | null;
                    readonly is_followed: boolean | null;
                    readonly exhibition_period: string | null;
                    readonly cover_image: ({
                        readonly url: string | null;
                    }) | null;
                    readonly location: ({
                        readonly coordinates: ({
                            readonly lat: number | null;
                            readonly lng: number | null;
                        }) | null;
                        readonly id: string;
                    }) | null;
                    readonly type: string | null;
                    readonly start_at: string | null;
                    readonly end_at: string | null;
                    readonly partner: ({
                        readonly __typename: "Partner";
                        readonly __isNode: "Partner";
                        readonly id: string;
                        readonly name: string | null;
                        readonly type: string | null;
                        readonly profile: ({
                            readonly image: ({
                                readonly url: string | null;
                            }) | null;
                            readonly id: string;
                        }) | null;
                    } | {
                        readonly __typename: "ExternalPartner";
                        readonly __isNode: "ExternalPartner";
                        readonly id: string;
                    } | {
                        readonly __typename: string;
                        readonly __isNode: string;
                        readonly id: string;
                    }) | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly shows: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly slug: string;
                    readonly internalID: string;
                    readonly id: string;
                    readonly isStubShow: boolean | null;
                    readonly name: string | null;
                    readonly status: string | null;
                    readonly href: string | null;
                    readonly is_followed: boolean | null;
                    readonly exhibition_period: string | null;
                    readonly cover_image: ({
                        readonly url: string | null;
                    }) | null;
                    readonly location: ({
                        readonly coordinates: ({
                            readonly lat: number | null;
                            readonly lng: number | null;
                        }) | null;
                        readonly id: string;
                    }) | null;
                    readonly type: string | null;
                    readonly start_at: string | null;
                    readonly end_at: string | null;
                    readonly partner: ({
                        readonly __typename: "Partner";
                        readonly __isNode: "Partner";
                        readonly id: string;
                        readonly name: string | null;
                        readonly type: string | null;
                        readonly profile: ({
                            readonly image: ({
                                readonly url: string | null;
                            }) | null;
                            readonly id: string;
                        }) | null;
                    } | {
                        readonly __typename: "ExternalPartner";
                        readonly __isNode: "ExternalPartner";
                        readonly id: string;
                    } | {
                        readonly __typename: string;
                        readonly __isNode: string;
                        readonly id: string;
                    }) | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly fairs: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly slug: string;
                    readonly name: string | null;
                    readonly exhibition_period: string | null;
                    readonly counts: ({
                        readonly partners: number | null;
                    }) | null;
                    readonly location: ({
                        readonly coordinates: ({
                            readonly lat: number | null;
                            readonly lng: number | null;
                        }) | null;
                        readonly id: string;
                    }) | null;
                    readonly image: ({
                        readonly image_url: string | null;
                        readonly aspect_ratio: number;
                        readonly url: string | null;
                    }) | null;
                    readonly profile: ({
                        readonly icon: ({
                            readonly internalID: string | null;
                            readonly href: string | null;
                            readonly height: number | null;
                            readonly width: number | null;
                            readonly url: string | null;
                        }) | null;
                        readonly id: string;
                        readonly slug: string;
                        readonly name: string | null;
                    }) | null;
                    readonly start_at: string | null;
                    readonly end_at: string | null;
                }) | null;
            }) | null> | null;
        }) | null;
    }) | null;
};
export type GlobalMapTestsQuery = {
    readonly response: GlobalMapTestsQueryResponse;
    readonly variables: GlobalMapTestsQueryVariables;
    readonly rawResponse: GlobalMapTestsQueryRawResponse;
};



/*
query GlobalMapTestsQuery(
  $citySlug: String!
  $maxInt: Int!
) {
  ...GlobalMap_viewer_3La17j
}

fragment GlobalMap_viewer_3La17j on Query {
  city(slug: $citySlug) {
    name
    slug
    coordinates {
      lat
      lng
    }
    sponsoredContent {
      introText
      artGuideUrl
      featuredShows {
        slug
        internalID
        id
        name
        status
        isStubShow
        href
        is_followed: isFollowed
        exhibition_period: exhibitionPeriod
        cover_image: coverImage {
          url
        }
        location {
          coordinates {
            lat
            lng
          }
          id
        }
        type
        start_at: startAt
        end_at: endAt
        partner {
          __typename
          ... on Partner {
            name
            type
          }
          ... on Node {
            __isNode: __typename
            id
          }
          ... on ExternalPartner {
            id
          }
        }
      }
      shows: showsConnection(first: 1, sort: START_AT_ASC) {
        totalCount
      }
    }
    upcomingShows: showsConnection(includeStubShows: true, status: UPCOMING, dayThreshold: 14, first: $maxInt, sort: START_AT_ASC) {
      edges {
        node {
          slug
          internalID
          id
          isStubShow
          name
          status
          href
          is_followed: isFollowed
          exhibition_period: exhibitionPeriod
          cover_image: coverImage {
            url
          }
          location {
            coordinates {
              lat
              lng
            }
            id
          }
          type
          start_at: startAt
          end_at: endAt
          partner {
            __typename
            ... on Partner {
              name
              type
              profile {
                image {
                  url(version: "square")
                }
                id
              }
            }
            ... on Node {
              __isNode: __typename
              id
            }
            ... on ExternalPartner {
              id
            }
          }
        }
      }
    }
    shows: showsConnection(includeStubShows: true, status: RUNNING, first: $maxInt, sort: PARTNER_ASC) {
      edges {
        node {
          slug
          internalID
          id
          isStubShow
          name
          status
          href
          is_followed: isFollowed
          exhibition_period: exhibitionPeriod
          cover_image: coverImage {
            url
          }
          location {
            coordinates {
              lat
              lng
            }
            id
          }
          type
          start_at: startAt
          end_at: endAt
          partner {
            __typename
            ... on Partner {
              name
              type
              profile {
                image {
                  url(version: "square")
                }
                id
              }
            }
            ... on Node {
              __isNode: __typename
              id
            }
            ... on ExternalPartner {
              id
            }
          }
        }
      }
    }
    fairs: fairsConnection(first: $maxInt, status: CURRENT, sort: START_AT_ASC) {
      edges {
        node {
          id
          slug
          name
          exhibition_period: exhibitionPeriod
          counts {
            partners
          }
          location {
            coordinates {
              lat
              lng
            }
            id
          }
          image {
            image_url: imageURL
            aspect_ratio: aspectRatio
            url
          }
          profile {
            icon {
              internalID
              href
              height
              width
              url(version: "square140")
            }
            id
            slug
            name
          }
          start_at: startAt
          end_at: endAt
        }
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "citySlug"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "maxInt"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
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
  "concreteType": "LatLng",
  "kind": "LinkedField",
  "name": "coordinates",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "lat",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "lng",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
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
  "name": "status",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isStubShow",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v9 = {
  "alias": "is_followed",
  "args": null,
  "kind": "ScalarField",
  "name": "isFollowed",
  "storageKey": null
},
v10 = {
  "alias": "exhibition_period",
  "args": null,
  "kind": "ScalarField",
  "name": "exhibitionPeriod",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v12 = {
  "alias": "cover_image",
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "coverImage",
  "plural": false,
  "selections": [
    (v11/*: any*/)
  ],
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "concreteType": "Location",
  "kind": "LinkedField",
  "name": "location",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    (v5/*: any*/)
  ],
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v15 = {
  "alias": "start_at",
  "args": null,
  "kind": "ScalarField",
  "name": "startAt",
  "storageKey": null
},
v16 = {
  "alias": "end_at",
  "args": null,
  "kind": "ScalarField",
  "name": "endAt",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v18 = [
  (v5/*: any*/)
],
v19 = {
  "kind": "InlineFragment",
  "selections": (v18/*: any*/),
  "type": "Node",
  "abstractKey": "__isNode"
},
v20 = {
  "kind": "InlineFragment",
  "selections": (v18/*: any*/),
  "type": "ExternalPartner",
  "abstractKey": null
},
v21 = {
  "kind": "Literal",
  "name": "sort",
  "value": "START_AT_ASC"
},
v22 = {
  "kind": "Variable",
  "name": "first",
  "variableName": "maxInt"
},
v23 = {
  "kind": "Literal",
  "name": "includeStubShows",
  "value": true
},
v24 = [
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
          (v2/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v7/*: any*/),
          (v1/*: any*/),
          (v6/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "partner",
            "plural": false,
            "selections": [
              (v17/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  (v1/*: any*/),
                  (v14/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Profile",
                    "kind": "LinkedField",
                    "name": "profile",
                    "plural": false,
                    "selections": [
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
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "square"
                              }
                            ],
                            "kind": "ScalarField",
                            "name": "url",
                            "storageKey": "url(version:\"square\")"
                          }
                        ],
                        "storageKey": null
                      },
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "type": "Partner",
                "abstractKey": null
              },
              (v19/*: any*/),
              (v20/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GlobalMapTestsQuery",
    "selections": [
      {
        "args": [
          {
            "kind": "Variable",
            "name": "citySlug",
            "variableName": "citySlug"
          },
          {
            "kind": "Variable",
            "name": "maxInt",
            "variableName": "maxInt"
          }
        ],
        "kind": "FragmentSpread",
        "name": "GlobalMap_viewer"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GlobalMapTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "slug",
            "variableName": "citySlug"
          }
        ],
        "concreteType": "City",
        "kind": "LinkedField",
        "name": "city",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "CitySponsoredContent",
            "kind": "LinkedField",
            "name": "sponsoredContent",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "introText",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "artGuideUrl",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Show",
                "kind": "LinkedField",
                "name": "featuredShows",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v1/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "partner",
                    "plural": false,
                    "selections": [
                      (v17/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v1/*: any*/),
                          (v14/*: any*/)
                        ],
                        "type": "Partner",
                        "abstractKey": null
                      },
                      (v19/*: any*/),
                      (v20/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": "shows",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 1
                  },
                  (v21/*: any*/)
                ],
                "concreteType": "ShowConnection",
                "kind": "LinkedField",
                "name": "showsConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "totalCount",
                    "storageKey": null
                  }
                ],
                "storageKey": "showsConnection(first:1,sort:\"START_AT_ASC\")"
              }
            ],
            "storageKey": null
          },
          {
            "alias": "upcomingShows",
            "args": [
              {
                "kind": "Literal",
                "name": "dayThreshold",
                "value": 14
              },
              (v22/*: any*/),
              (v23/*: any*/),
              (v21/*: any*/),
              {
                "kind": "Literal",
                "name": "status",
                "value": "UPCOMING"
              }
            ],
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": (v24/*: any*/),
            "storageKey": null
          },
          {
            "alias": "shows",
            "args": [
              (v22/*: any*/),
              (v23/*: any*/),
              {
                "kind": "Literal",
                "name": "sort",
                "value": "PARTNER_ASC"
              },
              {
                "kind": "Literal",
                "name": "status",
                "value": "RUNNING"
              }
            ],
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": (v24/*: any*/),
            "storageKey": null
          },
          {
            "alias": "fairs",
            "args": [
              (v22/*: any*/),
              (v21/*: any*/),
              {
                "kind": "Literal",
                "name": "status",
                "value": "CURRENT"
              }
            ],
            "concreteType": "FairConnection",
            "kind": "LinkedField",
            "name": "fairsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "FairEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Fair",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v2/*: any*/),
                      (v1/*: any*/),
                      (v10/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "FairCounts",
                        "kind": "LinkedField",
                        "name": "counts",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "partners",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v13/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "image",
                        "plural": false,
                        "selections": [
                          {
                            "alias": "image_url",
                            "args": null,
                            "kind": "ScalarField",
                            "name": "imageURL",
                            "storageKey": null
                          },
                          {
                            "alias": "aspect_ratio",
                            "args": null,
                            "kind": "ScalarField",
                            "name": "aspectRatio",
                            "storageKey": null
                          },
                          (v11/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Profile",
                        "kind": "LinkedField",
                        "name": "profile",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "icon",
                            "plural": false,
                            "selections": [
                              (v4/*: any*/),
                              (v8/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "height",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "width",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "version",
                                    "value": "square140"
                                  }
                                ],
                                "kind": "ScalarField",
                                "name": "url",
                                "storageKey": "url(version:\"square140\")"
                              }
                            ],
                            "storageKey": null
                          },
                          (v5/*: any*/),
                          (v2/*: any*/),
                          (v1/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v15/*: any*/),
                      (v16/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "f74e751f1133e0bae82eada52ee7a7f8",
    "metadata": {},
    "name": "GlobalMapTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '83ca51c960b55edc1c07be5db3197bd4';
export default node;

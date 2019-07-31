/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { GlobalMap_viewer$ref } from "./GlobalMap_viewer.graphql";
export type MapRendererQueryVariables = {
    readonly citySlug: string;
    readonly maxInt: number;
};
export type MapRendererQueryResponse = {
    readonly viewer: {
        readonly " $fragmentRefs": GlobalMap_viewer$ref;
    } | null;
};
export type MapRendererQuery = {
    readonly response: MapRendererQueryResponse;
    readonly variables: MapRendererQueryVariables;
};



/*
query MapRendererQuery(
  $citySlug: String!
  $maxInt: Int!
) {
  viewer {
    ...GlobalMap_viewer_3La17j
  }
}

fragment GlobalMap_viewer_3La17j on Viewer {
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
            id
          }
          ... on ExternalPartner {
            id
          }
        }
      }
      shows(first: 1, sort: START_AT_ASC) {
        totalCount
      }
    }
    upcomingShows: shows(includeStubShows: true, status: UPCOMING, dayThreshold: 14, first: $maxInt, sort: START_AT_ASC) {
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
              id
            }
            ... on ExternalPartner {
              id
            }
          }
        }
      }
    }
    shows(includeStubShows: true, status: RUNNING, first: $maxInt, sort: PARTNER_ASC) {
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
              id
            }
            ... on ExternalPartner {
              id
            }
          }
        }
      }
    }
    fairs(first: $maxInt, status: CURRENT, sort: START_AT_ASC) {
      edges {
        node {
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
          id
        }
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "citySlug",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "maxInt",
    "type": "Int!",
    "defaultValue": null
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "coordinates",
  "storageKey": null,
  "args": null,
  "concreteType": "LatLng",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "lat",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "lng",
      "args": null,
      "storageKey": null
    }
  ]
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "status",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isStubShow",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": "is_followed",
  "name": "isFollowed",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": "exhibition_period",
  "name": "exhibitionPeriod",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "LinkedField",
  "alias": "cover_image",
  "name": "coverImage",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": [
    (v11/*: any*/)
  ]
},
v13 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "location",
  "storageKey": null,
  "args": null,
  "concreteType": "Location",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    (v5/*: any*/)
  ]
},
v14 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "type",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": "start_at",
  "name": "startAt",
  "args": null,
  "storageKey": null
},
v16 = {
  "kind": "ScalarField",
  "alias": "end_at",
  "name": "endAt",
  "args": null,
  "storageKey": null
},
v17 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v18 = {
  "kind": "Literal",
  "name": "sort",
  "value": "START_AT_ASC"
},
v19 = {
  "kind": "Variable",
  "name": "first",
  "variableName": "maxInt"
},
v20 = {
  "kind": "Literal",
  "name": "includeStubShows",
  "value": true
},
v21 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "edges",
    "storageKey": null,
    "args": null,
    "concreteType": "ShowEdge",
    "plural": true,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": null,
        "concreteType": "Show",
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
            "kind": "LinkedField",
            "alias": null,
            "name": "partner",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [
              (v17/*: any*/),
              (v5/*: any*/),
              {
                "kind": "InlineFragment",
                "type": "Partner",
                "selections": [
                  (v1/*: any*/),
                  (v14/*: any*/),
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
                                "value": "square"
                              }
                            ],
                            "storageKey": "url(version:\"square\")"
                          }
                        ]
                      },
                      (v5/*: any*/)
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MapRendererQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "GlobalMap_viewer",
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
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MapRendererQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "city",
            "storageKey": null,
            "args": [
              {
                "kind": "Variable",
                "name": "slug",
                "variableName": "citySlug"
              }
            ],
            "concreteType": "City",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "sponsoredContent",
                "storageKey": null,
                "args": null,
                "concreteType": "CitySponsoredContent",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "introText",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "artGuideUrl",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "featuredShows",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Show",
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
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": null,
                        "plural": false,
                        "selections": [
                          (v17/*: any*/),
                          (v5/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "type": "Partner",
                            "selections": [
                              (v1/*: any*/),
                              (v14/*: any*/)
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "shows",
                    "storageKey": "shows(first:1,sort:\"START_AT_ASC\")",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 1
                      },
                      (v18/*: any*/)
                    ],
                    "concreteType": "ShowConnection",
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
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": "upcomingShows",
                "name": "shows",
                "storageKey": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "dayThreshold",
                    "value": 14
                  },
                  (v19/*: any*/),
                  (v20/*: any*/),
                  (v18/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "status",
                    "value": "UPCOMING"
                  }
                ],
                "concreteType": "ShowConnection",
                "plural": false,
                "selections": (v21/*: any*/)
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "shows",
                "storageKey": null,
                "args": [
                  (v19/*: any*/),
                  (v20/*: any*/),
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
                "plural": false,
                "selections": (v21/*: any*/)
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "fairs",
                "storageKey": null,
                "args": [
                  (v19/*: any*/),
                  (v18/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "status",
                    "value": "CURRENT"
                  }
                ],
                "concreteType": "FairConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "FairEdge",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Fair",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v1/*: any*/),
                          (v10/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "counts",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "FairCounts",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "partners",
                                "args": null,
                                "storageKey": null
                              }
                            ]
                          },
                          (v13/*: any*/),
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
                                "alias": "image_url",
                                "name": "imageURL",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": "aspect_ratio",
                                "name": "aspectRatio",
                                "args": null,
                                "storageKey": null
                              },
                              (v11/*: any*/)
                            ]
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
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "icon",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "Image",
                                "plural": false,
                                "selections": [
                                  (v4/*: any*/),
                                  (v8/*: any*/),
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "height",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "width",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "url",
                                    "args": [
                                      {
                                        "kind": "Literal",
                                        "name": "version",
                                        "value": "square140"
                                      }
                                    ],
                                    "storageKey": "url(version:\"square140\")"
                                  }
                                ]
                              },
                              (v5/*: any*/),
                              (v2/*: any*/),
                              (v1/*: any*/)
                            ]
                          },
                          (v15/*: any*/),
                          (v16/*: any*/),
                          (v5/*: any*/)
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MapRendererQuery",
    "id": "bebd00987187a8cecce02099bcee017b",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'd8abf81e6b44d92e592c67cc9b8161c8';
export default node;

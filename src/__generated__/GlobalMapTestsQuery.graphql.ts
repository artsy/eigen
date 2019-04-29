/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { GlobalMap_viewer$ref } from "./GlobalMap_viewer.graphql";
export type GlobalMapTestsQueryVariables = {
    readonly citySlug: string;
    readonly maxInt: number;
};
export type GlobalMapTestsQueryResponse = {
    readonly viewer: ({
        readonly " $fragmentRefs": GlobalMap_viewer$ref;
    }) | null;
};
export type GlobalMapTestsQuery = {
    readonly response: GlobalMapTestsQueryResponse;
    readonly variables: GlobalMapTestsQueryVariables;
};



/*
query GlobalMapTestsQuery(
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
        gravityID
        internalID
        id
        name
        status
        isStubShow
        href
        is_followed
        exhibition_period
        cover_image {
          url
        }
        location {
          coordinates {
            lat
            lng
          }
          __id: id
        }
        type
        start_at
        end_at
        partner {
          __typename
          ... on Partner {
            name
            type
          }
          ... on Node {
            __id: id
          }
          ... on ExternalPartner {
            __id: id
          }
        }
        __id: id
      }
      shows(first: 1, sort: START_AT_ASC) {
        totalCount
      }
    }
    upcomingShows: shows(includeStubShows: true, status: UPCOMING, dayThreshold: 14, first: $maxInt, sort: START_AT_ASC) {
      edges {
        node {
          gravityID
          internalID
          id
          isStubShow
          name
          status
          href
          is_followed
          exhibition_period
          cover_image {
            url
          }
          location {
            coordinates {
              lat
              lng
            }
            __id: id
          }
          type
          start_at
          end_at
          partner {
            __typename
            ... on Partner {
              name
              type
              profile {
                image {
                  url(version: "square")
                }
                __id: id
              }
            }
            ... on Node {
              __id: id
            }
            ... on ExternalPartner {
              __id: id
            }
          }
          __id: id
        }
      }
    }
    shows(includeStubShows: true, status: RUNNING, first: $maxInt, sort: PARTNER_ASC) {
      edges {
        node {
          gravityID
          internalID
          id
          isStubShow
          name
          status
          href
          is_followed
          exhibition_period
          cover_image {
            url
          }
          location {
            coordinates {
              lat
              lng
            }
            __id: id
          }
          type
          start_at
          end_at
          partner {
            __typename
            ... on Partner {
              name
              type
              profile {
                image {
                  url(version: "square")
                }
                __id: id
              }
            }
            ... on Node {
              __id: id
            }
            ... on ExternalPartner {
              __id: id
            }
          }
          __id: id
        }
      }
    }
    fairs(first: $maxInt, status: CURRENT, sort: START_AT_ASC) {
      edges {
        node {
          gravityID
          name
          exhibition_period
          counts {
            partners
          }
          location {
            coordinates {
              lat
              lng
            }
            __id: id
          }
          image {
            image_url
            aspect_ratio
            url
          }
          profile {
            icon {
              gravityID
              href
              height
              width
              url(version: "square140")
            }
            id
            gravityID
            name
            __id: id
          }
          start_at
          end_at
          __id: id
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
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "exhibition_period",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
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
  "alias": null,
  "name": "is_followed",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
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
  "alias": null,
  "name": "cover_image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": [
    v11
  ]
},
v13 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
},
v14 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "location",
  "storageKey": null,
  "args": null,
  "concreteType": "Location",
  "plural": false,
  "selections": [
    v2,
    v13
  ]
},
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "type",
  "args": null,
  "storageKey": null
},
v16 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "start_at",
  "args": null,
  "storageKey": null
},
v17 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "end_at",
  "args": null,
  "storageKey": null
},
v18 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v19 = {
  "kind": "Literal",
  "name": "sort",
  "value": "START_AT_ASC",
  "type": "PartnerShowSorts"
},
v20 = {
  "kind": "Variable",
  "name": "first",
  "variableName": "maxInt",
  "type": "Int"
},
v21 = {
  "kind": "Literal",
  "name": "includeStubShows",
  "value": true,
  "type": "Boolean"
},
v22 = [
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
          v3,
          v4,
          v5,
          v7,
          v1,
          v6,
          v8,
          v9,
          v10,
          v12,
          v14,
          v15,
          v16,
          v17,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "partner",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [
              v18,
              v13,
              {
                "kind": "InlineFragment",
                "type": "Partner",
                "selections": [
                  v1,
                  v15,
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
                                "value": "square",
                                "type": "[String]"
                              }
                            ],
                            "storageKey": "url(version:\"square\")"
                          }
                        ]
                      },
                      v13
                    ]
                  }
                ]
              }
            ]
          },
          v13
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "GlobalMapTestsQuery",
  "id": null,
  "text": "query GlobalMapTestsQuery(\n  $citySlug: String!\n  $maxInt: Int!\n) {\n  viewer {\n    ...GlobalMap_viewer_3La17j\n  }\n}\n\nfragment GlobalMap_viewer_3La17j on Viewer {\n  city(slug: $citySlug) {\n    name\n    slug\n    coordinates {\n      lat\n      lng\n    }\n    sponsoredContent {\n      introText\n      artGuideUrl\n      featuredShows {\n        gravityID\n        internalID\n        id\n        name\n        status\n        isStubShow\n        href\n        is_followed\n        exhibition_period\n        cover_image {\n          url\n        }\n        location {\n          coordinates {\n            lat\n            lng\n          }\n          __id: id\n        }\n        type\n        start_at\n        end_at\n        partner {\n          __typename\n          ... on Partner {\n            name\n            type\n          }\n          ... on Node {\n            __id: id\n          }\n          ... on ExternalPartner {\n            __id: id\n          }\n        }\n        __id: id\n      }\n      shows(first: 1, sort: START_AT_ASC) {\n        totalCount\n      }\n    }\n    upcomingShows: shows(includeStubShows: true, status: UPCOMING, dayThreshold: 14, first: $maxInt, sort: START_AT_ASC) {\n      edges {\n        node {\n          gravityID\n          internalID\n          id\n          isStubShow\n          name\n          status\n          href\n          is_followed\n          exhibition_period\n          cover_image {\n            url\n          }\n          location {\n            coordinates {\n              lat\n              lng\n            }\n            __id: id\n          }\n          type\n          start_at\n          end_at\n          partner {\n            __typename\n            ... on Partner {\n              name\n              type\n              profile {\n                image {\n                  url(version: \"square\")\n                }\n                __id: id\n              }\n            }\n            ... on Node {\n              __id: id\n            }\n            ... on ExternalPartner {\n              __id: id\n            }\n          }\n          __id: id\n        }\n      }\n    }\n    shows(includeStubShows: true, status: RUNNING, first: $maxInt, sort: PARTNER_ASC) {\n      edges {\n        node {\n          gravityID\n          internalID\n          id\n          isStubShow\n          name\n          status\n          href\n          is_followed\n          exhibition_period\n          cover_image {\n            url\n          }\n          location {\n            coordinates {\n              lat\n              lng\n            }\n            __id: id\n          }\n          type\n          start_at\n          end_at\n          partner {\n            __typename\n            ... on Partner {\n              name\n              type\n              profile {\n                image {\n                  url(version: \"square\")\n                }\n                __id: id\n              }\n            }\n            ... on Node {\n              __id: id\n            }\n            ... on ExternalPartner {\n              __id: id\n            }\n          }\n          __id: id\n        }\n      }\n    }\n    fairs(first: $maxInt, status: CURRENT, sort: START_AT_ASC) {\n      edges {\n        node {\n          gravityID\n          name\n          exhibition_period\n          counts {\n            partners\n          }\n          location {\n            coordinates {\n              lat\n              lng\n            }\n            __id: id\n          }\n          image {\n            image_url\n            aspect_ratio\n            url\n          }\n          profile {\n            icon {\n              gravityID\n              href\n              height\n              width\n              url(version: \"square140\")\n            }\n            id\n            gravityID\n            name\n            __id: id\n          }\n          start_at\n          end_at\n          __id: id\n        }\n      }\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "GlobalMapTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "viewer",
        "name": "__viewer_viewer",
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
                "variableName": "citySlug",
                "type": null
              },
              {
                "kind": "Variable",
                "name": "maxInt",
                "variableName": "maxInt",
                "type": null
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "GlobalMapTestsQuery",
    "argumentDefinitions": v0,
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
                "variableName": "citySlug",
                "type": "String"
              }
            ],
            "concreteType": "City",
            "plural": false,
            "selections": [
              v1,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "slug",
                "args": null,
                "storageKey": null
              },
              v2,
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
                      v3,
                      v4,
                      v5,
                      v1,
                      v6,
                      v7,
                      v8,
                      v9,
                      v10,
                      v12,
                      v14,
                      v15,
                      v16,
                      v17,
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": null,
                        "plural": false,
                        "selections": [
                          v18,
                          v13,
                          {
                            "kind": "InlineFragment",
                            "type": "Partner",
                            "selections": [
                              v1,
                              v15
                            ]
                          }
                        ]
                      },
                      v13
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
                        "value": 1,
                        "type": "Int"
                      },
                      v19
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
                    "value": 14,
                    "type": "Int"
                  },
                  v20,
                  v21,
                  v19,
                  {
                    "kind": "Literal",
                    "name": "status",
                    "value": "UPCOMING",
                    "type": "EventStatus"
                  }
                ],
                "concreteType": "ShowConnection",
                "plural": false,
                "selections": v22
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "shows",
                "storageKey": null,
                "args": [
                  v20,
                  v21,
                  {
                    "kind": "Literal",
                    "name": "sort",
                    "value": "PARTNER_ASC",
                    "type": "PartnerShowSorts"
                  },
                  {
                    "kind": "Literal",
                    "name": "status",
                    "value": "RUNNING",
                    "type": "EventStatus"
                  }
                ],
                "concreteType": "ShowConnection",
                "plural": false,
                "selections": v22
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "fairs",
                "storageKey": null,
                "args": [
                  v20,
                  {
                    "kind": "Literal",
                    "name": "sort",
                    "value": "START_AT_ASC",
                    "type": "FairSorts"
                  },
                  {
                    "kind": "Literal",
                    "name": "status",
                    "value": "CURRENT",
                    "type": "EventStatus"
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
                          v4,
                          v1,
                          v3,
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
                          v14,
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
                                "name": "image_url",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "aspect_ratio",
                                "args": null,
                                "storageKey": null
                              },
                              v11
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
                                  v4,
                                  v8,
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
                                        "value": "square140",
                                        "type": "[String]"
                                      }
                                    ],
                                    "storageKey": "url(version:\"square140\")"
                                  }
                                ]
                              },
                              v5,
                              v4,
                              v1,
                              v13
                            ]
                          },
                          v16,
                          v17,
                          v13
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
      {
        "kind": "LinkedHandle",
        "alias": null,
        "name": "viewer",
        "args": null,
        "handle": "viewer",
        "key": "",
        "filters": null
      }
    ]
  }
};
})();
(node as any).hash = '220e4c6d80d7a52003b0691691f43520';
export default node;

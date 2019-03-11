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
    sponsoredContent {
      introText
      artGuideUrl
      shows(first: 2, sort: START_AT_ASC) {
        totalCount
        edges {
          node {
            id
            _id
            __id
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
              __id
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
              ... on ExternalPartner {
                name
                __id
              }
              ... on Node {
                __id
              }
            }
          }
        }
      }
    }
    coordinates {
      lat
      lng
    }
    shows(includeStubShows: true, status: RUNNING, first: $maxInt, sort: START_AT_ASC) {
      edges {
        node {
          id
          _id
          __id
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
            __id
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
            ... on ExternalPartner {
              name
              __id
            }
            ... on Node {
              __id
            }
          }
        }
      }
    }
    fairs(first: $maxInt, status: CURRENT, sort: START_AT_ASC) {
      edges {
        node {
          id
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
            __id
          }
          image {
            image_url
            aspect_ratio
            url
          }
          profile {
            icon {
              id
              href
              height
              width
              url(version: "square140")
            }
            __id
            id
            name
          }
          start_at
          end_at
          __id
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
  "kind": "Literal",
  "name": "sort",
  "value": "START_AT_ASC",
  "type": "PartnerShowSorts"
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
  "name": "id",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v8 = {
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
v9 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "location",
  "storageKey": null,
  "args": null,
  "concreteType": "Location",
  "plural": false,
  "selections": [
    v8,
    v5
  ]
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "type",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "start_at",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "end_at",
  "args": null,
  "storageKey": null
},
v13 = {
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
        v1,
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "status",
          "args": null,
          "storageKey": null
        },
        v6,
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "is_followed",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "_id",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "cover_image",
          "storageKey": null,
          "args": null,
          "concreteType": "Image",
          "plural": false,
          "selections": [
            v7
          ]
        },
        v9,
        v10,
        v11,
        v12,
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "partner",
          "storageKey": null,
          "args": null,
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
            v5,
            {
              "kind": "InlineFragment",
              "type": "ExternalPartner",
              "selections": [
                v1
              ]
            },
            {
              "kind": "InlineFragment",
              "type": "Partner",
              "selections": [
                v1,
                v10
              ]
            }
          ]
        }
      ]
    }
  ]
},
v14 = {
  "kind": "Variable",
  "name": "first",
  "variableName": "maxInt",
  "type": "Int"
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "GlobalMapTestsQuery",
  "id": "aa4a3755a4e7be0c62f53f827f76336b",
  "text": null,
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
                    "name": "shows",
                    "storageKey": "shows(first:2,sort:\"START_AT_ASC\")",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 2,
                        "type": "Int"
                      },
                      v2
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
                      },
                      v13
                    ]
                  }
                ]
              },
              v8,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "shows",
                "storageKey": null,
                "args": [
                  v14,
                  {
                    "kind": "Literal",
                    "name": "includeStubShows",
                    "value": true,
                    "type": "Boolean"
                  },
                  v2,
                  {
                    "kind": "Literal",
                    "name": "status",
                    "value": "RUNNING",
                    "type": "EventStatus"
                  }
                ],
                "concreteType": "ShowConnection",
                "plural": false,
                "selections": [
                  v13
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "fairs",
                "storageKey": null,
                "args": [
                  v14,
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
                          v9,
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
                              v7
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
                                  v6,
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
                              v1
                            ]
                          },
                          v11,
                          v12,
                          v5
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

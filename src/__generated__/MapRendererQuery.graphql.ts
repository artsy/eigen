/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { GlobalMap_viewer$ref } from "./GlobalMap_viewer.graphql";
export type MapRendererQueryVariables = {
    readonly citySlug: string;
    readonly maxInt: number;
};
export type MapRendererQueryResponse = {
    readonly viewer: ({
        readonly " $fragmentRefs": GlobalMap_viewer$ref;
    }) | null;
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
    sponsoredContent {
      introText
      artGuideUrl
    }
    coordinates {
      lat
      lng
    }
    shows(includeStubShows: true, first: $maxInt, sort: START_AT_ASC) {
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
    fairs(first: $maxInt) {
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
  "kind": "Variable",
  "name": "first",
  "variableName": "maxInt",
  "type": "Int"
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "exhibition_period",
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
  "name": "__id",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
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
    v2,
    v6
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
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "MapRendererQuery",
  "id": "d12a8ae019a2b59a3f9890bf93c78ed8",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "MapRendererQuery",
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
    "name": "MapRendererQuery",
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
                  }
                ]
              },
              v2,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "shows",
                "storageKey": null,
                "args": [
                  v3,
                  {
                    "kind": "Literal",
                    "name": "includeStubShows",
                    "value": true,
                    "type": "Boolean"
                  },
                  {
                    "kind": "Literal",
                    "name": "sort",
                    "value": "START_AT_ASC",
                    "type": "PartnerShowSorts"
                  }
                ],
                "concreteType": "ShowConnection",
                "plural": false,
                "selections": [
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
                          v4,
                          v5,
                          v6,
                          v1,
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "status",
                            "args": null,
                            "storageKey": null
                          },
                          v7,
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
                              v8
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
                              v6,
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
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "fairs",
                "storageKey": null,
                "args": [
                  v3
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
                          v5,
                          v1,
                          v4,
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
                              v8
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
                                  v5,
                                  v7,
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
                              v6,
                              v5,
                              v1
                            ]
                          },
                          v11,
                          v12,
                          v6
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
(node as any).hash = 'd8abf81e6b44d92e592c67cc9b8161c8';
export default node;

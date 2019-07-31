/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { CityFairList_city$ref } from "./CityFairList_city.graphql";
export type CityFairListQueryVariables = {
    readonly count: number;
    readonly cursor?: string | null;
    readonly citySlug: string;
};
export type CityFairListQueryResponse = {
    readonly city: {
        readonly " $fragmentRefs": CityFairList_city$ref;
    } | null;
};
export type CityFairListQuery = {
    readonly response: CityFairListQueryResponse;
    readonly variables: CityFairListQueryVariables;
};



/*
query CityFairListQuery(
  $count: Int!
  $cursor: String
  $citySlug: String!
) {
  city(slug: $citySlug) {
    ...CityFairList_city_1G22uz
  }
}

fragment CityFairList_city_1G22uz on City {
  slug
  fairs(first: $count, after: $cursor, status: CURRENT, sort: START_AT_ASC) {
    edges {
      node {
        internalID
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
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "count",
    "type": "Int!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "cursor",
    "type": "String",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "citySlug",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "citySlug"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v3 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "START_AT_ASC"
  },
  {
    "kind": "Literal",
    "name": "status",
    "value": "CURRENT"
  }
],
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
  "name": "name",
  "args": null,
  "storageKey": null
},
v6 = {
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
    "name": "CityFairListQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "city",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "City",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "CityFairList_city",
            "args": [
              {
                "kind": "Variable",
                "name": "count",
                "variableName": "count"
              },
              {
                "kind": "Variable",
                "name": "cursor",
                "variableName": "cursor"
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "CityFairListQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "city",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "City",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "fairs",
            "storageKey": null,
            "args": (v3/*: any*/),
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
                      (v4/*: any*/),
                      (v5/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": "exhibition_period",
                        "name": "exhibitionPeriod",
                        "args": null,
                        "storageKey": null
                      },
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
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "location",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Location",
                        "plural": false,
                        "selections": [
                          {
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
                          (v6/*: any*/)
                        ]
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
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "href",
                                "args": null,
                                "storageKey": null
                              },
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
                          (v6/*: any*/),
                          (v2/*: any*/),
                          (v5/*: any*/)
                        ]
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "start_at",
                        "name": "startAt",
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
                      (v6/*: any*/),
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
                  }
                ]
              },
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
                    "name": "endCursor",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "hasNextPage",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "fairs",
            "args": (v3/*: any*/),
            "handle": "connection",
            "key": "CityFairList_fairs",
            "filters": [
              "status",
              "sort"
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "CityFairListQuery",
    "id": "ea06d0c80bfaf743b33da205435940e6",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '67a71dd0b56ee5d2552a6e45579f8921';
export default node;

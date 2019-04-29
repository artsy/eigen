/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { CityBMWList_city$ref } from "./CityBMWList_city.graphql";
export type QueryRenderersCityBMWListQueryVariables = {
    readonly citySlug: string;
};
export type QueryRenderersCityBMWListQueryResponse = {
    readonly city: ({
        readonly " $fragmentRefs": CityBMWList_city$ref;
    }) | null;
};
export type QueryRenderersCityBMWListQuery = {
    readonly response: QueryRenderersCityBMWListQueryResponse;
    readonly variables: QueryRenderersCityBMWListQueryVariables;
};



/*
query QueryRenderersCityBMWListQuery(
  $citySlug: String!
) {
  city(slug: $citySlug) {
    ...CityBMWList_city
  }
}

fragment CityBMWList_city on City {
  name
  slug
  sponsoredContent {
    shows(first: 20, status: RUNNING, after: "", sort: PARTNER_ASC) {
      edges {
        node {
          gravityID
          internalID
          id
          name
          status
          href
          is_followed
          isStubShow
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
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
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
    "variableName": "citySlug",
    "type": "String"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "type",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "QueryRenderersCityBMWListQuery",
  "id": null,
  "text": "query QueryRenderersCityBMWListQuery(\n  $citySlug: String!\n) {\n  city(slug: $citySlug) {\n    ...CityBMWList_city\n  }\n}\n\nfragment CityBMWList_city on City {\n  name\n  slug\n  sponsoredContent {\n    shows(first: 20, status: RUNNING, after: \"\", sort: PARTNER_ASC) {\n      edges {\n        node {\n          gravityID\n          internalID\n          id\n          name\n          status\n          href\n          is_followed\n          isStubShow\n          exhibition_period\n          cover_image {\n            url\n          }\n          location {\n            coordinates {\n              lat\n              lng\n            }\n            __id: id\n          }\n          type\n          start_at\n          end_at\n          partner {\n            __typename\n            ... on Partner {\n              name\n              type\n              profile {\n                image {\n                  url(version: \"square\")\n                }\n                __id: id\n              }\n            }\n            ... on Node {\n              __id: id\n            }\n            ... on ExternalPartner {\n              __id: id\n            }\n          }\n          __id: id\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersCityBMWListQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "city",
        "storageKey": null,
        "args": v1,
        "concreteType": "City",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "CityBMWList_city",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "QueryRenderersCityBMWListQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "city",
        "storageKey": null,
        "args": v1,
        "concreteType": "City",
        "plural": false,
        "selections": [
          v2,
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
                "kind": "LinkedField",
                "alias": null,
                "name": "shows",
                "storageKey": "shows(after:\"\",first:20,sort:\"PARTNER_ASC\",status:\"RUNNING\")",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "after",
                    "value": "",
                    "type": "String"
                  },
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 20,
                    "type": "Int"
                  },
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
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "exhibition_period",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "gravityID",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "id",
                            "args": null,
                            "storageKey": null
                          },
                          v2,
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "status",
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
                            "alias": null,
                            "name": "is_followed",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "isStubShow",
                            "args": null,
                            "storageKey": null
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
                            "name": "cover_image",
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
                              v3
                            ]
                          },
                          v4,
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "start_at",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "end_at",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "partner",
                            "storageKey": null,
                            "args": null,
                            "concreteType": null,
                            "plural": false,
                            "selections": [
                              v5,
                              v3,
                              {
                                "kind": "InlineFragment",
                                "type": "Partner",
                                "selections": [
                                  v2,
                                  v4,
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
                                      v3
                                    ]
                                  }
                                ]
                              }
                            ]
                          },
                          v3,
                          v5
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
                "name": "shows",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "after",
                    "value": "",
                    "type": "String"
                  },
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 20,
                    "type": "Int"
                  },
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
                "handle": "connection",
                "key": "CityBMWList_shows",
                "filters": [
                  "status",
                  "sort"
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = '7617b5ea5121adf4c2d8c05cc88c2828';
export default node;

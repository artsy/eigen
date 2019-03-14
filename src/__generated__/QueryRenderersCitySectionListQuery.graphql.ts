/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { CitySectionList_city$ref } from "./CitySectionList_city.graphql";
export type EventStatus = "CLOSED" | "CLOSING_SOON" | "CURRENT" | "RUNNING" | "UPCOMING" | "closed" | "current" | "running" | "upcoming" | "%future added value";
export type PartnerShowPartnerType = "GALLERY" | "MUSEUM" | "%future added value";
export type PartnerShowSorts = "CREATED_AT_ASC" | "CREATED_AT_DESC" | "END_AT_ASC" | "END_AT_DESC" | "NAME_ASC" | "NAME_DESC" | "PARTNER_ASC" | "PUBLISH_AT_ASC" | "PUBLISH_AT_DESC" | "START_AT_ASC" | "START_AT_DESC" | "created_at_asc" | "created_at_desc" | "end_at_asc" | "end_at_desc" | "name_asc" | "name_desc" | "publish_at_asc" | "publish_at_desc" | "start_at_asc" | "start_at_desc" | "%future added value";
export type QueryRenderersCitySectionListQueryVariables = {
    readonly citySlug: string;
    readonly partnerType?: PartnerShowPartnerType | null;
    readonly status?: EventStatus | null;
    readonly dayThreshold?: number | null;
    readonly sort?: PartnerShowSorts | null;
};
export type QueryRenderersCitySectionListQueryResponse = {
    readonly city: ({
        readonly " $fragmentRefs": CitySectionList_city$ref;
    }) | null;
};
export type QueryRenderersCitySectionListQuery = {
    readonly response: QueryRenderersCitySectionListQueryResponse;
    readonly variables: QueryRenderersCitySectionListQueryVariables;
};



/*
query QueryRenderersCitySectionListQuery(
  $citySlug: String!
  $partnerType: PartnerShowPartnerType
  $status: EventStatus
  $dayThreshold: Int
  $sort: PartnerShowSorts
) {
  city(slug: $citySlug) {
    ...CitySectionList_city_2xWq6T
  }
}

fragment CitySectionList_city_2xWq6T on City {
  name
  shows(includeStubShows: true, first: 20, sort: $sort, after: "", partnerType: $partnerType, status: $status, dayThreshold: $dayThreshold) {
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      node {
        id
        _id
        __id
        is_followed
        start_at
        end_at
        status
        href
        type
        name
        cover_image {
          url
        }
        exhibition_period
        partner {
          __typename
          ... on Partner {
            name
            type
          }
          ... on Node {
            __id
          }
          ... on ExternalPartner {
            __id
          }
        }
        __typename
      }
      cursor
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
    "name": "partnerType",
    "type": "PartnerShowPartnerType",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "status",
    "type": "EventStatus",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "dayThreshold",
    "type": "Int",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "sort",
    "type": "PartnerShowSorts",
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
  "alias": null,
  "name": "__id",
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
  "name": "QueryRenderersCitySectionListQuery",
  "id": "bfe5e5e4517946defd3eae66938bb76f",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersCitySectionListQuery",
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
            "name": "CitySectionList_city",
            "args": [
              {
                "kind": "Variable",
                "name": "dayThreshold",
                "variableName": "dayThreshold",
                "type": null
              },
              {
                "kind": "Variable",
                "name": "partnerType",
                "variableName": "partnerType",
                "type": null
              },
              {
                "kind": "Variable",
                "name": "sort",
                "variableName": "sort",
                "type": null
              },
              {
                "kind": "Variable",
                "name": "status",
                "variableName": "status",
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
    "name": "QueryRenderersCitySectionListQuery",
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
            "kind": "LinkedField",
            "alias": null,
            "name": "shows",
            "storageKey": null,
            "args": [
              {
                "kind": "Literal",
                "name": "after",
                "value": "",
                "type": "String"
              },
              {
                "kind": "Variable",
                "name": "dayThreshold",
                "variableName": "dayThreshold",
                "type": "Int"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 20,
                "type": "Int"
              },
              {
                "kind": "Literal",
                "name": "includeStubShows",
                "value": true,
                "type": "Boolean"
              },
              {
                "kind": "Variable",
                "name": "partnerType",
                "variableName": "partnerType",
                "type": "PartnerShowPartnerType"
              },
              {
                "kind": "Variable",
                "name": "sort",
                "variableName": "sort",
                "type": "PartnerShowSorts"
              },
              {
                "kind": "Variable",
                "name": "status",
                "variableName": "status",
                "type": "EventStatus"
              }
            ],
            "concreteType": "ShowConnection",
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
              },
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
                        "name": "href",
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
                      v3,
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
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "status",
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
                      v4,
                      v2,
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
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "exhibition_period",
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
                              v4
                            ]
                          }
                        ]
                      },
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
                "kind": "Variable",
                "name": "dayThreshold",
                "variableName": "dayThreshold",
                "type": "Int"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 20,
                "type": "Int"
              },
              {
                "kind": "Literal",
                "name": "includeStubShows",
                "value": true,
                "type": "Boolean"
              },
              {
                "kind": "Variable",
                "name": "partnerType",
                "variableName": "partnerType",
                "type": "PartnerShowPartnerType"
              },
              {
                "kind": "Variable",
                "name": "sort",
                "variableName": "sort",
                "type": "PartnerShowSorts"
              },
              {
                "kind": "Variable",
                "name": "status",
                "variableName": "status",
                "type": "EventStatus"
              }
            ],
            "handle": "connection",
            "key": "CitySectionList_shows",
            "filters": [
              "includeStubShows",
              "sort",
              "partnerType",
              "status",
              "dayThreshold"
            ]
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = 'f07f6ad80ab324291f3478267765ff36';
export default node;

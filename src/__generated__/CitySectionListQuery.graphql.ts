/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { CitySectionList_city$ref } from "./CitySectionList_city.graphql";
export type EventStatus = "CLOSED" | "CLOSING_SOON" | "CURRENT" | "RUNNING" | "RUNNING_AND_UPCOMING" | "UPCOMING" | "%future added value";
export type PartnerShowPartnerType = "GALLERY" | "MUSEUM" | "%future added value";
export type ShowSorts = "END_AT_ASC" | "END_AT_DESC" | "FEATURED_ASC" | "FEATURED_DESC" | "NAME_ASC" | "NAME_DESC" | "PARTNER_ASC" | "SORTABLE_NAME_ASC" | "SORTABLE_NAME_DESC" | "START_AT_ASC" | "START_AT_DESC" | "UPDATED_AT_ASC" | "UPDATED_AT_DESC" | "%future added value";
export type CitySectionListQueryVariables = {
    readonly count: number;
    readonly cursor?: string | null;
    readonly citySlug: string;
    readonly partnerType?: PartnerShowPartnerType | null;
    readonly status?: EventStatus | null;
    readonly dayThreshold?: number | null;
    readonly sort?: ShowSorts | null;
};
export type CitySectionListQueryResponse = {
    readonly city: {
        readonly " $fragmentRefs": CitySectionList_city$ref;
    } | null;
};
export type CitySectionListQuery = {
    readonly response: CitySectionListQueryResponse;
    readonly variables: CitySectionListQueryVariables;
};



/*
query CitySectionListQuery(
  $count: Int!
  $cursor: String
  $citySlug: String!
  $partnerType: PartnerShowPartnerType
  $status: EventStatus
  $dayThreshold: Int
  $sort: ShowSorts
) {
  city(slug: $citySlug) {
    ...CitySectionList_city_3BpxDU
  }
}

fragment CitySectionList_city_3BpxDU on City {
  name
  shows(includeStubShows: true, first: $count, sort: $sort, after: $cursor, partnerType: $partnerType, status: $status, dayThreshold: $dayThreshold) {
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      node {
        id
        slug
        internalID
        isStubShow
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
    "type": "ShowSorts",
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
  "kind": "Variable",
  "name": "dayThreshold",
  "variableName": "dayThreshold"
},
v3 = {
  "kind": "Variable",
  "name": "partnerType",
  "variableName": "partnerType"
},
v4 = {
  "kind": "Variable",
  "name": "sort",
  "variableName": "sort"
},
v5 = {
  "kind": "Variable",
  "name": "status",
  "variableName": "status"
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v7 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  (v2/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  {
    "kind": "Literal",
    "name": "includeStubShows",
    "value": true
  },
  (v3/*: any*/),
  (v4/*: any*/),
  (v5/*: any*/)
],
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "type",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "CitySectionListQuery",
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
            "name": "CitySectionList_city",
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
              },
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "CitySectionListQuery",
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
          (v6/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "shows",
            "storageKey": null,
            "args": (v7/*: any*/),
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
                      (v8/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "slug",
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
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "isStubShow",
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
                        "name": "href",
                        "args": null,
                        "storageKey": null
                      },
                      (v9/*: any*/),
                      (v6/*: any*/),
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
                          (v10/*: any*/),
                          (v8/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "type": "Partner",
                            "selections": [
                              (v6/*: any*/),
                              (v9/*: any*/),
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
                                  (v8/*: any*/)
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      (v10/*: any*/)
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
            "args": (v7/*: any*/),
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
  },
  "params": {
    "operationKind": "query",
    "name": "CitySectionListQuery",
    "id": "45ac967b1690b5e96c900ac6a63c230b",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '5f1ad237d6580e779eb949eb1a893e92';
export default node;

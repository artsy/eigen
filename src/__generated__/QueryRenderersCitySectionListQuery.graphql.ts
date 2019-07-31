/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { CitySectionList_city$ref } from "./CitySectionList_city.graphql";
export type EventStatus = "CLOSED" | "CLOSING_SOON" | "CURRENT" | "RUNNING" | "RUNNING_AND_UPCOMING" | "UPCOMING" | "%future added value";
export type PartnerShowPartnerType = "GALLERY" | "MUSEUM" | "%future added value";
export type ShowSorts = "END_AT_ASC" | "END_AT_DESC" | "FEATURED_ASC" | "FEATURED_DESC" | "NAME_ASC" | "NAME_DESC" | "PARTNER_ASC" | "SORTABLE_NAME_ASC" | "SORTABLE_NAME_DESC" | "START_AT_ASC" | "START_AT_DESC" | "UPDATED_AT_ASC" | "UPDATED_AT_DESC" | "%future added value";
export type QueryRenderersCitySectionListQueryVariables = {
    readonly citySlug: string;
    readonly partnerType?: PartnerShowPartnerType | null;
    readonly status?: EventStatus | null;
    readonly dayThreshold?: number | null;
    readonly sort?: ShowSorts | null;
};
export type QueryRenderersCitySectionListQueryResponse = {
    readonly city: {
        readonly " $fragmentRefs": CitySectionList_city$ref;
    } | null;
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
  $sort: ShowSorts
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
        slug
        internalID
        isStubShow
        is_followed: isFollowed
        start_at: startAt
        end_at: endAt
        status
        href
        type
        name
        cover_image: coverImage {
          url
        }
        exhibition_period: exhibitionPeriod
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
    "kind": "Literal",
    "name": "after",
    "value": ""
  },
  (v2/*: any*/),
  {
    "kind": "Literal",
    "name": "first",
    "value": 20
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
    "name": "QueryRenderersCitySectionListQuery",
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
    "name": "QueryRenderersCitySectionListQuery",
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
                        "alias": "is_followed",
                        "name": "isFollowed",
                        "args": null,
                        "storageKey": null
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
                        "alias": "cover_image",
                        "name": "coverImage",
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
                        "alias": "exhibition_period",
                        "name": "exhibitionPeriod",
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
    "name": "QueryRenderersCitySectionListQuery",
    "id": "d9524298d10ccf61fbf6be9bf89da153",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '29b6753f868977bf8e981a81bca35503';
export default node;

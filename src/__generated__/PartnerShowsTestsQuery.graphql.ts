/* tslint:disable */
/* eslint-disable */
/* @relayHash 3ea6793ea9ee1d1c7cf790dbca146aea */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PartnerShowsTestsQueryVariables = {};
export type PartnerShowsTestsQueryResponse = {
    readonly partner: {
        readonly " $fragmentRefs": FragmentRefs<"PartnerShows_partner">;
    } | null;
};
export type PartnerShowsTestsQueryRawResponse = {
    readonly partner: ({
        readonly slug: string;
        readonly internalID: string;
        readonly recentShows: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly isDisplayable: boolean | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly pastShows: ({
            readonly pageInfo: {
                readonly hasNextPage: boolean;
                readonly startCursor: string | null;
                readonly endCursor: string | null;
            };
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly isDisplayable: boolean | null;
                    readonly id: string;
                    readonly name: string | null;
                    readonly slug: string;
                    readonly exhibitionPeriod: string | null;
                    readonly coverImage: ({
                        readonly url: string | null;
                        readonly aspectRatio: number;
                    }) | null;
                    readonly href: string | null;
                    readonly __typename: "Show";
                }) | null;
                readonly cursor: string;
            }) | null> | null;
        }) | null;
        readonly currentAndUpcomingShows: ({
            readonly pageInfo: {
                readonly hasNextPage: boolean;
                readonly startCursor: string | null;
                readonly endCursor: string | null;
            };
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly isDisplayable: boolean | null;
                    readonly id: string;
                    readonly internalID: string;
                    readonly slug: string;
                    readonly name: string | null;
                    readonly exhibitionPeriod: string | null;
                    readonly endAt: string | null;
                    readonly images: ReadonlyArray<({
                        readonly url: string | null;
                    }) | null> | null;
                    readonly partner: ({
                        readonly __typename: "Partner";
                        readonly id: string | null;
                        readonly name: string | null;
                    } | {
                        readonly __typename: string | null;
                        readonly id: string | null;
                    }) | null;
                    readonly coverImage: ({
                        readonly url: string | null;
                    }) | null;
                    readonly __typename: "Show";
                }) | null;
                readonly cursor: string;
            }) | null> | null;
        }) | null;
        readonly id: string | null;
    }) | null;
};
export type PartnerShowsTestsQuery = {
    readonly response: PartnerShowsTestsQueryResponse;
    readonly variables: PartnerShowsTestsQueryVariables;
    readonly rawResponse: PartnerShowsTestsQueryRawResponse;
};



/*
query PartnerShowsTestsQuery {
  partner(id: "gagosian") {
    ...PartnerShows_partner
    id
  }
}

fragment PartnerShowRailItem_show on Show {
  internalID
  slug
  name
  exhibitionPeriod
  endAt
  coverImage {
    url
  }
  images {
    url
  }
}

fragment PartnerShowsRail_partner on Partner {
  internalID
  currentAndUpcomingShows: showsConnection(status: CURRENT, sort: END_AT_ASC, first: 6) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        isDisplayable
        id
        internalID
        slug
        name
        exhibitionPeriod
        endAt
        images {
          url
        }
        partner {
          __typename
          ... on Partner {
            name
          }
          ... on Node {
            id
          }
          ... on ExternalPartner {
            id
          }
        }
        ...PartnerShowRailItem_show
        __typename
      }
      cursor
    }
  }
}

fragment PartnerShows_partner on Partner {
  slug
  internalID
  recentShows: showsConnection(status: CURRENT, first: 10) {
    edges {
      node {
        id
        isDisplayable
      }
    }
  }
  pastShows: showsConnection(status: CLOSED, sort: END_AT_DESC, first: 32) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        isDisplayable
        id
        name
        slug
        exhibitionPeriod
        coverImage {
          url
          aspectRatio
        }
        href
        __typename
      }
      cursor
    }
  }
  ...PartnerShowsRail_partner
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "gagosian"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "Literal",
  "name": "status",
  "value": "CURRENT"
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
  "name": "isDisplayable",
  "args": null,
  "storageKey": null
},
v6 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 32
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "END_AT_DESC"
  },
  {
    "kind": "Literal",
    "name": "status",
    "value": "CLOSED"
  }
],
v7 = {
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
      "name": "hasNextPage",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "startCursor",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "endCursor",
      "args": null,
      "storageKey": null
    }
  ]
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "exhibitionPeriod",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "cursor",
  "args": null,
  "storageKey": null
},
v13 = [
  "status",
  "sort"
],
v14 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 6
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "END_AT_ASC"
  },
  (v3/*: any*/)
],
v15 = [
  (v10/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "PartnerShowsTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "partner",
        "storageKey": "partner(id:\"gagosian\")",
        "args": (v0/*: any*/),
        "concreteType": "Partner",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "PartnerShows_partner",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "PartnerShowsTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "partner",
        "storageKey": "partner(id:\"gagosian\")",
        "args": (v0/*: any*/),
        "concreteType": "Partner",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "kind": "LinkedField",
            "alias": "recentShows",
            "name": "showsConnection",
            "storageKey": "showsConnection(first:10,status:\"CURRENT\")",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10
              },
              (v3/*: any*/)
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
                      (v4/*: any*/),
                      (v5/*: any*/)
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "pastShows",
            "name": "showsConnection",
            "storageKey": "showsConnection(first:32,sort:\"END_AT_DESC\",status:\"CLOSED\")",
            "args": (v6/*: any*/),
            "concreteType": "ShowConnection",
            "plural": false,
            "selections": [
              (v7/*: any*/),
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
                      (v5/*: any*/),
                      (v4/*: any*/),
                      (v8/*: any*/),
                      (v1/*: any*/),
                      (v9/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "coverImage",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": false,
                        "selections": [
                          (v10/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "aspectRatio",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "href",
                        "args": null,
                        "storageKey": null
                      },
                      (v11/*: any*/)
                    ]
                  },
                  (v12/*: any*/)
                ]
              }
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": "pastShows",
            "name": "showsConnection",
            "args": (v6/*: any*/),
            "handle": "connection",
            "key": "Partner_pastShows",
            "filters": (v13/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": "currentAndUpcomingShows",
            "name": "showsConnection",
            "storageKey": "showsConnection(first:6,sort:\"END_AT_ASC\",status:\"CURRENT\")",
            "args": (v14/*: any*/),
            "concreteType": "ShowConnection",
            "plural": false,
            "selections": [
              (v7/*: any*/),
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
                      (v5/*: any*/),
                      (v4/*: any*/),
                      (v2/*: any*/),
                      (v1/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "endAt",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "images",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": true,
                        "selections": (v15/*: any*/)
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
                          (v11/*: any*/),
                          (v4/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "type": "Partner",
                            "selections": [
                              (v8/*: any*/)
                            ]
                          }
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "coverImage",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": false,
                        "selections": (v15/*: any*/)
                      },
                      (v11/*: any*/)
                    ]
                  },
                  (v12/*: any*/)
                ]
              }
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": "currentAndUpcomingShows",
            "name": "showsConnection",
            "args": (v14/*: any*/),
            "handle": "connection",
            "key": "Partner_currentAndUpcomingShows",
            "filters": (v13/*: any*/)
          },
          (v4/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "PartnerShowsTestsQuery",
    "id": "d5a107427227ac34506647cbe6a9ca5b",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '4ffad96e22ba4428cd590512f82bd1fa';
export default node;

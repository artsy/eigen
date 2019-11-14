/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PartnerShowsTestsQueryVariables = {};
export type PartnerShowsTestsQueryResponse = {
    readonly partner: {
        readonly slug: string;
        readonly internalID: string;
        readonly currentAndUpcomingShows: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                    readonly internalID: string;
                    readonly slug: string;
                    readonly name: string | null;
                    readonly exhibitionPeriod: string | null;
                    readonly endAt: string | null;
                    readonly images: ReadonlyArray<{
                        readonly url: string | null;
                    } | null> | null;
                    readonly " $fragmentRefs": FragmentRefs<"PartnerShowRailItem_show">;
                } | null;
            } | null> | null;
        } | null;
        readonly pastShows: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                    readonly name: string | null;
                    readonly slug: string;
                    readonly exhibitionPeriod: string | null;
                    readonly coverImage: {
                        readonly url: string | null;
                        readonly aspectRatio: number;
                    } | null;
                    readonly href: string | null;
                } | null;
            } | null> | null;
        } | null;
    } | null;
};
export type PartnerShowsTestsQueryRawResponse = {
    readonly partner: ({
        readonly slug: string;
        readonly internalID: string;
        readonly currentAndUpcomingShows: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly internalID: string;
                    readonly slug: string;
                    readonly name: string | null;
                    readonly exhibitionPeriod: string | null;
                    readonly endAt: string | null;
                    readonly images: ReadonlyArray<({
                        readonly url: string | null;
                    }) | null> | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly pastShows: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly name: string | null;
                    readonly slug: string;
                    readonly exhibitionPeriod: string | null;
                    readonly coverImage: ({
                        readonly url: string | null;
                        readonly aspectRatio: number;
                    }) | null;
                    readonly href: string | null;
                }) | null;
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
    slug
    internalID
    currentAndUpcomingShows: showsConnection(status: CURRENT, first: 10) {
      edges {
        node {
          id
          internalID
          slug
          name
          exhibitionPeriod
          endAt
          images {
            url
          }
          ...PartnerShowRailItem_show
        }
      }
    }
    pastShows: showsConnection(status: CLOSED, first: 10) {
      edges {
        node {
          id
          name
          slug
          exhibitionPeriod
          coverImage {
            url
            aspectRatio
          }
          href
        }
      }
    }
    id
  }
}

fragment PartnerShowRailItem_show on Show {
  internalID
  slug
  name
  exhibitionPeriod
  endAt
  images {
    url
  }
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
  "name": "first",
  "value": 10
},
v4 = [
  (v3/*: any*/),
  {
    "kind": "Literal",
    "name": "status",
    "value": "CURRENT"
  }
],
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
  "name": "name",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "exhibitionPeriod",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "endAt",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "images",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": true,
  "selections": [
    (v9/*: any*/)
  ]
},
v11 = {
  "kind": "LinkedField",
  "alias": "pastShows",
  "name": "showsConnection",
  "storageKey": "showsConnection(first:10,status:\"CLOSED\")",
  "args": [
    (v3/*: any*/),
    {
      "kind": "Literal",
      "name": "status",
      "value": "CLOSED"
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
            (v5/*: any*/),
            (v6/*: any*/),
            (v1/*: any*/),
            (v7/*: any*/),
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "coverImage",
              "storageKey": null,
              "args": null,
              "concreteType": "Image",
              "plural": false,
              "selections": [
                (v9/*: any*/),
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
            }
          ]
        }
      ]
    }
  ]
};
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
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "kind": "LinkedField",
            "alias": "currentAndUpcomingShows",
            "name": "showsConnection",
            "storageKey": "showsConnection(first:10,status:\"CURRENT\")",
            "args": (v4/*: any*/),
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
                      (v5/*: any*/),
                      (v2/*: any*/),
                      (v1/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v10/*: any*/),
                      {
                        "kind": "FragmentSpread",
                        "name": "PartnerShowRailItem_show",
                        "args": null
                      }
                    ]
                  }
                ]
              }
            ]
          },
          (v11/*: any*/)
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
            "alias": "currentAndUpcomingShows",
            "name": "showsConnection",
            "storageKey": "showsConnection(first:10,status:\"CURRENT\")",
            "args": (v4/*: any*/),
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
                      (v5/*: any*/),
                      (v2/*: any*/),
                      (v1/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v10/*: any*/)
                    ]
                  }
                ]
              }
            ]
          },
          (v11/*: any*/),
          (v5/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "PartnerShowsTestsQuery",
    "id": "b6255dcb6a9ff6909f24afb4d4016e52",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'fc3c5df260b57e037587bb3e39657a32';
export default node;

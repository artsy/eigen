/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2Exhibitors_fair = {
    readonly slug: string;
    readonly exhibitors: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly counts: {
                    readonly artworks: number | null;
                } | null;
                readonly partner: {
                    readonly id?: string;
                } | null;
                readonly " $fragmentRefs": FragmentRefs<"Fair2ExhibitorRail_show">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "Fair2Exhibitors_fair";
};
export type Fair2Exhibitors_fair$data = Fair2Exhibitors_fair;
export type Fair2Exhibitors_fair$key = {
    readonly " $data"?: Fair2Exhibitors_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2Exhibitors_fair">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = [
  (v0/*: any*/)
];
return {
  "kind": "Fragment",
  "name": "Fair2Exhibitors_fair",
  "type": "Fair",
  "metadata": {
    "connection": [
      {
        "count": "first",
        "cursor": "after",
        "direction": "forward",
        "path": [
          "exhibitors"
        ]
      }
    ]
  },
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "first",
      "type": "Int",
      "defaultValue": 15
    },
    {
      "kind": "LocalArgument",
      "name": "after",
      "type": "String",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "exhibitors",
      "name": "__Fair2ExhibitorsQuery_exhibitors_connection",
      "storageKey": "__Fair2ExhibitorsQuery_exhibitors_connection(sort:\"FEATURED_ASC\")",
      "args": [
        {
          "kind": "Literal",
          "name": "sort",
          "value": "FEATURED_ASC"
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
                (v0/*: any*/),
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "counts",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "ShowCounts",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "artworks",
                      "args": null,
                      "storageKey": null
                    }
                  ]
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
                    {
                      "kind": "InlineFragment",
                      "type": "Partner",
                      "selections": (v1/*: any*/)
                    },
                    {
                      "kind": "InlineFragment",
                      "type": "ExternalPartner",
                      "selections": (v1/*: any*/)
                    }
                  ]
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "__typename",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "FragmentSpread",
                  "name": "Fair2ExhibitorRail_show",
                  "args": null
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
    }
  ]
};
})();
(node as any).hash = 'dadfbbc40228775a328552e17446ba81';
export default node;

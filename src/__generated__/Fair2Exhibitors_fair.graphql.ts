/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2Exhibitors_fair = {
    readonly internalID: string;
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  (v0/*: any*/)
];
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "after"
    },
    {
      "defaultValue": 15,
      "kind": "LocalArgument",
      "name": "first"
    }
  ],
  "kind": "Fragment",
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
  "name": "Fair2Exhibitors_fair",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": "exhibitors",
      "args": [
        {
          "kind": "Literal",
          "name": "sort",
          "value": "FEATURED_ASC"
        }
      ],
      "concreteType": "ShowConnection",
      "kind": "LinkedField",
      "name": "__Fair2ExhibitorsQuery_exhibitors_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ShowEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Show",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "ShowCounts",
                  "kind": "LinkedField",
                  "name": "counts",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "artworks",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": null,
                  "kind": "LinkedField",
                  "name": "partner",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "InlineFragment",
                      "selections": (v1/*: any*/),
                      "type": "Partner",
                      "abstractKey": null
                    },
                    {
                      "kind": "InlineFragment",
                      "selections": (v1/*: any*/),
                      "type": "ExternalPartner",
                      "abstractKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "Fair2ExhibitorRail_show"
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "__Fair2ExhibitorsQuery_exhibitors_connection(sort:\"FEATURED_ASC\")"
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
})();
(node as any).hash = 'cbaa7f070b00285140baff4b99695311';
export default node;

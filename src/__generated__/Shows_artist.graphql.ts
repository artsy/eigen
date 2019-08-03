/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { SmallList_shows$ref } from "./SmallList_shows.graphql";
import { VariableSizeShowsList_shows$ref } from "./VariableSizeShowsList_shows.graphql";
declare const _Shows_artist$ref: unique symbol;
export type Shows_artist$ref = typeof _Shows_artist$ref;
export type Shows_artist = {
    readonly currentShows: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": VariableSizeShowsList_shows$ref;
            } | null;
        } | null> | null;
    } | null;
    readonly upcomingShows: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": VariableSizeShowsList_shows$ref;
            } | null;
        } | null> | null;
    } | null;
    readonly pastSmallShows?: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": SmallList_shows$ref;
            } | null;
        } | null> | null;
    } | null;
    readonly pastLargeShows?: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": VariableSizeShowsList_shows$ref;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": Shows_artist$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v1 = [
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
            "kind": "FragmentSpread",
            "name": "VariableSizeShowsList_shows",
            "args": null
          }
        ]
      }
    ]
  }
],
v2 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 20
  },
  {
    "kind": "Literal",
    "name": "status",
    "value": "closed"
  }
];
return {
  "kind": "Fragment",
  "name": "Shows_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "isPad",
      "type": "Boolean"
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "currentShows",
      "name": "shows",
      "storageKey": "shows(first:10,status:\"running\")",
      "args": [
        (v0/*: any*/),
        {
          "kind": "Literal",
          "name": "status",
          "value": "running"
        }
      ],
      "concreteType": "ShowConnection",
      "plural": false,
      "selections": (v1/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": "upcomingShows",
      "name": "shows",
      "storageKey": "shows(first:10,status:\"upcoming\")",
      "args": [
        (v0/*: any*/),
        {
          "kind": "Literal",
          "name": "status",
          "value": "upcoming"
        }
      ],
      "concreteType": "ShowConnection",
      "plural": false,
      "selections": (v1/*: any*/)
    },
    {
      "kind": "Condition",
      "passingValue": false,
      "condition": "isPad",
      "selections": [
        {
          "kind": "LinkedField",
          "alias": "pastSmallShows",
          "name": "shows",
          "storageKey": "shows(first:20,status:\"closed\")",
          "args": (v2/*: any*/),
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
                      "kind": "FragmentSpread",
                      "name": "SmallList_shows",
                      "args": null
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
      "kind": "Condition",
      "passingValue": true,
      "condition": "isPad",
      "selections": [
        {
          "kind": "LinkedField",
          "alias": "pastLargeShows",
          "name": "shows",
          "storageKey": "shows(first:20,status:\"closed\")",
          "args": (v2/*: any*/),
          "concreteType": "ShowConnection",
          "plural": false,
          "selections": (v1/*: any*/)
        }
      ]
    }
  ]
};
})();
(node as any).hash = '3a8da4519b0a019d3e331f1d04133aa2';
export default node;

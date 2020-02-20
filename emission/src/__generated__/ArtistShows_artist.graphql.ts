/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistShows_artist = {
    readonly currentShows: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": FragmentRefs<"VariableSizeShowsList_shows">;
            } | null;
        } | null> | null;
    } | null;
    readonly upcomingShows: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": FragmentRefs<"VariableSizeShowsList_shows">;
            } | null;
        } | null> | null;
    } | null;
    readonly pastSmallShows?: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": FragmentRefs<"SmallList_shows">;
            } | null;
        } | null> | null;
    } | null;
    readonly pastLargeShows?: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": FragmentRefs<"VariableSizeShowsList_shows">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ArtistShows_artist";
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
  "name": "ArtistShows_artist",
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
      "name": "showsConnection",
      "storageKey": "showsConnection(first:10,status:\"running\")",
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
      "name": "showsConnection",
      "storageKey": "showsConnection(first:10,status:\"upcoming\")",
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
          "name": "showsConnection",
          "storageKey": "showsConnection(first:20,status:\"closed\")",
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
          "name": "showsConnection",
          "storageKey": "showsConnection(first:20,status:\"closed\")",
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
(node as any).hash = 'a035e8faabf7860638dbb32efb5fcbed';
export default node;

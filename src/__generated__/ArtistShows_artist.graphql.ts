/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
export type ArtistShows_artist$data = ArtistShows_artist;
export type ArtistShows_artist$key = {
    readonly " $data"?: ArtistShows_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistShows_artist">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v1 = [
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
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "VariableSizeShowsList_shows"
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
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
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "isPad"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtistShows_artist",
  "selections": [
    {
      "alias": "currentShows",
      "args": [
        (v0/*: any*/),
        {
          "kind": "Literal",
          "name": "status",
          "value": "running"
        }
      ],
      "concreteType": "ShowConnection",
      "kind": "LinkedField",
      "name": "showsConnection",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": "showsConnection(first:10,status:\"running\")"
    },
    {
      "alias": "upcomingShows",
      "args": [
        (v0/*: any*/),
        {
          "kind": "Literal",
          "name": "status",
          "value": "upcoming"
        }
      ],
      "concreteType": "ShowConnection",
      "kind": "LinkedField",
      "name": "showsConnection",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": "showsConnection(first:10,status:\"upcoming\")"
    },
    {
      "condition": "isPad",
      "kind": "Condition",
      "passingValue": false,
      "selections": [
        {
          "alias": "pastSmallShows",
          "args": (v2/*: any*/),
          "concreteType": "ShowConnection",
          "kind": "LinkedField",
          "name": "showsConnection",
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
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "SmallList_shows"
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": "showsConnection(first:20,status:\"closed\")"
        }
      ]
    },
    {
      "condition": "isPad",
      "kind": "Condition",
      "passingValue": true,
      "selections": [
        {
          "alias": "pastLargeShows",
          "args": (v2/*: any*/),
          "concreteType": "ShowConnection",
          "kind": "LinkedField",
          "name": "showsConnection",
          "plural": false,
          "selections": (v1/*: any*/),
          "storageKey": "showsConnection(first:20,status:\"closed\")"
        }
      ]
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
})();
(node as any).hash = 'a035e8faabf7860638dbb32efb5fcbed';
export default node;

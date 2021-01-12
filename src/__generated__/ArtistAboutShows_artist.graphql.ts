/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistAboutShows_artist = {
    readonly name: string | null;
    readonly slug: string;
    readonly currentShows: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly " $fragmentRefs": FragmentRefs<"ArtistShow_show">;
            } | null;
        } | null> | null;
    } | null;
    readonly upcomingShows: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly " $fragmentRefs": FragmentRefs<"ArtistShow_show">;
            } | null;
        } | null> | null;
    } | null;
    readonly pastShows: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly " $fragmentRefs": FragmentRefs<"ArtistShow_show">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ArtistAboutShows_artist";
};
export type ArtistAboutShows_artist$data = ArtistAboutShows_artist;
export type ArtistAboutShows_artist$key = {
    readonly " $data"?: ArtistAboutShows_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistAboutShows_artist">;
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
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ArtistShow_show"
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtistAboutShows_artist",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
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
      "alias": "pastShows",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 3
        },
        {
          "kind": "Literal",
          "name": "status",
          "value": "closed"
        }
      ],
      "concreteType": "ShowConnection",
      "kind": "LinkedField",
      "name": "showsConnection",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": "showsConnection(first:3,status:\"closed\")"
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
})();
(node as any).hash = 'aba257bd31058e7c06b62c1a320fa0c6';
export default node;

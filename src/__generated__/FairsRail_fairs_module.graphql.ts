/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type FairsRail_fairs_module = {
    readonly results: ReadonlyArray<{
        readonly id: string;
        readonly slug: string;
        readonly profile: {
            readonly slug: string;
        } | null;
        readonly name: string | null;
        readonly exhibitionPeriod: string | null;
        readonly followedArtistArtworks: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly title: string | null;
                    readonly href: string | null;
                    readonly artist: {
                        readonly name: string | null;
                    } | null;
                } | null;
            } | null> | null;
        } | null;
        readonly otherArtworks: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly title: string | null;
                    readonly href: string | null;
                    readonly artist: {
                        readonly name: string | null;
                    } | null;
                } | null;
            } | null> | null;
        } | null;
    } | null>;
    readonly " $refType": "FairsRail_fairs_module";
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "Literal",
  "name": "first",
  "value": 3
},
v3 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "edges",
    "storageKey": null,
    "args": null,
    "concreteType": "FilterArtworksEdge",
    "plural": true,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": null,
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "title",
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
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artist",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": false,
            "selections": [
              (v1/*: any*/)
            ]
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Fragment",
  "name": "FairsRail_fairs_module",
  "type": "HomePageFairsModule",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "results",
      "storageKey": null,
      "args": null,
      "concreteType": "Fair",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
          "args": null,
          "storageKey": null
        },
        (v0/*: any*/),
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "profile",
          "storageKey": null,
          "args": null,
          "concreteType": "Profile",
          "plural": false,
          "selections": [
            (v0/*: any*/)
          ]
        },
        (v1/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "exhibitionPeriod",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": "followedArtistArtworks",
          "name": "filterArtworksConnection",
          "storageKey": "filterArtworksConnection(first:3,includeArtworksByFollowedArtists:true)",
          "args": [
            (v2/*: any*/),
            {
              "kind": "Literal",
              "name": "includeArtworksByFollowedArtists",
              "value": true
            }
          ],
          "concreteType": "FilterArtworksConnection",
          "plural": false,
          "selections": (v3/*: any*/)
        },
        {
          "kind": "LinkedField",
          "alias": "otherArtworks",
          "name": "filterArtworksConnection",
          "storageKey": "filterArtworksConnection(first:3)",
          "args": [
            (v2/*: any*/)
          ],
          "concreteType": "FilterArtworksConnection",
          "plural": false,
          "selections": (v3/*: any*/)
        }
      ]
    }
  ]
};
})();
(node as any).hash = '679f578dda1939db490588f282ef3282';
export default node;

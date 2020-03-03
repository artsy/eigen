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
                    readonly image: {
                        readonly url: string | null;
                    } | null;
                } | null;
            } | null> | null;
        } | null;
        readonly otherArtworks: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly image: {
                        readonly url: string | null;
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
  "kind": "Literal",
  "name": "first",
  "value": 3
},
v2 = [
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
                    "value": "large"
                  }
                ],
                "storageKey": "url(version:\"large\")"
              }
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
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        },
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
            (v1/*: any*/),
            {
              "kind": "Literal",
              "name": "includeArtworksByFollowedArtists",
              "value": true
            }
          ],
          "concreteType": "FilterArtworksConnection",
          "plural": false,
          "selections": (v2/*: any*/)
        },
        {
          "kind": "LinkedField",
          "alias": "otherArtworks",
          "name": "filterArtworksConnection",
          "storageKey": "filterArtworksConnection(first:3)",
          "args": [
            (v1/*: any*/)
          ],
          "concreteType": "FilterArtworksConnection",
          "plural": false,
          "selections": (v2/*: any*/)
        }
      ]
    }
  ]
};
})();
(node as any).hash = '34bbc73d00a79f3c61c3b9b1ad6e2c84';
export default node;

/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairsRail_fairs_module = {
    readonly results: ReadonlyArray<{
        readonly id: string;
        readonly slug: string;
        readonly profile: {
            readonly slug: string;
        } | null;
        readonly name: string | null;
        readonly exhibitionPeriod: string | null;
        readonly image: {
            readonly url: string | null;
        } | null;
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
export type FairsRail_fairs_module$data = FairsRail_fairs_module;
export type FairsRail_fairs_module$key = {
    readonly " $data"?: FairsRail_fairs_module$data;
    readonly " $fragmentRefs": FragmentRefs<"FairsRail_fairs_module">;
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
},
v2 = {
  "kind": "Literal",
  "name": "first",
  "value": 2
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
          (v1/*: any*/)
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
        (v1/*: any*/),
        {
          "kind": "LinkedField",
          "alias": "followedArtistArtworks",
          "name": "filterArtworksConnection",
          "storageKey": "filterArtworksConnection(first:2,includeArtworksByFollowedArtists:true)",
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
          "storageKey": "filterArtworksConnection(first:2)",
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
(node as any).hash = '2e213c9e62250faf84f041148e61a84c';
export default node;

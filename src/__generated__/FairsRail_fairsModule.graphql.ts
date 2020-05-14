/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairsRail_fairsModule = {
    readonly results: ReadonlyArray<{
        readonly id: string;
        readonly internalID: string;
        readonly slug: string;
        readonly profile: {
            readonly slug: string;
        } | null;
        readonly name: string | null;
        readonly exhibitionPeriod: string | null;
        readonly image: {
            readonly url: string | null;
        } | null;
        readonly location: {
            readonly city: string | null;
            readonly country: string | null;
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
    readonly " $refType": "FairsRail_fairsModule";
};
export type FairsRail_fairsModule$data = FairsRail_fairsModule;
export type FairsRail_fairsModule$key = {
    readonly " $data"?: FairsRail_fairsModule$data;
    readonly " $fragmentRefs": FragmentRefs<"FairsRail_fairsModule">;
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
  "name": "FairsRail_fairsModule",
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
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "internalID",
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
          "alias": null,
          "name": "location",
          "storageKey": null,
          "args": null,
          "concreteType": "Location",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "city",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "country",
              "args": null,
              "storageKey": null
            }
          ]
        },
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
(node as any).hash = 'ae3dc57aad680b8b20e7e8bb91b72e39';
export default node;

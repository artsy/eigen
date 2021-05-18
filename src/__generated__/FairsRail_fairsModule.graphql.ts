/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "image",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "version",
          "value": "large"
        }
      ],
      "kind": "ScalarField",
      "name": "url",
      "storageKey": "url(version:\"large\")"
    }
  ],
  "storageKey": null
},
v2 = {
  "kind": "Literal",
  "name": "first",
  "value": 2
},
v3 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "FilterArtworksEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v1/*: any*/)
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
  "name": "FairsRail_fairsModule",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Fair",
      "kind": "LinkedField",
      "name": "results",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "internalID",
          "storageKey": null
        },
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "Profile",
          "kind": "LinkedField",
          "name": "profile",
          "plural": false,
          "selections": [
            (v0/*: any*/)
          ],
          "storageKey": null
        },
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
          "name": "exhibitionPeriod",
          "storageKey": null
        },
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "Location",
          "kind": "LinkedField",
          "name": "location",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "city",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "country",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": "followedArtistArtworks",
          "args": [
            (v2/*: any*/),
            {
              "kind": "Literal",
              "name": "input",
              "value": {
                "includeArtworksByFollowedArtists": true
              }
            }
          ],
          "concreteType": "FilterArtworksConnection",
          "kind": "LinkedField",
          "name": "filterArtworksConnection",
          "plural": false,
          "selections": (v3/*: any*/),
          "storageKey": "filterArtworksConnection(first:2,input:{\"includeArtworksByFollowedArtists\":true})"
        },
        {
          "alias": "otherArtworks",
          "args": [
            (v2/*: any*/)
          ],
          "concreteType": "FilterArtworksConnection",
          "kind": "LinkedField",
          "name": "filterArtworksConnection",
          "plural": false,
          "selections": (v3/*: any*/),
          "storageKey": "filterArtworksConnection(first:2)"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "HomePageFairsModule",
  "abstractKey": null
};
})();
(node as any).hash = '12b4dc456e16dfdced9d770ada80ca05';
export default node;

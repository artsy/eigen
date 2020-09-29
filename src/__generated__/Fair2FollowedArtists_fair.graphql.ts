/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2FollowedArtists_fair = {
    readonly slug: string;
    readonly followedArtistArtworks: {
        readonly edges: ReadonlyArray<{
            readonly artwork: {
                readonly id: string;
                readonly slug: string;
                readonly " $fragmentRefs": FragmentRefs<"ArtworkTileRailCard_artwork">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "Fair2FollowedArtists_fair";
};
export type Fair2FollowedArtists_fair$data = Fair2FollowedArtists_fair;
export type Fair2FollowedArtists_fair$key = {
    readonly " $data"?: Fair2FollowedArtists_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2FollowedArtists_fair">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "Fair2FollowedArtists_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    {
      "kind": "LinkedField",
      "alias": "followedArtistArtworks",
      "name": "filterArtworksConnection",
      "storageKey": "filterArtworksConnection(first:20,includeArtworksByFollowedArtists:true)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 20
        },
        {
          "kind": "Literal",
          "name": "includeArtworksByFollowedArtists",
          "value": true
        }
      ],
      "concreteType": "FilterArtworksConnection",
      "plural": false,
      "selections": [
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
              "alias": "artwork",
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Artwork",
              "plural": false,
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
                  "kind": "FragmentSpread",
                  "name": "ArtworkTileRailCard_artwork",
                  "args": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'b3038830ea337b5e84dc4d2dbedaa623';
export default node;

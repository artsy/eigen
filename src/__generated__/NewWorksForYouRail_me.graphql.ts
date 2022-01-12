/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type NewWorksForYouRail_me = {
    readonly newWorksByInterestingArtists: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": FragmentRefs<"LargeArtworkRail_artworks">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "NewWorksForYouRail_me";
};
export type NewWorksForYouRail_me$data = NewWorksForYouRail_me;
export type NewWorksForYouRail_me$key = {
    readonly " $data"?: NewWorksForYouRail_me$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"NewWorksForYouRail_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": 30,
      "kind": "LocalArgument",
      "name": "count"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "NewWorksForYouRail_me",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "first",
          "variableName": "count"
        }
      ],
      "concreteType": "ArtworkConnection",
      "kind": "LinkedField",
      "name": "newWorksByInterestingArtists",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ArtworkEdge",
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
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "LargeArtworkRail_artworks"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '65065d339b77522d6342d6970ced0300';
export default node;

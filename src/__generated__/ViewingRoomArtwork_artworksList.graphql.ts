/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomArtwork_artworksList = {
    readonly artworksConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly slug: string;
                readonly image: {
                    readonly url: string | null;
                    readonly aspectRatio: number;
                } | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ViewingRoomArtwork_artworksList";
};
export type ViewingRoomArtwork_artworksList$data = ViewingRoomArtwork_artworksList;
export type ViewingRoomArtwork_artworksList$key = {
    readonly " $data"?: ViewingRoomArtwork_artworksList$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomArtwork_artworksList">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ViewingRoomArtwork_artworksList",
  "type": "ViewingRoom",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artworksConnection",
      "storageKey": null,
      "args": null,
      "concreteType": "ArtworkConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ArtworkEdge",
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
                  "name": "slug",
                  "args": null,
                  "storageKey": null
                },
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
                          "value": "larger"
                        }
                      ],
                      "storageKey": "url(version:\"larger\")"
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "aspectRatio",
                      "args": null,
                      "storageKey": null
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '8581984b8d5c6f07ab15af19d6c31718';
export default node;

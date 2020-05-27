/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistList_targetSupply = {
    readonly microfunnel: ReadonlyArray<{
        readonly artist: {
            readonly name: string | null;
            readonly href: string | null;
            readonly image: {
                readonly cropped: {
                    readonly url: string | null;
                    readonly width: number | null;
                    readonly height: number | null;
                } | null;
            } | null;
        } | null;
    } | null> | null;
    readonly " $refType": "ArtistList_targetSupply";
};
export type ArtistList_targetSupply$data = ArtistList_targetSupply;
export type ArtistList_targetSupply$key = {
    readonly " $data"?: ArtistList_targetSupply$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistList_targetSupply">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtistList_targetSupply",
  "type": "TargetSupply",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "microfunnel",
      "storageKey": null,
      "args": null,
      "concreteType": "TargetSupplyMicrofunnelItem",
      "plural": true,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "artist",
          "storageKey": null,
          "args": null,
          "concreteType": "Artist",
          "plural": false,
          "selections": [
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
              "name": "href",
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
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "cropped",
                  "storageKey": "cropped(height:70,width:76)",
                  "args": [
                    {
                      "kind": "Literal",
                      "name": "height",
                      "value": 70
                    },
                    {
                      "kind": "Literal",
                      "name": "width",
                      "value": 76
                    }
                  ],
                  "concreteType": "CroppedImageUrl",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "url",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "width",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "height",
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
(node as any).hash = '75ff3f5729a0d20bb5dfe4f175227ee2';
export default node;

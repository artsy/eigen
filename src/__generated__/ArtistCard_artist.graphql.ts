/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type ArtistCard_artist = {
    readonly id: string;
    readonly slug: string;
    readonly internalID: string;
    readonly href: string | null;
    readonly name: string | null;
    readonly formattedNationalityAndBirthday: string | null;
    readonly avatar: {
        readonly url: string | null;
    } | null;
    readonly artworksConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly image: {
                    readonly url: string | null;
                } | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ArtistCard_artist";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtistCard_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [],
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
      "name": "slug",
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
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "href",
      "args": null,
      "storageKey": null
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
      "name": "formattedNationalityAndBirthday",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "avatar",
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
              "value": "small"
            }
          ],
          "storageKey": "url(version:\"small\")"
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artworksConnection",
      "storageKey": "artworksConnection(first:3)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 3
        }
      ],
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
      ]
    }
  ]
};
(node as any).hash = '4e52f05c0f018ee6527a9e1a58f477cf';
export default node;

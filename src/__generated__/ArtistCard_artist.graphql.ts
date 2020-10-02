/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
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
    readonly basedOn: {
        readonly name: string | null;
    } | null;
    readonly isFollowed: boolean | null;
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
export type ArtistCard_artist$data = ArtistCard_artist;
export type ArtistCard_artist$key = {
    readonly " $data"?: ArtistCard_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistCard_artist">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtistCard_artist",
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
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "href",
      "storageKey": null
    },
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "formattedNationalityAndBirthday",
      "storageKey": null
    },
    {
      "alias": "avatar",
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
              "value": "small"
            }
          ],
          "kind": "ScalarField",
          "name": "url",
          "storageKey": "url(version:\"small\")"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Artist",
      "kind": "LinkedField",
      "name": "basedOn",
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
      "name": "isFollowed",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 3
        }
      ],
      "concreteType": "ArtworkConnection",
      "kind": "LinkedField",
      "name": "artworksConnection",
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
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "artworksConnection(first:3)"
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
})();
(node as any).hash = 'e25a1459ff7973a0d58e138af7cea90c';
export default node;

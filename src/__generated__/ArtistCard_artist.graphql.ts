/* tslint:disable */
/* eslint-disable */

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
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
};
return {
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
    (v0/*: any*/),
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
      "name": "basedOn",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": false,
      "selections": [
        (v0/*: any*/)
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
})();
(node as any).hash = 'a488c72f38104b0262addf49dec7f754';
export default node;

/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _FairHeader_fair$ref: unique symbol;
export type FairHeader_fair$ref = typeof _FairHeader_fair$ref;
export type FairHeader_fair = {
    readonly slug: string;
    readonly internalID: string;
    readonly name: string | null;
    readonly formattedOpeningHours: string | null;
    readonly counts: {
        readonly artists: any | null;
        readonly partners: any | null;
    } | null;
    readonly followed_content: {
        readonly artists: ReadonlyArray<{
            readonly name: string | null;
            readonly href: string | null;
            readonly slug: string;
            readonly internalID: string;
        } | null> | null;
        readonly galleries: ReadonlyArray<{
            readonly internalID: string;
            readonly name: string | null;
        } | null> | null;
    } | null;
    readonly partner_names: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly slug: string;
                readonly partner: ({
                    readonly profile?: {
                        readonly name: string | null;
                        readonly slug: string;
                        readonly internalID: string;
                    } | null;
                } & ({
                    readonly profile: {
                        readonly name: string | null;
                        readonly slug: string;
                        readonly internalID: string;
                    } | null;
                } | {
                    /*This will never be '% other', but we need some
                    value in case none of the concrete values match.*/
                    readonly __typename: "%other";
                })) | null;
            } | null;
        } | null> | null;
    } | null;
    readonly artists_names: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly name: string | null;
                readonly href: string | null;
                readonly slug: string;
                readonly internalID: string;
            } | null;
        } | null> | null;
    } | null;
    readonly image: {
        readonly image_url: string | null;
        readonly aspect_ratio: number;
        readonly url: string | null;
    } | null;
    readonly profile: {
        readonly icon: {
            readonly internalID: string | null;
            readonly href: string | null;
            readonly height: number | null;
            readonly width: number | null;
            readonly url: string | null;
        } | null;
        readonly id: string;
        readonly slug: string;
        readonly name: string | null;
        readonly is_followed: boolean | null;
    } | null;
    readonly start_at: string | null;
    readonly end_at: string | null;
    readonly exhibition_period: string | null;
    readonly " $refType": FairHeader_fair$ref;
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
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v4 = [
  (v2/*: any*/),
  (v3/*: any*/),
  (v0/*: any*/),
  (v1/*: any*/)
];
return {
  "kind": "Fragment",
  "name": "FairHeader_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    (v2/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "formattedOpeningHours",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "counts",
      "storageKey": null,
      "args": null,
      "concreteType": "FairCounts",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artists",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "partners",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": "followed_content",
      "name": "followedContent",
      "storageKey": null,
      "args": null,
      "concreteType": "FollowedContent",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "artists",
          "storageKey": null,
          "args": null,
          "concreteType": "Artist",
          "plural": true,
          "selections": (v4/*: any*/)
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "galleries",
          "storageKey": null,
          "args": null,
          "concreteType": "Partner",
          "plural": true,
          "selections": [
            (v1/*: any*/),
            (v2/*: any*/)
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": "partner_names",
      "name": "showsConnection",
      "storageKey": "showsConnection(first:2)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 2
        }
      ],
      "concreteType": "ShowConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ShowEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Show",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "partner",
                  "storageKey": null,
                  "args": null,
                  "concreteType": null,
                  "plural": false,
                  "selections": [
                    {
                      "kind": "InlineFragment",
                      "type": "Partner",
                      "selections": [
                        {
                          "kind": "LinkedField",
                          "alias": null,
                          "name": "profile",
                          "storageKey": null,
                          "args": null,
                          "concreteType": "Profile",
                          "plural": false,
                          "selections": [
                            (v2/*: any*/),
                            (v0/*: any*/),
                            (v1/*: any*/)
                          ]
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
    },
    {
      "kind": "LinkedField",
      "alias": "artists_names",
      "name": "artists",
      "storageKey": "artists(first:3)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 3
        }
      ],
      "concreteType": "ArtistConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ArtistEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Artist",
              "plural": false,
              "selections": (v4/*: any*/)
            }
          ]
        }
      ]
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
          "alias": "image_url",
          "name": "imageURL",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": "aspect_ratio",
          "name": "aspectRatio",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "url",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "profile",
      "storageKey": null,
      "args": null,
      "concreteType": "Profile",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "icon",
          "storageKey": null,
          "args": null,
          "concreteType": "Image",
          "plural": false,
          "selections": [
            (v1/*: any*/),
            (v3/*: any*/),
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "height",
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
              "name": "url",
              "args": [
                {
                  "kind": "Literal",
                  "name": "version",
                  "value": "square140"
                }
              ],
              "storageKey": "url(version:\"square140\")"
            }
          ]
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
          "args": null,
          "storageKey": null
        },
        (v0/*: any*/),
        (v2/*: any*/),
        {
          "kind": "ScalarField",
          "alias": "is_followed",
          "name": "isFollowed",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": "start_at",
      "name": "startAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "end_at",
      "name": "endAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "exhibition_period",
      "name": "exhibitionPeriod",
      "args": null,
      "storageKey": null
    }
  ]
};
})();
(node as any).hash = '6fd2bf1a89e58ebb5a9df161ad3c178c';
export default node;

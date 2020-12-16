/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowMoreInfo_show = {
    readonly internalID: string;
    readonly slug: string;
    readonly href: string | null;
    readonly about: string | null;
    readonly pressRelease: string | null;
    readonly partner: {
        readonly __typename: string;
        readonly type?: string | null;
        readonly " $fragmentRefs": FragmentRefs<"PartnerEntityHeader_partner">;
    } | null;
    readonly fair: {
        readonly location: {
            readonly __typename: string;
            readonly openingHours: ({
                readonly __typename: "OpeningHoursArray";
                readonly schedules: ReadonlyArray<{
                    readonly __typename: string;
                } | null> | null;
            } | {
                readonly __typename: "OpeningHoursText";
                readonly text: string | null;
            } | {
                /*This will never be '%other', but we need some
                value in case none of the concrete values match.*/
                readonly __typename: "%other";
            }) | null;
            readonly coordinates: {
                readonly lat: number | null;
                readonly lng: number | null;
            } | null;
        } | null;
    } | null;
    readonly location: {
        readonly __typename: string;
        readonly openingHours: ({
            readonly __typename: "OpeningHoursArray";
            readonly schedules: ReadonlyArray<{
                readonly __typename: string;
            } | null> | null;
        } | {
            readonly __typename: "OpeningHoursText";
            readonly text: string | null;
        } | {
            /*This will never be '%other', but we need some
            value in case none of the concrete values match.*/
            readonly __typename: "%other";
        }) | null;
        readonly coordinates: {
            readonly lat: number | null;
            readonly lng: number | null;
        } | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"ShowLocation_show" | "ShowHours_show">;
    readonly " $refType": "ShowMoreInfo_show";
};
export type ShowMoreInfo_show$data = ShowMoreInfo_show;
export type ShowMoreInfo_show$key = {
    readonly " $data"?: ShowMoreInfo_show$data;
    readonly " $fragmentRefs": FragmentRefs<"ShowMoreInfo_show">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "concreteType": "Location",
  "kind": "LinkedField",
  "name": "location",
  "plural": false,
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "openingHours",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "FormattedDaySchedules",
              "kind": "LinkedField",
              "name": "schedules",
              "plural": true,
              "selections": [
                (v0/*: any*/)
              ],
              "storageKey": null
            }
          ],
          "type": "OpeningHoursArray",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "text",
              "storageKey": null
            }
          ],
          "type": "OpeningHoursText",
          "abstractKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "LatLng",
      "kind": "LinkedField",
      "name": "coordinates",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "lat",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "lng",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ShowMoreInfo_show",
  "selections": [
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
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "href",
      "storageKey": null
    },
    {
      "alias": "about",
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "format",
          "value": "MARKDOWN"
        }
      ],
      "kind": "ScalarField",
      "name": "pressRelease",
      "storageKey": "pressRelease(format:\"MARKDOWN\")"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "partner",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "PartnerEntityHeader_partner"
        },
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "type",
              "storageKey": null
            }
          ],
          "type": "Partner",
          "abstractKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Fair",
      "kind": "LinkedField",
      "name": "fair",
      "plural": false,
      "selections": [
        (v1/*: any*/)
      ],
      "storageKey": null
    },
    (v1/*: any*/),
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ShowLocation_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ShowHours_show"
    }
  ],
  "type": "Show",
  "abstractKey": null
};
})();
(node as any).hash = 'e09c8b71e0254ca335e0c063f18e8702';
export default node;

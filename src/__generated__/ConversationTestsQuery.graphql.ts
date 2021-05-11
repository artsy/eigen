/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash bf2613dbb4971580a649f4750eea1e65 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ConversationTestsQueryVariables = {
    conversationID: string;
};
export type ConversationTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"Conversation_me">;
    } | null;
};
export type ConversationTestsQuery = {
    readonly response: ConversationTestsQueryResponse;
    readonly variables: ConversationTestsQueryVariables;
};



/*
query ConversationTestsQuery(
  $conversationID: String!
) {
  me {
    ...Conversation_me
    id
  }
}

fragment ArtworkPreview_artwork on Artwork {
  slug
  internalID
  title
  artistNames
  date
  image {
    url
    aspectRatio
  }
}

fragment AttachmentPreview_attachment on Attachment {
  internalID
}

fragment Composer_conversation on Conversation {
  ...ConversationCTA_conversation
  items {
    item {
      __typename
      ... on Artwork {
        href
        slug
      }
      ... on Show {
        href
      }
      ... on Node {
        __isNode: __typename
        id
      }
    }
  }
}

fragment ConversationCTA_conversation on Conversation {
  conversationID: internalID
  items {
    item {
      __typename
      ... on Artwork {
        artworkID: internalID
      }
      ... on Node {
        __isNode: __typename
        id
      }
    }
  }
  activeOrders: orderConnection(first: 10, states: [APPROVED, FULFILLED, SUBMITTED, REFUNDED]) {
    edges {
      node {
        __typename
        internalID
        state
        stateReason
        stateExpiresAt
        lastTransactionFailed
        ... on CommerceOfferOrder {
          lastOffer {
            fromParticipant
            createdAt
            definesTotal
            offerAmountChanged
            id
          }
          offers(first: 5) {
            edges {
              node {
                internalID
                id
              }
            }
          }
        }
        id
      }
    }
  }
}

fragment Conversation_me on Me {
  conversation(id: $conversationID) {
    ...Composer_conversation
    ...Messages_conversation
    internalID
    id
    lastMessageID
    unread
    to {
      name
      id
    }
    from {
      email
      id
    }
  }
}

fragment FileDownload_attachment on Attachment {
  fileName
  downloadURL
  ...AttachmentPreview_attachment
}

fragment ImagePreview_attachment on Attachment {
  downloadURL
  ...AttachmentPreview_attachment
}

fragment Message_message on Message {
  __typename
  body
  createdAt
  internalID
  isFromUser
  isFirstMessage
  from {
    name
    email
  }
  attachments {
    id
    internalID
    contentType
    downloadURL
    fileName
    ...PDFPreview_attachment
    ...ImagePreview_attachment
    ...FileDownload_attachment
  }
}

fragment Messages_conversation on Conversation {
  id
  internalID
  from {
    name
    email
    id
  }
  to {
    name
    id
  }
  initialMessage
  lastMessageID
  orderConnection(first: 10, participantType: BUYER) {
    edges {
      node {
        __typename
        orderHistory {
          ...OrderUpdate_event
          __typename
          ... on CommerceOrderStateChangedEvent {
            createdAt
            state
            stateReason
          }
          ... on CommerceOfferSubmittedEvent {
            createdAt
          }
        }
        id
      }
    }
  }
  messagesConnection(first: 10, sort: DESC) {
    pageInfo {
      startCursor
      endCursor
      hasPreviousPage
      hasNextPage
    }
    edges {
      cursor
      node {
        __typename
        id
        internalID
        isFromUser
        isFirstMessage
        body
        createdAt
        attachments {
          id
          internalID
          contentType
          downloadURL
          fileName
          ...ImagePreview_attachment
          ...PDFPreview_attachment
          ...FileDownload_attachment
        }
        ...Message_message
      }
    }
  }
  items {
    item {
      __typename
      ... on Artwork {
        href
        ...ArtworkPreview_artwork
      }
      ... on Show {
        href
        ...ShowPreview_show
      }
      ... on Node {
        __isNode: __typename
        id
      }
    }
  }
}

fragment OrderUpdate_event on CommerceOrderEventUnion {
  __isCommerceOrderEventUnion: __typename
  __typename
  ... on CommerceOrderStateChangedEvent {
    createdAt
    stateReason
    state
  }
  ... on CommerceOfferSubmittedEvent {
    createdAt
    offer {
      amount
      fromParticipant
      definesTotal
      offerAmountChanged
      respondsTo {
        fromParticipant
        id
      }
      id
    }
  }
}

fragment PDFPreview_attachment on Attachment {
  fileName
  ...AttachmentPreview_attachment
}

fragment ShowPreview_show on Show {
  slug
  internalID
  name
  coverImage {
    url
    aspectRatio
  }
  fair {
    name
    id
  }
  partner {
    __typename
    ... on Partner {
      name
    }
    ... on Node {
      __isNode: __typename
      id
    }
    ... on ExternalPartner {
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "conversationID"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "url",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "aspectRatio",
    "storageKey": null
  }
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = [
  (v6/*: any*/)
],
v8 = {
  "kind": "InlineFragment",
  "selections": (v7/*: any*/),
  "type": "Node",
  "abstractKey": "__isNode"
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v10 = [
  (v9/*: any*/),
  (v6/*: any*/)
],
v11 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stateReason",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fromParticipant",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "definesTotal",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "offerAmountChanged",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v19 = [
  (v11/*: any*/),
  {
    "kind": "Literal",
    "name": "sort",
    "value": "DESC"
  }
],
v20 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "CommerceOrderConnectionWithTotalCount"
},
v21 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "CommerceOrderEdge"
},
v22 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "CommerceOrder"
},
v23 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v24 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v25 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "CommerceOffer"
},
v26 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Boolean"
},
v27 = {
  "enumValues": [
    "BUYER",
    "SELLER"
  ],
  "nullable": true,
  "plural": false,
  "type": "CommerceOrderParticipantEnum"
},
v28 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v29 = {
  "enumValues": [
    "ABANDONED",
    "APPROVED",
    "CANCELED",
    "FULFILLED",
    "PENDING",
    "REFUNDED",
    "SUBMITTED"
  ],
  "nullable": false,
  "plural": false,
  "type": "CommerceOrderStateEnum"
},
v30 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v31 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "ID"
},
v32 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v33 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Float"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ConversationTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Conversation_me"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ConversationTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": [
              {
                "kind": "Variable",
                "name": "id",
                "variableName": "conversationID"
              }
            ],
            "concreteType": "Conversation",
            "kind": "LinkedField",
            "name": "conversation",
            "plural": false,
            "selections": [
              {
                "alias": "conversationID",
                "args": null,
                "kind": "ScalarField",
                "name": "internalID",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "ConversationItem",
                "kind": "LinkedField",
                "name": "items",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "item",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          {
                            "alias": "artworkID",
                            "args": null,
                            "kind": "ScalarField",
                            "name": "internalID",
                            "storageKey": null
                          },
                          (v2/*: any*/),
                          (v3/*: any*/),
                          (v4/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "title",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "artistNames",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "date",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "image",
                            "plural": false,
                            "selections": (v5/*: any*/),
                            "storageKey": null
                          }
                        ],
                        "type": "Artwork",
                        "abstractKey": null
                      },
                      (v8/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v2/*: any*/),
                          (v3/*: any*/),
                          (v4/*: any*/),
                          (v9/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "coverImage",
                            "plural": false,
                            "selections": (v5/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Fair",
                            "kind": "LinkedField",
                            "name": "fair",
                            "plural": false,
                            "selections": (v10/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "partner",
                            "plural": false,
                            "selections": [
                              (v1/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  (v9/*: any*/)
                                ],
                                "type": "Partner",
                                "abstractKey": null
                              },
                              (v8/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "selections": (v7/*: any*/),
                                "type": "ExternalPartner",
                                "abstractKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "type": "Show",
                        "abstractKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": "activeOrders",
                "args": [
                  (v11/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "states",
                    "value": [
                      "APPROVED",
                      "FULFILLED",
                      "SUBMITTED",
                      "REFUNDED"
                    ]
                  }
                ],
                "concreteType": "CommerceOrderConnectionWithTotalCount",
                "kind": "LinkedField",
                "name": "orderConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CommerceOrderEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v1/*: any*/),
                          (v4/*: any*/),
                          (v12/*: any*/),
                          (v13/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "stateExpiresAt",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "lastTransactionFailed",
                            "storageKey": null
                          },
                          (v6/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CommerceOffer",
                                "kind": "LinkedField",
                                "name": "lastOffer",
                                "plural": false,
                                "selections": [
                                  (v14/*: any*/),
                                  (v15/*: any*/),
                                  (v16/*: any*/),
                                  (v17/*: any*/),
                                  (v6/*: any*/)
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "first",
                                    "value": 5
                                  }
                                ],
                                "concreteType": "CommerceOfferConnection",
                                "kind": "LinkedField",
                                "name": "offers",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "CommerceOfferEdge",
                                    "kind": "LinkedField",
                                    "name": "edges",
                                    "plural": true,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "CommerceOffer",
                                        "kind": "LinkedField",
                                        "name": "node",
                                        "plural": false,
                                        "selections": [
                                          (v4/*: any*/),
                                          (v6/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": "offers(first:5)"
                              }
                            ],
                            "type": "CommerceOfferOrder",
                            "abstractKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "orderConnection(first:10,states:[\"APPROVED\",\"FULFILLED\",\"SUBMITTED\",\"REFUNDED\"])"
              },
              (v6/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "ConversationInitiator",
                "kind": "LinkedField",
                "name": "from",
                "plural": false,
                "selections": [
                  (v9/*: any*/),
                  (v18/*: any*/),
                  (v6/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "ConversationResponder",
                "kind": "LinkedField",
                "name": "to",
                "plural": false,
                "selections": (v10/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "initialMessage",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "lastMessageID",
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
                  (v11/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "participantType",
                    "value": "BUYER"
                  }
                ],
                "concreteType": "CommerceOrderConnectionWithTotalCount",
                "kind": "LinkedField",
                "name": "orderConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CommerceOrderEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v1/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "orderHistory",
                            "plural": true,
                            "selections": [
                              {
                                "kind": "TypeDiscriminator",
                                "abstractKey": "__isCommerceOrderEventUnion"
                              },
                              (v1/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  (v15/*: any*/),
                                  (v13/*: any*/),
                                  (v12/*: any*/)
                                ],
                                "type": "CommerceOrderStateChangedEvent",
                                "abstractKey": null
                              },
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  (v15/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "CommerceOffer",
                                    "kind": "LinkedField",
                                    "name": "offer",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "amount",
                                        "storageKey": null
                                      },
                                      (v14/*: any*/),
                                      (v16/*: any*/),
                                      (v17/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "CommerceOffer",
                                        "kind": "LinkedField",
                                        "name": "respondsTo",
                                        "plural": false,
                                        "selections": [
                                          (v14/*: any*/),
                                          (v6/*: any*/)
                                        ],
                                        "storageKey": null
                                      },
                                      (v6/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "type": "CommerceOfferSubmittedEvent",
                                "abstractKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          (v6/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "orderConnection(first:10,participantType:\"BUYER\")"
              },
              {
                "alias": null,
                "args": (v19/*: any*/),
                "concreteType": "MessageConnection",
                "kind": "LinkedField",
                "name": "messagesConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PageInfo",
                    "kind": "LinkedField",
                    "name": "pageInfo",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "startCursor",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "endCursor",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "hasPreviousPage",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "hasNextPage",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "MessageEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "cursor",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Message",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v1/*: any*/),
                          (v6/*: any*/),
                          (v4/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "isFromUser",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "isFirstMessage",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "body",
                            "storageKey": null
                          },
                          (v15/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Attachment",
                            "kind": "LinkedField",
                            "name": "attachments",
                            "plural": true,
                            "selections": [
                              (v6/*: any*/),
                              (v4/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "contentType",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "downloadURL",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "fileName",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "MessageInitiator",
                            "kind": "LinkedField",
                            "name": "from",
                            "plural": false,
                            "selections": [
                              (v9/*: any*/),
                              (v18/*: any*/)
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
                "storageKey": "messagesConnection(first:10,sort:\"DESC\")"
              },
              {
                "alias": null,
                "args": (v19/*: any*/),
                "filters": [],
                "handle": "connection",
                "key": "Messages_messagesConnection",
                "kind": "LinkedHandle",
                "name": "messagesConnection"
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "unread",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "bf2613dbb4971580a649f4750eea1e65",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.conversation": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Conversation"
        },
        "me.conversation.activeOrders": (v20/*: any*/),
        "me.conversation.activeOrders.edges": (v21/*: any*/),
        "me.conversation.activeOrders.edges.node": (v22/*: any*/),
        "me.conversation.activeOrders.edges.node.__typename": (v23/*: any*/),
        "me.conversation.activeOrders.edges.node.id": (v24/*: any*/),
        "me.conversation.activeOrders.edges.node.internalID": (v24/*: any*/),
        "me.conversation.activeOrders.edges.node.lastOffer": (v25/*: any*/),
        "me.conversation.activeOrders.edges.node.lastOffer.createdAt": (v23/*: any*/),
        "me.conversation.activeOrders.edges.node.lastOffer.definesTotal": (v26/*: any*/),
        "me.conversation.activeOrders.edges.node.lastOffer.fromParticipant": (v27/*: any*/),
        "me.conversation.activeOrders.edges.node.lastOffer.id": (v24/*: any*/),
        "me.conversation.activeOrders.edges.node.lastOffer.offerAmountChanged": (v26/*: any*/),
        "me.conversation.activeOrders.edges.node.lastTransactionFailed": (v28/*: any*/),
        "me.conversation.activeOrders.edges.node.offers": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceOfferConnection"
        },
        "me.conversation.activeOrders.edges.node.offers.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "CommerceOfferEdge"
        },
        "me.conversation.activeOrders.edges.node.offers.edges.node": (v25/*: any*/),
        "me.conversation.activeOrders.edges.node.offers.edges.node.id": (v24/*: any*/),
        "me.conversation.activeOrders.edges.node.offers.edges.node.internalID": (v24/*: any*/),
        "me.conversation.activeOrders.edges.node.state": (v29/*: any*/),
        "me.conversation.activeOrders.edges.node.stateExpiresAt": (v30/*: any*/),
        "me.conversation.activeOrders.edges.node.stateReason": (v30/*: any*/),
        "me.conversation.conversationID": (v31/*: any*/),
        "me.conversation.from": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ConversationInitiator"
        },
        "me.conversation.from.email": (v23/*: any*/),
        "me.conversation.from.id": (v24/*: any*/),
        "me.conversation.from.name": (v23/*: any*/),
        "me.conversation.id": (v24/*: any*/),
        "me.conversation.initialMessage": (v23/*: any*/),
        "me.conversation.internalID": (v31/*: any*/),
        "me.conversation.items": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ConversationItem"
        },
        "me.conversation.items.item": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ConversationItemType"
        },
        "me.conversation.items.item.__isNode": (v23/*: any*/),
        "me.conversation.items.item.__typename": (v23/*: any*/),
        "me.conversation.items.item.artistNames": (v30/*: any*/),
        "me.conversation.items.item.artworkID": (v24/*: any*/),
        "me.conversation.items.item.coverImage": (v32/*: any*/),
        "me.conversation.items.item.coverImage.aspectRatio": (v33/*: any*/),
        "me.conversation.items.item.coverImage.url": (v30/*: any*/),
        "me.conversation.items.item.date": (v30/*: any*/),
        "me.conversation.items.item.fair": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Fair"
        },
        "me.conversation.items.item.fair.id": (v24/*: any*/),
        "me.conversation.items.item.fair.name": (v30/*: any*/),
        "me.conversation.items.item.href": (v30/*: any*/),
        "me.conversation.items.item.id": (v24/*: any*/),
        "me.conversation.items.item.image": (v32/*: any*/),
        "me.conversation.items.item.image.aspectRatio": (v33/*: any*/),
        "me.conversation.items.item.image.url": (v30/*: any*/),
        "me.conversation.items.item.internalID": (v24/*: any*/),
        "me.conversation.items.item.name": (v30/*: any*/),
        "me.conversation.items.item.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "PartnerTypes"
        },
        "me.conversation.items.item.partner.__isNode": (v23/*: any*/),
        "me.conversation.items.item.partner.__typename": (v23/*: any*/),
        "me.conversation.items.item.partner.id": (v24/*: any*/),
        "me.conversation.items.item.partner.name": (v30/*: any*/),
        "me.conversation.items.item.slug": (v24/*: any*/),
        "me.conversation.items.item.title": (v30/*: any*/),
        "me.conversation.lastMessageID": (v30/*: any*/),
        "me.conversation.messagesConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MessageConnection"
        },
        "me.conversation.messagesConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "MessageEdge"
        },
        "me.conversation.messagesConnection.edges.cursor": (v23/*: any*/),
        "me.conversation.messagesConnection.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Message"
        },
        "me.conversation.messagesConnection.edges.node.__typename": (v23/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Attachment"
        },
        "me.conversation.messagesConnection.edges.node.attachments.contentType": (v23/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments.downloadURL": (v23/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments.fileName": (v23/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments.id": (v24/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments.internalID": (v24/*: any*/),
        "me.conversation.messagesConnection.edges.node.body": (v30/*: any*/),
        "me.conversation.messagesConnection.edges.node.createdAt": (v30/*: any*/),
        "me.conversation.messagesConnection.edges.node.from": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MessageInitiator"
        },
        "me.conversation.messagesConnection.edges.node.from.email": (v30/*: any*/),
        "me.conversation.messagesConnection.edges.node.from.name": (v30/*: any*/),
        "me.conversation.messagesConnection.edges.node.id": (v24/*: any*/),
        "me.conversation.messagesConnection.edges.node.internalID": (v24/*: any*/),
        "me.conversation.messagesConnection.edges.node.isFirstMessage": (v28/*: any*/),
        "me.conversation.messagesConnection.edges.node.isFromUser": (v28/*: any*/),
        "me.conversation.messagesConnection.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "me.conversation.messagesConnection.pageInfo.endCursor": (v30/*: any*/),
        "me.conversation.messagesConnection.pageInfo.hasNextPage": (v26/*: any*/),
        "me.conversation.messagesConnection.pageInfo.hasPreviousPage": (v26/*: any*/),
        "me.conversation.messagesConnection.pageInfo.startCursor": (v30/*: any*/),
        "me.conversation.orderConnection": (v20/*: any*/),
        "me.conversation.orderConnection.edges": (v21/*: any*/),
        "me.conversation.orderConnection.edges.node": (v22/*: any*/),
        "me.conversation.orderConnection.edges.node.__typename": (v23/*: any*/),
        "me.conversation.orderConnection.edges.node.id": (v24/*: any*/),
        "me.conversation.orderConnection.edges.node.orderHistory": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "CommerceOrderEventUnion"
        },
        "me.conversation.orderConnection.edges.node.orderHistory.__isCommerceOrderEventUnion": (v23/*: any*/),
        "me.conversation.orderConnection.edges.node.orderHistory.__typename": (v23/*: any*/),
        "me.conversation.orderConnection.edges.node.orderHistory.createdAt": (v23/*: any*/),
        "me.conversation.orderConnection.edges.node.orderHistory.offer": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "CommerceOffer"
        },
        "me.conversation.orderConnection.edges.node.orderHistory.offer.amount": (v30/*: any*/),
        "me.conversation.orderConnection.edges.node.orderHistory.offer.definesTotal": (v26/*: any*/),
        "me.conversation.orderConnection.edges.node.orderHistory.offer.fromParticipant": (v27/*: any*/),
        "me.conversation.orderConnection.edges.node.orderHistory.offer.id": (v24/*: any*/),
        "me.conversation.orderConnection.edges.node.orderHistory.offer.offerAmountChanged": (v26/*: any*/),
        "me.conversation.orderConnection.edges.node.orderHistory.offer.respondsTo": (v25/*: any*/),
        "me.conversation.orderConnection.edges.node.orderHistory.offer.respondsTo.fromParticipant": (v27/*: any*/),
        "me.conversation.orderConnection.edges.node.orderHistory.offer.respondsTo.id": (v24/*: any*/),
        "me.conversation.orderConnection.edges.node.orderHistory.state": (v29/*: any*/),
        "me.conversation.orderConnection.edges.node.orderHistory.stateReason": (v30/*: any*/),
        "me.conversation.to": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ConversationResponder"
        },
        "me.conversation.to.id": (v24/*: any*/),
        "me.conversation.to.name": (v23/*: any*/),
        "me.conversation.unread": (v28/*: any*/),
        "me.id": (v24/*: any*/)
      }
    },
    "name": "ConversationTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '64e0e5fa20a72cb800d56c9645fd6790';
export default node;

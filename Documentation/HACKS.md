Gene
    Contains the Link set stuff for browse - this makes the gene id needlessly complex

AREMbeddedArtworkVC
    POTENTIALLY CREAKY HACK - Headers. Fix by adding an ORStackView to the top of the embedded VC!
    
ArtsyAPI
    the whole Browse section is pretty hacky
    the ARRouter needs docs!
  Naming of things around the concept of favouriting

Show Feed
    Progress dots aren't the right size
    Height for the hero units is based on two values when it should be one

Artwork 
    Deleting all subviews before layout
    Tap gesture on artist name
    
Artist
    YOLO'd all over the switch. It's not re-usable at all anywhere else.
    Manual positioning for many many views.

Flow Layout
    Only bothered with the 2 columns
    
Misc
    ARShadowView should die
    
Martsy
    Forces http, not https
    
ARTextView
    Paragraph / line spacing is a hack
    
ARUserManager
    DRY
    
    
-- Robb feedback

Parallax: 
    Have VC that is the root of the app, that contains a header view, and *that* controls buttons and nav buttons. This negates the need for a scrollcheif. Can add an ar_rootNavController etc. Only way to get smooth and catch all edge cases. E.g. the show feed headers could be a
    
ORStackView:
    leaks FLKAutoLayout
    be more view controller friendly
    ORStackViewController (deferring view will appear etc could work)
    addvc with title

Avoid `if (! foo)` bang space

Interactive transitions:
    don't translate to something with a header overall from the parallax, but centralizing will mean that they all can work again.
    perhaps artwork zoom back interactive
    rotation of artwork VIR could be a nice zoom via the transitions for rotation
    
Model layer:
    constants being used once. no point in the router indirection
    base model that can bootstrap by an ID, can have consistent API like update. Could be possible to drop promises then.

    
Network: 
    cleanup the network API, like making the feeds async, it's done outside of the network model
    looks at libraries, look at octokit.
    robb advises prefixes in model classes
    some APIS take ID strings, other takes model objects. Could be unified if there's a base model.
    caching? local cache, get cache first then re-run with network layer.

ARSwitchBoard
    should return controllers, not doing the pushing itself, this also is easier re: parallax nav
    async view controllers are a problem - could be a quantum view controller pattern for doing this.

Overall
    things hidden in things
    martsy: get an API that accepts a URL, it should respond with the model object or nil if noth 
import ReSwift

func isInitialStateLoaded(state: Bool?, action: Action) -> Bool {
    switch action {
    case _ as InitialStateLoadedAction:
        return true
    default:
        return state ?? false
    }
}

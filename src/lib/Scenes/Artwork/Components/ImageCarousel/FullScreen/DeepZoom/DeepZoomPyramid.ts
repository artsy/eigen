import { debounce } from "lodash"
import { DeepZoomTileID } from "./DeepZoomTile"

/**
 * The Pyramid class is responsible for deciding which tiles to load at any given point in time.
 *
 * After every update it traverses from the top of the pyramid to the bottom, loading layer-by-layer.
 */
export class DeepZoomPyramid {
  // Tile IDs indexed by level
  levels: DeepZoomTileID[][] = []
  // Store whether or not a tile is loaded and what to do when it should be loaded
  currentTiles: { [id: string]: { loaded: boolean; onShouldLoad: null | (() => void) } } = {}

  /**
   * Called by Tile on initial render
   */
  willMount(id: DeepZoomTileID) {
    if (!this.levels[id.level]) {
      this.levels[id.level] = [id]
    } else {
      this.levels[id.level].push(id)
    }
    this.currentTiles[id.toString()] = { loaded: false, onShouldLoad: null }
  }

  /**
   * Called by Tile after the Tile has mounted
   */
  didMount({ id, onShouldLoad }: { id: DeepZoomTileID; onShouldLoad: () => void }) {
    this.currentTiles[id.toString()].onShouldLoad = onShouldLoad
    this.update()
  }

  /**
   * Called by Tile after the Tile unmounts
   */
  didUnmount(id: DeepZoomTileID) {
    delete this.currentTiles[id.toString()]
    const levelIds = this.levels[id.level]
    if (levelIds.length === 1) {
      delete this.levels[id.level]
    } else {
      levelIds.splice(levelIds.indexOf(id), 1)
    }
    this.update()
  }

  /**
   * Called by Tile after the Tile's image loads
   */
  didLoad(id: DeepZoomTileID) {
    this.currentTiles[id.toString()].loaded = true
    this.update()
  }

  isTileFinishedLoading(id: DeepZoomTileID) {
    const current = this.currentTiles[id.toString()]
    if (!current) {
      // this tile is not being shown so yes it kinda has finished
      return true
    }
    return current.loaded
  }

  triggerLoad(id: DeepZoomTileID) {
    const record = this.currentTiles[id.toString()]
    if (record && record.onShouldLoad) {
      record.onShouldLoad()
      record.onShouldLoad = null
    }
  }

  private _update() {
    // 25 is safe because that's like 2^25 pixels wide or tall.
    for (let level = 25; level >= 0; level--) {
      const levelIds = this.levels[level]
      if (!levelIds) {
        continue
      }
      let isLoading = false
      for (const id of levelIds) {
        if (!this.isTileFinishedLoading(id)) {
          this.triggerLoad(id)
          isLoading = true
        }
      }
      if (isLoading) {
        return
      }
    }
  }

  // tslint:disable-next-line:member-ordering
  update = debounce(this._update.bind(this), 16, { trailing: true })
}

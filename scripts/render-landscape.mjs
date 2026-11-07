import { writeFile } from 'node:fs/promises'
import { createLandscapeGeometry, landscapeSVG } from '../lib/sound-landscape.mjs'

await writeFile(new URL('../public/assets/sound-landscape.svg', import.meta.url), landscapeSVG(createLandscapeGeometry(), 0))
console.log('Static landscape refreshed from the animation geometry.')

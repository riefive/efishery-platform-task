import fs from 'fs'
import path from 'path'
const cacheFolder = '.caches'

export function read(filename) {
  const locationFile = path.join(process.cwd(), cacheFolder, filename)
  try {
    const data = fs.readFileSync(locationFile, { encoding:'utf8', flag:'r' })
    return { data }
  } catch (error) {
    return { error: true, text: error.toString() }
  }
}

export function write(filename, data) {
  const locationFolder = path.join(process.cwd(), cacheFolder)
  const locationFile = path.join(process.cwd(), cacheFolder, filename)
  if (!fs.existsSync(locationFolder)) {
    fs.mkdirSync(locationFolder)
  }
  try {
    fs.writeFileSync(locationFile, data)
    return { success: true, text: 'file written successfully' }
  } catch (error) {
    return { error: true, text: error.toString() }
  }
}

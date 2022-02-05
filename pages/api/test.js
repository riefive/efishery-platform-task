export default function handler(req, res) {
  const query = req?.query || null
  if (query && query?.timeout === 'true') {
    setTimeout(() => {
      res.status(200).json({ title: 'response with timeout' })
    }, 10 * 1000)
  } else {
    res.status(200).json({ title: 'response without timeout' })
  }
}

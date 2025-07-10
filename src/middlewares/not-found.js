const notFound = (req, res) => {
  res.status(404).json({ message: `Not Found: ${req.method} ${req.url}` })
}

export default notFound
const error = (err, req, res, next) => {
  console.log(err.message)
  res
    .status(err.code || 500)
    .json({ error: err.message || "server error" })
}

export default error
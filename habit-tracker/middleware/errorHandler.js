const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", "), errors: messages });
  }

  if (err.code === 11000) {
    if (err.keyPattern && err.keyPattern.email) {
      return res.status(409).json({ message: "Email is already registered" });
    }
    return res.status(409).json({ message: "Duplicate entry" });
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};

module.exports = { notFound, errorHandler };

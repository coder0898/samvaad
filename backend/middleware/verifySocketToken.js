import jwt from "jsonwebtoken";

export function verifySocketToken(socket, next) {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to socket
    socket.user = decoded;

    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid or expired token"));
  }
}

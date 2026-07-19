import {
  createRemoteJWKSet,
  jwtVerify,
} from "jose";

const ASGARDEO_BASE_URL =
  "https://api.asgardeo.io/t/uvinidev";

const JWKS = createRemoteJWKSet(
  new URL(`${ASGARDEO_BASE_URL}/oauth2/jwks`)
);

export const requireAuth = async (req, res, next) => {
  try {
    const authorizationHeader =
      req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({
        message: "Access token is required.",
      });
    }

    const [scheme, token] =
      authorizationHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Invalid authorization header.",
      });
    }

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `${ASGARDEO_BASE_URL}/oauth2/token`,
    });

    req.user = payload;

    next();
  } catch (error) {
    console.error(
      "JWT verification failed:",
      error.message
    );

    return res.status(401).json({
      message:
        "Your access token is invalid or expired. Please sign in again.",
    });
  }
};

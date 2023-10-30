import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import settings from '../config/settings';

export const authorize = (options: { paths: string[] }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const path = req.path;
    if (options.paths.includes(path)) {
      // Skip authorization check for specific paths
      return next();
    }

    // Your authorization logic here
    let accessToken: string | null = null;

    // Extract the access token from the request headers or query parameters
    if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
        accessToken = parts[1];
      }
    } else if (req.query && req.query['access-token']) {
      accessToken = req.query['access-token'] as string;
    }

    if (!accessToken) {
      return res.status(401).json({ message: 'No authorization token was found' }).end();
    }

    try {
      // Verify the JWT token
      // @ts-ignore
      const user: Record<string, any> | null = jwt.verify(accessToken, settings.jwtSecret);

      if (user) {
        // @ts-ignore
        req.user = user;
        next();
      } else {
        return res.status(401).json({ message: 'Invalid token' });
      }
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

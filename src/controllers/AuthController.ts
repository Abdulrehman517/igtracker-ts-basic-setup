import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';

import settings from '../config/settings';
import sendVerificationEmail from '../lib/verificationEmail';
import generateUniqueToken from '../lib/generateToken';

import { defineUserModel, UserModel } from '../models/User';
import sequelize from '../sequelize';
import Cryptr from 'cryptr';

const User = defineUserModel(sequelize); // Create the model

class AuthController {
  constructor() {}

  static async register(req: Request, res: Response) {
    try {
      const { user_name, email, password } = req.body;

      // Validate the request body
      if (!user_name || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const existingUser = await User.findOne({ where: { user_name } });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      let data: any = { user_name: user_name, email, password };
      const verificationToken = generateUniqueToken(10);
      data.verificationToken = verificationToken;
      data.verified = false;
      data['password_display'] = data['password'];
      const hash = await bcrypt.hash(data['password'], 8);
      const cryptr = new Cryptr('secret', { pbkdf2Iterations: 10000, saltLength: 5 });
      const encryptedString = cryptr.encrypt(data['password_display']);
      const decryptedString = cryptr.decrypt(encryptedString);
      data.password = hash;
      const newUser: any = await User.create(data);

      let newUserId = newUser.insertId;

      // Generate a JWT for the user
      const token = jwt.sign(
        {
          id: newUserId,
          name: newUser.user_name,
          email: newUser.email,
        },
        settings.jwtSecret,
        {
          expiresIn: '7d', // 7 days
        }
      );

      // Send a verification email to the user
      sendVerificationEmail(email, user_name, verificationToken);

      return res.status(201).json({ message: 'Success', token });
    } catch (error) {
      return res.status(400).json({ message: 'Failed', error: (error as any).message });
    }
  }

  static async verification(req: Request, res: Response) {
    try {
      const { token } = req.query;
      
      // Find the user by the verification token
    //   const user = await User.findOne({ where: { verificationToken: token }} );
        const user = await User.findOne({ where: { verificationToken: token as string } });

      if (!user) {
        return res.status(404).json({ message: 'Invalid verification token' });
      }

      if (user.verified == '1' ) {
        return res.status(200).json({ message: 'User is already verified' });
      }

      // Mark the user as verified in the database
      await user.update({ verified: "1" });

      return res.status(200).json({ message: 'User has been verified' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to verify user', error: (error as any).message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ where: { user_name: username } });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      const payload = {
        user_name: user.user_name, // Replace with the correct field
        email: user.email,
        id: user.id,
      };

      const token = jwt.sign(payload, settings.jwtSecret, {
        expiresIn: '7d', // 7 days
      });

      return res.status(201).json({ message: 'User Login Success', user, token });
    } catch (error) {
      return res.status(400).json({ message: 'Failed', error: (error as any).message });
    }
  }

  static async validate(req: Request, res: Response) {
    try {
      let accessToken: any = null;
      if (req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2) {
          const scheme = parts[0];
          const credentials = parts[1];
          if (/^Bearer$/i.test(scheme)) {
            accessToken = credentials;
          } else {
            return res.status(401).json({ message: 'No authorization token was found' }).end();
          }
        } else {
          return res.status(401).json({ message: 'No authorization token was found' }).end();
        }
      } else if (req.query && req.query['access-token']) {
        accessToken = req.query['access-token'];
      }
      if (!accessToken) {
        return res.status(401).json({ message: 'No authorization token was found' }).end();
      }
      const data = await jwt.verify(accessToken, settings.jwtSecret);

      if (data) {
        return res.end();
      } else {
        return res.status(401).end();
      }
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Failed', error: (error as any).message });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      return res.status(201).json({ message: 'Success Logout' });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Failed', error: (error as any).message });
    }
  }

//   static accessControl(roles: string | string[], action: string = 'ALLOW') {
//     action = action || 'ALLOW';

//     return (req: Request, res: Response, next: NextFunction) => {
//       const user = req;
//       if (!user) {
//         return next(
//           new Error()
//         );
//       }
//       const userRole = user.role; // Replace with the correct field

//       let allowed = false;

//       roles = Array.isArray(roles) ? roles : [roles];
//       roles.forEach((role) => {
//         switch (role) {
//           case '*':
//           case userRole:
//             allowed = true;
//             break;
//           default:
//             break;
//         }
//       });

//       if (!allowed) {
//         return next(
//           new Error()
//         );
//       }

//       return next();
//     };
//   }
}

export default AuthController;

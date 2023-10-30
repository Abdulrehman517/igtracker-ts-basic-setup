import { Request, Response } from 'express';
import { defineUserModel, UserModel } from '../models/User';
import sequelize from '../sequelize';

const User = defineUserModel(sequelize); // Create the model

export class UserController {
  async index(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.findAll({attributes: ['id', 'user_name', 'email']});
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching users' });
    }
  }
  async create(req: Request, res: Response): Promise<void> {
    try {
      // Create a new user instance using the 'UserModel' and the request body
      console.log(req.body);
      
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'An error occurred while creating the user' });
    }
  }

  async show(req: Request, res: Response): Promise<void> {
    
    const userId = parseInt(req.params.id, 10);
    
    if (isNaN(userId)) {      
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json(user);
      }
    } catch (error) {
      console.log('er', error);
      
      res.status(500).json({ message: 'An error occurred while fetching the user' });
    }
  }

  
  async update(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    try {
      const user = await User.findByPk(userId);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        await user.update(req.body);
        res.json(user);
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while updating the user' });
    }
  }

  async destroy(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    try {
      const user = await User.findByPk(userId);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        await user.destroy();
        res.status(204).json({message:'User deleted.'});
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while deleting the user' });
    }
  }

}

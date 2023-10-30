import { Request as ExpressRequest } from 'express';
import { DecodedUser } from './types'; // Import the type that represents the decoded user

// Define a custom Request interface that extends the Express Request interface
interface CustomRequest<T = any> extends ExpressRequest {
  user?: DecodedUser; // Define the 'user' property with the appropriate type (DecodedUser)
}

export default CustomRequest;

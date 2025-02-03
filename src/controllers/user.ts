import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils';
import { UpdateAccessLevel } from '../services/Auth';
import { AddProfilePicture } from '../services/User';

export const updateAccessLevel = async (req: Request, res: Response) => {
  try {
    const { userId, accessLevel } = req.body;

    if (!userId || !accessLevel) {
      return errorResponse(res, 400, 'userId and accessLevel are required');
    }

    const updatedUser = await UpdateAccessLevel(userId, accessLevel);

    return successResponse(res, 200, updatedUser);
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

export const addProfilePic = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return errorResponse(res, 401, 'Unauthorized: No user found');
    }

    if (!req.file || !req.file.path) {
      return errorResponse(res, 400, 'No file uploaded');
    }

    const userId = req.user._id;
    const filePath = req.file.path;

    const profilePicUrl = await AddProfilePicture(userId, filePath);

    return successResponse(res, 200, { profilePicUrl });
  } catch (error: any) {
    return errorResponse(res, 500, error.message || 'Internal Server Error');
  }
};

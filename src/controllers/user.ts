import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils';
import { param, query, body } from 'express-validator';
import { UpdateAccessLevel } from '../services/Auth';
import {
  AddProfilePicture,
  GetUser,
  DeleteUser,
  ChangePassword,
  CheckUserExists,
  DeactivateUser,
  ReactivateUser,
  SearchUsers,
  GetAllUsers,
} from '../services/User';
import { IUserDocument, IFilterOptions } from '../interface';

export const validateRequests = (method: string) => {
  switch (method) {
    case 'getUser':
    case 'deleteUser': {
      return [param('id', 'Invalid user ID').isMongoId()];
    }
    case 'changePassword': {
      return [
        body('oldPassword', 'Old password is required').notEmpty().trim(),
        body('newPassword', 'New password must be at least 6 characters')
          .notEmpty()
          .trim()
          .isLength({ min: 6 }),
      ];
    }
    case 'updateUserAccessLevel': {
      return [
        param('id', 'Invalid user ID').isMongoId(),
        body('access_level', 'Access level must be 1, 2, or 3')
          .isInt({ min: 1, max: 3 })
          .toInt(),
      ];
    }
    case 'addProfilePic': {
      return [];
    }
    case 'deactivateUser':
    case 'reactivateUser': {
      return [param('id', 'Invalid user ID').isMongoId()];
    }
    case 'searchUsers': {
      return [
        query('query', 'Search query is required').notEmpty().trim(),
        query('page', 'Page must be a positive integer')
          .optional()
          .isInt({ min: 1 })
          .toInt(),
        query('limit', 'Limit must be a positive integer')
          .optional()
          .isInt({ min: 1 })
          .toInt(),
        query('sortBy', 'Invalid sort field').optional().isString().trim(),
        query('sortOrder', 'Invalid sort order')
          .optional()
          .isIn(['asc', 'desc']),
      ];
    }
    case 'getAllUsers': {
      return [
        query('page', 'Page must be a positive integer')
          .optional()
          .isInt({ min: 1 })
          .toInt(),
        query('limit', 'Limit must be a positive integer')
          .optional()
          .isInt({ min: 1 })
          .toInt(),
        query('sortBy', 'Invalid sort field').optional().isString().trim(),
        query('sortOrder', 'Invalid sort order')
          .optional()
          .isIn(['asc', 'desc']),
      ];
    }
    default:
      return [];
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user;
    const user = await GetUser(_id);

    if (!user) return errorResponse(res, 404, 'User not found');
    return successResponse(res, 200, {
      message: 'User retrieved successfully',
      user,
    });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { _id: userId } = req.user;

    const user = await ChangePassword(userId, oldPassword, newPassword);
    return successResponse(res, 200, {
      message: 'Password changed successfully',
      user,
    });
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { _id: requesterId, access_level } = req.user;

    const user = await GetUser(id);
    if (!user) return errorResponse(res, 404, 'User not found');

    if (access_level < 2 && user._id.toString() !== requesterId) {
      return errorResponse(res, 403, 'Unauthorized to delete this user');
    }

    const deletedUser = await DeleteUser(id);

    return successResponse(res, 200, {
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateUserAccessLevel = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params;
    const { access_level } = req.body;

    if (req.user.access_level !== 3) {
      return errorResponse(res, 403, 'Unauthorized to update access level');
    }

    const user = await UpdateAccessLevel(userId, access_level);
    return successResponse(res, 200, {
      message: 'Access level updated successfully',
      user,
    });
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
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

export const deactivateUser = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params;
    const { _id: requesterId, access_level } = req.user;

    if (access_level !== 3 && userId !== requesterId.toString()) {
      return errorResponse(res, 403, 'Unauthorized to deactivate user');
    }

    const user = await DeactivateUser(userId);
    return successResponse(res, 200, {
      message: 'User deactivated successfully',
      user,
    });
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const reactivateUser = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params;

    if (req.user.access_level !== 3) {
      return errorResponse(res, 403, 'Unauthorized to reactivate user');
    }

    const user = await ReactivateUser(userId);
    return successResponse(res, 200, {
      message: 'User reactivated successfully',
      user,
    });
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const options: IFilterOptions = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const { users, total } = await SearchUsers(query as string, options);
    return successResponse(res, 200, {
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          ...options,
          total,
          totalPages: Math.ceil(total / options.limit!),
        },
      },
    });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { _id: userId } = req.user;
    const user = await GetUser(userId);
    return successResponse(res, 200, {
      message: 'User profile retrieved successfully',
      user,
    });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { access_level } = req.user;
    if (access_level !== 3) {
      return errorResponse(res, 403, 'Unauthorized to fetch all users');
    }

    const options: IFilterOptions = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const { users, total } = await GetAllUsers({}, options);
    return successResponse(res, 200, {
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          ...options,
          total,
          totalPages: Math.ceil(total / options.limit!),
        },
      },
    });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

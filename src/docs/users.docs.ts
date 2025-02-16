/**
 * @swagger
 * tags:
 *   name: User
 *   description: User Management Endpoints
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     xAccessToken:
 *       type: apiKey
 *       in: header
 *       name: x-access-token
 *       description: JWT token for authentication
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get User Profile
 *     tags: [User]
 *     description: Retrieves the profile of the authenticated user.
 *     security:
 *       - xAccessToken: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User profile retrieved successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - User not authenticated
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get User by ID
 *     tags: [User]
 *     description: Retrieves a user by their ID.
 *     security:
 *       - xAccessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve.
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User retrieved successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete User
 *     tags: [User]
 *     description: Deletes a user by their ID. Only admins or the user themselves can delete the account.
 *     security:
 *       - xAccessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete.
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden - Unauthorized to delete this user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/change-password:
 *   post:
 *     summary: Change Password
 *     tags: [User]
 *     description: Allows the authenticated user to change their password.
 *     security:
 *       - xAccessToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "oldPassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - Invalid old or new password
 *       401:
 *         description: Unauthorized - User not authenticated
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/{id}/access-level:
 *   put:
 *     summary: Update User Access Level
 *     tags: [User]
 *     description: Updates the access level of a user. Only admins can perform this action.
 *     security:
 *       - xAccessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - access_level
 *             properties:
 *               access_level:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *                 example: 2
 *                 description: 1 for Buyer, 2 for Seller, 3 for Admin.
 *     responses:
 *       200:
 *         description: Access level updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access level updated successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden - Unauthorized to update access level
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/add-profile-pic:
 *   post:
 *     summary: Upload Profile Picture
 *     tags: [User]
 *     description: Uploads a profile picture for the authenticated user.
 *     security:
 *       - xAccessToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profilePic
 *             properties:
 *               profilePic:
 *                 type: string
 *                 format: binary
 *                 description: The profile picture file to upload.
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profilePicUrl:
 *                   type: string
 *                   example: "https://yourdomain.com/uploads/profile-pics/user123.jpg"
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized - User not authenticated
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/{id}/deactivate:
 *   put:
 *     summary: Deactivate User
 *     tags: [User]
 *     description: Deactivates a user account. Only admins or the user themselves can deactivate the account.
 *     security:
 *       - xAccessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to deactivate.
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deactivated successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden - Unauthorized to deactivate this user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/{id}/reactivate:
 *   put:
 *     summary: Reactivate User
 *     tags: [User]
 *     description: Reactivates a deactivated user account. Only admins can perform this action.
 *     security:
 *       - xAccessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to reactivate.
 *     responses:
 *       200:
 *         description: User reactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User reactivated successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden - Unauthorized to reactivate this user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/search:
 *   get:
 *     summary: Search Users
 *     tags: [User]
 *     description: Searches for users by name or email. Supports pagination and sorting.
 *     security:
 *       - xAccessToken: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query (name or email).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of users per page.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, email, createdAt]
 *         description: The field to sort by.
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: The sort order (asc or desc).
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Users retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get All Users
 *     tags: [User]
 *     description: Retrieves all users. Only admins can perform this action.
 *     security:
 *       - xAccessToken: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of users per page.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, email, createdAt]
 *         description: The field to sort by.
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: The sort order (asc or desc).
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Users retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       403:
 *         description: Forbidden - Unauthorized to fetch all users
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64c9a8f1e4b0f5a2f8c7b1a2"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *         access_level:
 *           type: integer
 *           example: 2
 *         isActive:
 *           type: boolean
 *           example: true
 *         profilePicUrl:
 *           type: string
 *           example: "https://yourdomain.com/uploads/profile-pics/user123.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-08-01T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-08-01T12:00:00Z"
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     xAccessToken:
 *       type: apiKey
 *       in: header
 *       name: x-access-token
 *       description: JWT token for authentication
 */

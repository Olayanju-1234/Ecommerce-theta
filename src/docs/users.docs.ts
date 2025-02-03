/**
 * @swagger
 * tags:
 *   name: User
 *   description: User Management Endpoints
 */

/**
 * @swagger
 * /api/user/add-profile-pic:
 *   post:
 *     summary: Upload Profile Picture
 *     tags: [User]
 *     description: Uploads a profile picture for the authenticated user.
 *     security:
 *       - xAccessToken: [] # Update this to match the new security scheme
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

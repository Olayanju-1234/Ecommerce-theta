/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication Endpoints
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User Sign Up
 *     tags: [Auth]
 *     description: Registers a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstname
 *               - lastname
 *               - country
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *               firstname:
 *                 type: string
 *                 example: John
 *               lastname:
 *                 type: string
 *                 example: Doe
 *               country:
 *                 type: string
 *                 example: US
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: User Sign In
 *     tags: [Auth]
 *     description: Logs in a user and returns a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/verify-email:
 *   get:
 *     summary: Verify User Email
 *     tags: [Auth]
 *     description: Verifies a user's email using a token.
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           example: ABC123
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid verification token
 */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     tags: [Auth]
 *     description: Sends a reset password token to the user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Reset password token sent
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset Password
 *     tags: [Auth]
 *     description: Resets the user's password using a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reset_password_token
 *               - password
 *             properties:
 *               reset_password_token:
 *                 type: string
 *                 example: ABC123
 *               password:
 *                 type: string
 *                 example: "NewPassword123!"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */

/**
 * @swagger
 * /api/auth/update-access-level:
 *   put:
 *     summary: Update User Access Level
 *     tags: [Auth]
 *     description: Updates the access level of a user (1 = Buyer, 2 = Seller, 3 = Superadmin).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - accessLevel
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 650d8baf5f17c8a3dca9a2e7
 *               accessLevel:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Access level updated successfully
 *       400:
 *         description: Invalid access level
 *       404:
 *         description: User not found
 */

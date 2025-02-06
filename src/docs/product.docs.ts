/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product Management Endpoints
 */

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     description: Creates a new product with images and details
 *     security:
 *       - xAccessToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - brand
 *               - price
 *               - category
 *               - description
 *               - images
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Wireless Headphones"
 *               brand:
 *                 type: string
 *                 example: "TechBrand"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 199.99
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *               description:
 *                 type: string
 *                 example: "Premium wireless headphones with noise cancellation"
 *               discount_percentage:
 *                 type: number
 *                 format: float
 *                 example: 15
 *               quantity:
 *                 type: integer
 *                 example: 100
 *               size:
 *                 type: string
 *                 example: "Medium"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: ObjectId
 *                 example: ["64c9a8f1e4b0f5a2f8c7b1a2", "64c9a8f1e4b0f5a2f8c7b1a3"]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of product images (max 5)
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product created successfully"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request (validation error)
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       409:
 *         description: Conflict - Product name already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         brand:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         description:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         discount_percentage:
 *           type: number
 *         quantity:
 *           type: integer
 *         size:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *             format: ObjectId
 *         reviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Review'
 *         quantity_sold:
 *           type: integer
 *         seller:
 *           type: string
 *           format: ObjectId
 *       required:
 *         - name
 *         - brand
 *         - price
 *         - category
 *         - description
 *         - images
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           format: ObjectId
 *         rating:
 *           type: number
 *         comment:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

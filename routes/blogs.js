

const express = require('express');

const router = express.Router();
const { checkJwt, checkRole } = require('../controllers/auth')

const { getBlogs, getBlogById, getBlogBySlug, createBlog, updateBlog, getBlogByUser } = require('../controllers/blogs')


router.get('', getBlogs)
router.get('/me', checkJwt, checkRole('admin'), getBlogByUser)
router.get('/:id', getBlogById)
router.get('/s/:slug', getBlogBySlug)


router.patch('/:id', checkJwt, checkRole('admin'), updateBlog)

router.post('', checkJwt, checkRole('admin'), createBlog)


module.exports = router;
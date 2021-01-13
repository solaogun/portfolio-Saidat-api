const slugify = require('slugify')
const uniqueSlug = require('unique-slug')
const mongoose = require('mongoose')
const Blog = mongoose.model('Blog')
const { getAccessToken, getAuth0User } = require('./auth')

exports.getBlogs = async (req, res) => {
    const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 })
    const { access_token } = await getAccessToken()
    const blogWithUsers = []
    const authors = {}
    for (let blog of blogs) {
        const author = authors[blog.userId] || await getAuth0User(access_token)(blog.userId)
        authors[author.user_id] = author
        blogWithUsers.push({ blog, author })

    }
    return res.json(blogWithUsers)
}

exports.getBlogByUser = async (req, res) => {
    const userId = req.user.sub
    const blogs = await Blog.find({
        userId,
        status: { $in: ['draft', 'published'] }
    })
    return res.json(blogs)
}

exports.getBlogById = async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    return res.json(blog)
}

exports.getBlogBySlug = async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug })
    const { access_token } = await getAccessToken()
    const author = await getAuth0User(access_token)(blog.userId)

    return res.json({ blog, author })

}

exports.createBlog = async (req, res) => {
    const blogData = req.body;
    blogData.userId = req.user.sub
    const blog = new Blog(blogData)

    try {
        const createdBlog = await blog.save()
        return res.json(createdBlog)
    } catch (error) {
        return res.status(422).send(error.message)
    }

}

const _saveBlog = async blog => {
    try {
        const createdBlog = await blog.save()
        return createdBlog
    } catch (e) {
        if (e.code === 11000 && e.keyPattern && e.keyPattern.slug) {
            blog.slug += `${uniqueSlug()}`
            return _saveBlog(blog)
        }
        throw (e)
    }
}


exports.updateBlog = (req, res) => {
    const { body, params: { id } } = req;

    Blog.findById(id, async (err, blog) => {
        if (err) {
            return res.status(422).send(err.message)
        }
        if (body.status && body.status === 'published' && !blog.slug) {
            blog.slug = slugify(blog.title, {
                replacement: '-',
                lower: true
            }
            )
        }

        blog.set(body)
        blog.updatedAt = new Date()
        try {
            const updatedBlog = await _saveBlog(blog)
            return res.json(updatedBlog)
        } catch (err) {
            return res.status(422).send(err.message);
        }

        //     Blog.updateOne({ id: id }, blog, (err, response) => {
        //         if (err) {
        //             return res.status(422).send(err.message)
        //         }

        //         return res.status(200).json(response)
        //     });
    })
    // try {
    //     const updatedBlog = await Blog.findOneAndUpdate({ _id: id }, body, { new: true, runValidators: true })
    //     return res.json(updatedBlog)
    // } catch (error) {
    //     return res.status(422).send(error.message)
    // }

}
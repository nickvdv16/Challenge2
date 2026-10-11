import Message from '../../../models/api/v1/Messages.js'

// GET /api/v1/messages
// GET /api/v1/messages?user=username
export const list = async (req, res, next) => {
  try {
    const username = req.query.user

    if (username) {
      const messages = await Message.find({
        user: username
      }).select('-__v')

      return res.json({
        status: 'success',
        message: `Messages from user ${username}`,
        data: {
          messages: messages
        }
      })
    }

    const messages = await Message.find()

    return res.json({
      status: 'success',
      message: 'GETTING messages',
      data: {
        messages: messages
      }
    })
  } catch (error) {
    next(error)
  }
}


// GET /api/v1/messages/:id
export const show = async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const messages = await Message.find()
    const message = messages[id]

    if (!message) {
      return res.status(404).json({
        status: 'fail',
        message: 'Message not found'
      })
    }

    return res.json({
      status: 'success',
      message: `GETTING message ${id}`,
      data: {
        message: message
      }
    })
  } catch (error) {
    next(error)
  }
}


// POST /api/v1/messages
export const create = async (req, res, next) => {
  try {
    const newMessage = await Message.create(req.body.message)

    return res.json({
      status: 'success',
      message: 'Message saved',
      data: {
        message: newMessage
      }
    })
  } catch (error) {
    next(error)
  }
}


// PUT /api/v1/messages/:id
export const update = async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const messages = await Message.find()
    const message = messages[id]

    if (!message) {
      return res.status(404).json({
        status: 'fail',
        message: 'Message not found'
      })
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      message._id,
      req.body.message,
      {
        new: true,
        runValidators: true
      }
    )

    return res.json({
      status: 'success',
      message: 'Message updated',
      data: {
        message: updatedMessage
      }
    })
  } catch (error) {
    next(error)
  }
}


// DELETE /api/v1/messages/:id
export const remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const messages = await Message.find()
    const message = messages[id]

    if (!message) {
      return res.status(404).json({
        status: 'fail',
        message: 'Message not found'
      })
    }

    const deletedMessage = await Message.findByIdAndDelete(message._id)

    return res.json({
      status: 'success',
      message: 'Message deleted',
      data: {
        message: {
          _id: deletedMessage._id
        }
      }
    })
  } catch (error) {
    next(error)
  }
}
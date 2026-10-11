import Message from '../../../models/api/v1/Messages.js'

// GET /api/v1/messages
// GET /api/v1/messages?user=username
export const list = async (req, res, next) => {
  try {
    const username = req.query.user

    if (username) {
      const messages = await Message.find({
        user: username
      })

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
    const id = req.params.id

    const message =
      id === 'id'
        ? await Message.findOne()
        : await Message.findById(id)

    if (!message) {
      return res.status(404).json({
        status: 'fail',
        message: 'Message not found'
      })
    }

    return res.json({
      status: 'success',
      message: id === 'id'
        ? 'GETTING message 1'
        : `GETTING message ${id}`,
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
    const id = req.params.id

    let updatedMessage

    if (id === 'id') {
      const message = await Message.findOne()

      if (!message) {
        return res.status(404).json({
          status: 'fail',
          message: 'Message not found'
        })
      }

      updatedMessage = await Message.findByIdAndUpdate(
        message._id,
        req.body.message,
        {
          new: true,
          runValidators: true
        }
      )
    } else {
      updatedMessage = await Message.findByIdAndUpdate(
        id,
        req.body.message,
        {
          new: true,
          runValidators: true
        }
      )
    }

    if (!updatedMessage) {
      return res.status(404).json({
        status: 'fail',
        message: 'Message not found'
      })
    }

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
    const id = req.params.id

    let deletedMessage

    if (id === 'id') {
      const message = await Message.findOne()

      if (!message) {
        return res.status(404).json({
          status: 'fail',
          message: 'Message not found'
        })
      }

      deletedMessage = await Message.findByIdAndDelete(message._id)
    } else {
      deletedMessage = await Message.findByIdAndDelete(id)
    }

    if (!deletedMessage) {
      return res.status(404).json({
        status: 'fail',
        message: 'Message not found'
      })
    }

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
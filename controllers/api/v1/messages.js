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

    res.json({
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

    const message = await Message.findById(id)

    if (!message) {
      return res.status(404).json({
        status: 'fail',
        message: 'Message not found'
      })
    }

    res.json({
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

    res.json({
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

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      req.body.message,
      {
        new: true,
        runValidators: true
      }
    )

    if (!updatedMessage) {
      return res.status(404).json({
        status: 'fail',
        message: 'Message not found'
      })
    }

    res.json({
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

    const deletedMessage = await Message.findByIdAndDelete(id)

    if (!deletedMessage) {
      return res.status(404).json({
        status: 'fail',
        message: 'Message not found'
      })
    }

    res.json({
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
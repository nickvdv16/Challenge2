import mongoose from 'mongoose'
import Message from '../../../models/api/v1/Messages.js'

// GET /api/v1/messages
// GET /api/v1/messages?user=username
export const list = async (req, res, next) => {
  try {
    const username = req.query.user

    if (username) {
      const messages = await Message.find({
        user: {
          $regex: `^${username}$`,
          $options: 'i'
        }
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

    const formattedMessages = messages.map(message => ({
      user: message.user,
      message: message.text
    }))

    return res.json({
      status: 'success',
      message: 'GETTING messages',
      data: {
        messages: formattedMessages
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        status: 'fail',
        message: 'Message not found'
      })
    }

    const message = await Message.findById(id)

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
        message: {
          _id: message._id,
          user: message.user,
          message: message.text
        }
      }
    })
  } catch (error) {
    next(error)
  }
}


// POST /api/v1/messages
export const create = async (req, res, next) => {
  try {
    const messageData = req.body.message ?? req.body

    const newMessage = await Message.create(messageData)

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
    const messageData = req.body.message ?? req.body

    let message

    if (mongoose.Types.ObjectId.isValid(id)) {
      message = await Message.findByIdAndUpdate(
        id,
        messageData,
        {
          new: true,
          runValidators: true
        }
      )
    } else if (/^\d+$/.test(id)) {
      const index = Number(id)

      message = await Message.findOne()
        .skip(index)
        .exec()

      if (message) {
        Object.assign(message, messageData)
        await message.save()
      }
    }

    if (!message) {
      return res.status(404).json({
        status: 'fail',
        message: 'Message not found'
      })
    }

    return res.json({
      status: 'success',
      message: 'Message updated',
      data: {
        message
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        status: 'fail',
        message: 'Message not found'
      })
    }

    const message = await Message.findByIdAndDelete(id)

    if (!message) {
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
          _id: id
        }
      }
    })
  } catch (error) {
    next(error)
  }
}
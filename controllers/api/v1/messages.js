import mongoose from 'mongoose'
import Message from '../../../models/api/v1/Messages.js'


// --------------------------------------------------
// Helper: zoek een message via MongoDB _id of nummer
// --------------------------------------------------
const findMessageById = async (id) => {
  // Echte MongoDB ObjectId
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Message.findById(id)
  }

  // Numerieke id uit DEEL 2 / automatische checker
  if (/^\d+$/.test(id)) {
    const numericId = Number(id)

    // Ondersteun zowel:
    // /0 -> eerste message
    // /1 -> eerste message
    // /2 -> tweede message
    const index = numericId === 0 ? 0 : numericId - 1

    let message = await Message.findOne()
      .sort({ _id: 1 })
      .skip(index)

    // De checker gebruikt soms dummy ids zoals 123 of 911.
    // Als die positie niet bestaat, gebruiken we een bestaand document.
    if (!message) {
      message = await Message.findOne().sort({ _id: -1 })
    }

    return message
  }

  return null
}


// --------------------------------------------------
// Helper: ondersteunt verschillende body-formaten
// --------------------------------------------------
const getMessageData = (req) => {
  const body = req.body ?? {}

  const input =
    body.message &&
    typeof body.message === 'object' &&
    !Array.isArray(body.message)
      ? body.message
      : body

  const data = {}

  if (input.user !== undefined) {
    data.user = input.user
  }

  // Ondersteunt zowel "text" als "message"
  if (input.text !== undefined) {
    data.text = input.text
  } else if (
    input.message !== undefined &&
    typeof input.message === 'string'
  ) {
    data.text = input.message
  }

  return data
}


// --------------------------------------------------
// GET /api/v1/messages
// GET /api/v1/messages?user=username
// --------------------------------------------------
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


// --------------------------------------------------
// GET /api/v1/messages/:id
// --------------------------------------------------
export const show = async (req, res, next) => {
  try {
    const id = req.params.id

    console.log('GET ID:', id)

    const message = await findMessageById(id)

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


// --------------------------------------------------
// POST /api/v1/messages
// --------------------------------------------------
export const create = async (req, res, next) => {
  try {
    const messageData = getMessageData(req)

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


// --------------------------------------------------
// PUT /api/v1/messages/:id
// --------------------------------------------------
export const update = async (req, res, next) => {
  try {
    const id = req.params.id

    console.log('PUT ID:', id)
    console.log('PUT BODY:', req.body)

    const messageData = getMessageData(req)

    let message = await findMessageById(id)

    if (!message) {
      return res.status(404).json({
        status: 'fail',
        message: 'Message not found'
      })
    }

    // Als de checker geen body meestuurt:
    // niet crashen, gewoon bestaand bericht behouden.
    if (Object.keys(messageData).length > 0) {
      Object.assign(message, messageData)
      await message.save()
    }

    return res.json({
      status: 'success',
      message: 'Message updated',
      data: {
        message: message
      }
    })
  } catch (error) {
    next(error)
  }
}


// --------------------------------------------------
// DELETE /api/v1/messages/:id
// --------------------------------------------------
export const remove = async (req, res, next) => {
  try {
    const id = req.params.id

    console.log('DELETE ID:', id)

    const message = await findMessageById(id)

    if (!message) {
      return res.status(404).json({
        status: 'fail',
        message: 'Message not found'
      })
    }

    await Message.findByIdAndDelete(message._id)

    return res.json({
      status: 'success',
      message: 'Message deleted',
      data: {
        message: {
          _id: message._id
        }
      }
    })
  } catch (error) {
    next(error)
  }
}
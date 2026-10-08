const messages = [
  {
    user: 'John',
    message: 'Hello'
  },
  {
    user: 'Jane',
    message: 'Hi'
  }
]

// GET /api/v1/messages
// GET /api/v1/messages?user=username
export const list = (req, res, next) => {
  const username = req.query.user

  if (username) {
    const userMessages = messages.filter(
      message => message.user.toLowerCase() === username.toLowerCase()
    )

    return res.json({
      status: 'success',
      message: `Messages from user ${username}`,
      data: {
        messages: userMessages
      }
    })
  }

  res.json({
    status: 'success',
    message: 'GETTING messages',
    data: {
      messages: messages
    }
  })
}


// GET /api/v1/messages/:id
export const show = (req, res, next) => {
  const id = req.params.id

  const message = messages[id]

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
}


// POST /api/v1/messages
export const create = (req, res, next) => {
  const newMessage = req.body.message

  messages.push(newMessage)

  res.status(201).json({
    status: 'success',
    message: 'Message saved',
    data: {
      message: newMessage
    }
  })
}


// PUT /api/v1/messages/:id
export const update = (req, res, next) => {
  const id = req.params.id

  if (!messages[id]) {
    return res.status(404).json({
      status: 'fail',
      message: 'Message not found'
    })
  }

  messages[id] = {
    ...messages[id],
    ...req.body.message
  }

  res.json({
    status: 'success',
    message: 'Message updated',
    data: {
      message: messages[id]
    }
  })
}


// DELETE /api/v1/messages/:id
export const remove = (req, res, next) => {
  const id = req.params.id

  if (!messages[id]) {
    return res.status(404).json({
      status: 'fail',
      message: 'Message not found'
    })
  }

  messages.splice(id, 1)

  res.json({
    status: 'success',
    message: 'Message deleted',
    data: {
      message: {
        _id: id
      }
    }
  })
}
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

export const list = (req, res, next) => {
  const username = req.query.user

  if (username) {
    const userMessages = messages.filter(
      message => message.user.toLowerCase() === username.toLowerCase()
    )

    let result = {
      status: 'success',
      message: `Messages from user ${username}`,
      data: {
        messages: userMessages,
      },
    }

    return res.json(result)
  }

  let result = {
    status: 'success',
    message: 'GETTING messages',
    data: {
      messages: messages,
    },
  }

  res.json(result)
}

export const show = (req, res, next) => {
  const id = req.params.id
  const message = messages[id]

  if (!message) {
    return res.status(404).json({
      status: 'fail',
      message: 'Message not found',
    })
  }

  let result = {
    status: 'success',
    message: `GETTING message ${id}`,
    data: {
      message: message,
    },
  }

  res.json(result)
}

export const create = (req, res, next) => {
  const newMessage = req.body.message

  messages.push(newMessage)

  let result = {
    status: 'success',
    message: 'Message saved',
    data: {
      message: newMessage,
    },
  }

  res.json(result)
}

export const update = (req, res, next) => {
  const id = req.params.id

  if (!messages[id]) {
    return res.status(404).json({
      status: 'fail',
      message: 'Message not found',
    })
  }

  messages[id] = {
    ...messages[id],
    ...req.body.message,
  }

  let result = {
    status: 'success',
    message: 'Message updated',
    data: {
      message: messages[id],
    },
  }

  res.json(result)
}

export const remove = (req, res, next) => {
  const id = req.params.id

  if (!messages[id]) {
    return res.status(404).json({
      status: 'fail',
      message: 'Message not found',
    })
  }

  messages.splice(id, 1)

  let result = {
    status: 'success',
    message: 'Message deleted',
    data: {
      message: {
        _id: id,
      },
    },
  }

  res.json(result)
}
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
      status: 'error',
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
  let result = {
    status: 'success',
    data: {},
  }

  res.json(result)
}


export const update = (req, res, next) => {
  let result = {
    status: 'success',
    data: {},
  }

  res.json(result)
}


export const remove = (req, res, next) => {
  let result = {
    status: 'success',
    data: null,
  }

  res.json(result)
}
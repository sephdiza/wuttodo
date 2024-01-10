import express, { Request, Response, ErrorRequestHandler } from 'express'
import prisma from '../src/prisma'


const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  const todos = await prisma.todoList.findMany()
  res.send(todos)
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body

    const newTodo = await prisma.todoList.create({
      data: { name, status: 'TODO' },
    })

    res.json(newTodo)
  } catch (error: any) {
    console.log(error.message, req)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const deletedTodo = await prisma.todoList.delete({
      where: { id }
    })
    res.send(deletedTodo)
  } catch(error: any) {
    console.log(error.message, req)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
})

module.exports = router

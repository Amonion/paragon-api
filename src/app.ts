import express, { Application, RequestHandler } from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { handleError } from './utils/errorHandler'
import blogRoutes from './routes/blogRoutes'
import companyRoutes from './routes/companyRoutes'
import faqRoutes from './routes/faqRoutes'
import productRoutes from './routes/productRoutes'
import reviewRoutes from './routes/reviewRoutes'
import userRoutes from './routes/users/userRoutes'
// import { geoipMiddleware } from './middlewares/geoipMiddleware'
import { UsersSocket } from './routes/socket/usersSocket'

dotenv.config()

const app: Application = express()
const server = http.createServer(app)

// app.use(geoipMiddleware)

const requestLogger: RequestHandler = (req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url} from ${
      (req as any).country
    }`
  )
  next()
}

app.use(requestLogger)

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://paragonfarmsltd.netlify.app',
      'https://paragonfarmsltd.com',
      'https://schooling-client-v1.onrender.com',
    ],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'socket-id'],
  })
)

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://schoolingsocial.netlify.app',
      'https://schoolingsocial.com',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`)

  socket.on('message', async (data) => {
    switch (data.to) {
      case 'users':
        await UsersSocket(data)
        break
      default:
        break
    }
  })

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected.: ${socket.id}`)
  })
})

app.use(bodyParser.json())

app.use('/api/v1/blogs', blogRoutes)
app.use('/api/v1/company', companyRoutes)
app.use('/api/v1/faqs', faqRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/reviews', reviewRoutes)
app.use('/api/v1/users', userRoutes)

app.use((req, res, next) => {
  handleError(res, 404, `Request not found: ${req.method} ${req.originalUrl}`)
  next()
})

export { app, server, io }

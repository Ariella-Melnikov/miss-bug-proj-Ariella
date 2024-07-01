import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

//* Express Config:
app.use(express.static('public'))

//* Express Routing:
app.get('/api/bug', (req, res) => {
  const filterBy = {
    txt: req.query.txt,
    minSeverity: +req.query.minSeverity,
  }
  // res.send('Hello there')
  bugService
    .query(filterBy)
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error('Cannot get bugs', err)
      res.status(500).send('Cannot get bugs')
    })
})

app.get('/api/bug/save', (req, res) => {
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        description: req.query.description,
        severity: +req.query.severity, 
        


    }
})

const port = 3030

app.listen(port, () => console.log(`Server ready at port http://127.0.0.1:${port}/`))

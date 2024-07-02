import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

//* Express Config:
app.use(cookieParser())
app.use(express.static('public'))

//* Routes:

// List


app.get('/api/bug', (req, res) => {
  bugService
    .query()
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error('Cannot get bugs', err)
      res.status(500).send('Cannot get bugs')
    })
})

// Save - Create or Update

app.get('/api/bug/save', (req, res) => {

  console.log('req.query:', req.query)

  const { title, description, severity, _id } = req.query

  const bug = {
    _id,
    title,
    description,
    severity: +severity,
}

  bugService
    .save(bug)
    .then((saveBug) => res.send(saveBug))
    .catch((err) => {
      loggerService.error('Cannot save bug', err)
      res.status(400).send('Cannot save bug', err)
    })
})

// Read

app.get('/api/bug/:bugId', (req, res) => {

    console.log('req.params:', req.params)

    const { bugId } = req.params
    // console.log('bugId:', bugId)

    const { visitedBugs = [] } = req.cookies // use the default if undefined
    console.log('visitedBugs:', visitedBugs)

    if (!visitedBugs.includes(bugId)) {
      if (visitedBugs.length >= 3) return res.status(401).send('Wait for a bit')
      else visitedBugs.push(bugId)
  }

  res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 70 })
  console.log('visitedBugs:', visitedBugs)

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

// Delete

app.get('/api/bug/:bugId/remove', (req, res) => {
    // console.log('req.params:', req.params)
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => {
          loggerService.info(`Bug ${bugId} removed`)
          res.send('Removed!')
        }) .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug', err)
        })

})

const port = 3030
app.listen(port, () => loggerService.info((`Server listening on port http://127.0.0.1:${port}/`))
)


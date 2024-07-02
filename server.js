import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

//* Express Config:
app.use(cookieParser())
app.use(express.static('public'))
app.use(express.json())


//* Routes:

// LIST - get bugs

app.get('/api/bug', (req, res) => {
  console.log('req.query:', req.query)

  const filterBy = {
    txt: req.query.txt,
    severity: +req.query.severity,
  }

  bugService
    .query(filterBy)
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error('Cannot get bugs', err)
      res.status(500).send('Cannot get bugs')
    })
})

// ADD bug

app.post('/api/bug', (req, res) => {

  console.log('req.query:', req.body)


  const bugToSave = {
    title: req.body.title,
    description: req.body.description,
    severity: +req.body.severity
}

  bugService
    .save(bugToSave)
    .then(bug => res.send(bug))
    .catch((err) => {
      loggerService.error('Cannot save bug', err)
      res.status(500).send('Cannot save bug', err)
    })
})

//  Update bug

app.put('/api/bug', (req, res) => {

  console.log('req.query:', req.body)

  // const { title, description, severity, _id, createdAt, labels } = req.query

  const bugToSave = {
    _id: req.body._id,
    title: req.body.title,
    description: req.body.description,
    severity: +req.body.severity,
    // createdAt: Date.now(),
    // labels,
}

  bugService
    .save(bugToSave)
    .then(bug => res.send(bug))
    .catch((err) => {
      loggerService.error('Cannot save bug', err)
      res.status(500).send('Cannot save bug', err)
    })
})

// Read- get bug

app.get('/api/bug/:bugId', (req, res) => {

    console.log('req.params:', req.params)

    const { bugId } = req.params
    // console.log('bugId:', bugId)

  //   const { visitedBugs = [] } = req.cookies 
  //   console.log('visitedBugs:', visitedBugs)

  //   if (!visitedBugs.includes(bugId)) {
  //     if (visitedBugs.length >= 3) return res.status(401).send('Wait for a bit')
  //     else visitedBugs.push(bugId)
  // }

  // res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 70 })
  // console.log('visitedBugs:', visitedBugs)

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot get bug')
        })
})

// DELETE - remove bug


app.delete('/api/bug/:bugId', (req, res) => {

    console.log('req.params:', req.params)
    console.log('Delete...')

    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() =>  res.send(`Bug (${bugId}) removed!`))
           .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug', err)
        })

})

////////////////////////////////////////////////////


const port = 3030
app.listen(port, () => loggerService.info((`Server listening on port http://127.0.0.1:${port}/`))
)


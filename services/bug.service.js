import fs from 'fs'

import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'
import { pdfService } from './pdf.service.js'

export const bugService = {
  query,
  getById,
  remove,
  save,
}

const bugs = utilService.readJsonFile('data/bug.json')

// function query(filterBy = {}) {
//   return Promise.resolve(bugs).then((bugs) => {
//     if (filterBy.txt) {
//       const regExp = new RegExp(filterBy.txt, 'i')
//       bugs = bugs.filter((bug) => regExp.test(bug.title))
//     }
//     if (filterBy.minSeverity) {
//       bugs = bugs.filter((bug) => bug.severity >= filterBy.minSeverity)
//     }
//     return bugs
//   })
// }

function query() {
  return Promise.resolve(bugs)
}

function getById(bugId) {
  const bug = bugs.find((bug) => bug._id === bugId)
  if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
  return Promise.resolve(bug)
}

function remove(bugId) {
  const idx = bugs.findIndex((bug) => bug._id === bugId)
  if (idx < 0) return Promise.reject('Cannot find bug - ' + bugId)
  bugs.splice(idx, 1)
  return _saveBugsToFile().then(() => `bug (${bugId} removed!`)
}

function save(bug) {
  if (bug._id) {
    const idx = bugs.findIndex(currBug => currBug._id === bug._id)
    bugs[idx] = { ...bugs[idx], ...bug }
  } else {
    bug._id = utilService.makeId()
    bugs.unshift(bug)
  }
  return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 2)
    fs.writeFile('data/bug.json', data, (err) => {
      if (err) {
        loggerService.error('Cannot write to bugs file', err)
        return reject(err)
      }
      console.log('The file was saved!');
      resolve()
    })
  })
}

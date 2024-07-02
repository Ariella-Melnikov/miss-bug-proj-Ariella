import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'

// _createBugs()

export const bugService = {
  query,
  get,
  save,
  remove,
  getEmptyBug,
  getDefaultFilter,
  getFilterFromSearchParams,
}

function query(filterBy = {}) {
  return storageService.query(STORAGE_KEY).then((bugs) => {
    if (filterBy.txt) {
      const regExp = new RegExp(filterBy.txt, 'i')
      bugs = bugs.filter((bug) => regExp.test(bug.title) || regExp.test(bug.description))
    }
    if (filterBy.minSeverity) {
        bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
    }
    return bugs
  })
}


function get(bugId) {
  return storageService.get(STORAGE_KEY, bugId)
  .then(bug => _setNextPrevBugId(bug))
}

function remove(bugId) {
  return storageService.remove(STORAGE_KEY, bugId)
}

function save(bug) {
  if (bug._id) {
    return storageService.put(STORAGE_KEY, bug)
  } else {
    return storageService.post(STORAGE_KEY, bug)
  }
}

function getEmptyBug(title = '', description = '', severity = '') {
    return { title, description, severity }
}

function getDefaultFilter() {
    return { txt: '', minSeverity: '' }
}

function getFilterFromSearchParams(searchParams) {
    const txt = searchParams.get('txt') || ''
    const minSpeed = searchParams.get('minSeverity') || ''
    return {
        txt,
        minSeverity
    }
}

// function _createBugs() {
//     let bugs = utilService.loadFromStorage(STORAGE_KEY)
//     if (!bugs || !bugs.length) {
//         bugs = []
//         bugs.push(_createBug('Infinite Loop Detected', 'Problem in detected',  4))
//         bugs.push(_createBug('Keyboard Not Found','Problem with keyboard not found',  3))
//         bugs.push(_createBug('404 Coffee Not Found','Problem 404 coffee not found', 2))
//         bugs.push(_createBug('Unexpected Response', 'Problem with unexpected Response', 1))
//         utilService.saveToStorage(STORAGE_KEY, bugs)
//     }
// }

// function _createBug(title, description,  severity = 3) {
//     const bug = getEmptyBug(title, description, severity)
//     bug._id = utilService.makeId()
//     bug.createdAt = Date.now()
//     return bug
// }


// function _createBugs() {
//   let bugs = utilService.loadFromStorage(STORAGE_KEY)
//   if (!bugs || !bugs.length) {
//     bugs = [
//       {
//         title: 'Infinite Loop Detected',
//         description: 'Problem in detected',
//         severity: 4,
//         _id: '1NF1N1T3',
//         createdAt: 1719851845,
//       },
//       {
//         title: 'Keyboard Not Found',
//         description: 'Problem with keyboard not found',
//         severity: 3,
//         _id: 'K3YB0RD',
//         createdAt: 1719851884,
//       },
//       {
//         title: '404 Coffee Not Found',
//         description: 'Problem 404 coffee not found',
//         severity: 2,
//         _id: 'C0FF33',
//         createdAt: 1719851884,
//       },
//       {
//         title: 'Unexpected Response',
//         description: 'Problem with unexpected Response',
//         severity: 1,
//         _id: 'G0053',
//         createdAt: 1719851925,
//       },
//     ]
//     utilService.saveToStorage(STORAGE_KEY, bugs)
//   }
// }

// function _setNextPrevBugId(bug) {
//     return storageService.query(STORAGE_KEY).then((bugs) => {
//         const bugIdx = bugs.findIndex((currBug) => currBug._id === bug._id)
//         const nextBug = bugs[bugIdx + 1] ? bugs[bugIdx + 1] : bugs[0]
//         const prevBug = bugs[bugIdx - 1] ? bugs[bugIdx - 1] : bugs[bugs.length - 1]
//         bug.nextBugrId = nextBug._id
//         bug.prevBugId = prevBug._id
//         return bug
//     })
// }

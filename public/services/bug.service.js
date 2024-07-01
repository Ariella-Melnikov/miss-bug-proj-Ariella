import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'

_createBugs()

export const bugService = {
  query,
  getById,
  save,
  remove,
  getEmptyBug,
  getDefaultFilter,
  getFilterFromSearchParams,
}

function query(filterBy = {}) {
  return axios.get(BASE_URL, { params: filterBy }).then((res) => res.data)
  //   .then(bugs => {
  //     if (filterBy.txt) {
  //       const regExp = new RegExp(filterBy.txt, 'i')
  //       bugs = bugs.filter((bug) => regExp.test(bug.title) || regExp.test(bug.description))
  //     }
  //     if (filterBy.minSeverity) {
  //       bugs = bugs.filter((bug) => bug.severity >= filterBy.minSeverity)
  //     }
  //     return bugs
  //   })
}

function getById(bugId) {
  return axios
    .get(BASE_URL + bugId)
    .then((res) => res.data)
    .then((bug) => _setNextPrevBugId(bug))
}

function remove(bugId) {
  return axios.get(BASE_URL + bugId + '/remove')
}

function save(bug) {
  const url = BASE_URL + 'save'
  let queryParams = `?title=${bug.title}&description=${bug.description}&severity=${bug.severity}`
  if (bug._id) queryParams += `&_id=${bug._id}`
  return axios.get(url + queryParams).then((res) => res.data)
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

function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (!bugs || !bugs.length) {
        bugs = []
        bugs.push(_createBug('Infinite Loop Detected', 'Problem in detected',  4))
        bugs.push(_createBug('Keyboard Not Found','Problem with keyboard not found',  3))
        bugs.push(_createBug('404 Coffee Not Found','Problem 404 coffee not found', 2))
        bugs.push(_createBug('Unexpected Response', 'Problem with unexpected Response', 1))
        utilService.saveToStorage(STORAGE_KEY, bugs)
    }
}

function _createBug(title, description,  severity = 3) {
    const bug = getEmptyBug(title, description, severity)
    bug._id = utilService.makeId()
    bug.createdAt = Date.now()
    return bug
}

function _setNextPrevBugId(bug) {
    return storageService.query(STORAGE_KEY).then((bugs) => {
        const bugIdx = bugs.findIndex((currBug) => currBug._id === bug._id)
        const nextBug = bugs[bugIdx + 1] ? bugs[bugIdx + 1] : bugs[0]
        const prevBug = bugs[bugIdx - 1] ? bugs[bugIdx - 1] : bugs[bugs.length - 1]
        bug.nextBugrId = nextBug._id
        bug.prevBugId = prevBug._id
        return bug
    })
}

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

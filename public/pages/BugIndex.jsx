import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'

const { useState, useEffect } = React
const { Link } = ReactRouterDOM

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

  useEffect(() => {
    loadBugs()
    showSuccessMsg('Welcome to bug index!')
  }, [filterBy])

  function loadBugs(filterBy) {
    bugService
      .query(filterBy)
      .then(setBugs)
      // .then((bugs) => setBugs(bugs))
      .catch((err) => {
        console.log('Had issued in Bug Index:', err)
        showErrorMsg('Cannot get bugs')
      })
    // bugService.query(filterBy).then(setBugs)
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== bugId))
        showSuccessMsg(`Bug (${bugId}) removed!`)
      })
      .catch((err) => {
        console.log('Error from onRemoveBug ->', err)
        showErrorMsg('Cannot remove bug')
      })
  }

  function onSetFilter(filterBy) {
    setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...filterBy }))
  }

  return (
    <main>
      <section className='info-actions'>
      <BugFilter onSetFilter={onSetFilter} filterBy={filterBy} />
        <h3>Bugs App</h3>
        <Link to="/bug/edit">Add Bug</Link>   
      </section>
      <main>
      <BugList bugs={bugs} onRemoveBug={onRemoveBug} />
      </main>
    </main>
  )
}

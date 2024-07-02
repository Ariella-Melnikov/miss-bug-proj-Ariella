import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'

const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM

export function BugIndex() {
  const [bugs, setBugs] = useState(null)
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

  useEffect(() => {
    loadBugs()
    showSuccessMsg('Welcome to bug index!')
  }, [filterBy])

  function loadBugs() {
    bugService
      .query(filterBy)
      .then(bugs => {
        setBugs(bugs)
      })
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
        setBugs((bugs) => bugs.filter((bug) => bug._id !== bugId))
        showSuccessMsg(`Bug (${bugId}) removed!`)
      })
      .catch((err) => {
        console.log('Error from onRemoveBug ->', err)
        showErrorMsg('Cannot remove bug')
      })
  }
  function onSetFilter(filterBy) {
    setFilterBy((prevFilter) => {
      let nextPageIdx
      if (prevFilter.pageIdx !== undefined) nextPageIdx = 0
      return { ...prevFilter, ...filterBy, pageIdx: nextPageIdx }
    })
  }

  function togglePagination() {
    setFilterBy((prevFilter) => {
      return { ...prevFilter, pageIdx: prevFilter.pageIdx === undefined ? 0 : undefined }
    })
  }

  function onChangePage(diff) {
    if (filterBy.pageIdx === undefined) return
    // console.log('diff:', diff)
    setFilterBy((prevFilter) => {
      let nextPageIdx = prevFilter.pageIdx + diff
      if (nextPageIdx < 0) nextPageIdx = 0
      return { ...prevFilter, pageIdx: nextPageIdx }
    })
  }
  if (!bugs) return <div>Loading...</div>

  return (
    <main>
      <section className='info-actions'>
        <BugFilter filterBy={filterBy} onSetFilter={onSetFilter} />
        <h3>Bugs App</h3>
        <Link to='/bug/edit'>Add Bug</Link>
      </section>
      <section>
        <button onClick={togglePagination}>Toggle Pagination</button>
        <button onClick={() => onChangePage(-1)}>-</button>
        {filterBy.pageIdx + 1 || 'No Pagination'}
        <button onClick={() => onChangePage(1)}>+</button>
      </section>
      <main>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} />
      </main>
    </main>
  )
}

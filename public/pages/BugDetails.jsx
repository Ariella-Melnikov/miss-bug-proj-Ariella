const { useEffect, useState } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export function BugDetails() {
  const [bug, setBug] = useState(null)
  const { bugId } = useParams()
  const navigate = useNavigate()
  // console.log('params:', params)


  useEffect(() => {
    loadBug()
  }, [bugId])

  function loadBug() {
    bugService
      .get(bugId)
      .then(bug => setBug(bug))
      .catch((err) => {
        console.log('Had issued in bug details:', err)
        navigate('/bug')
      })
  }

  function onBack() {
    navigate('/bug')
    // navigate(-1)
  }

  if (!bug) return <h1>loadings....</h1>
  return (
      <div>
        <h3>Bug Details 🐛</h3>
        <h2>Bug Title: {bug.title}</h2>
        <h4>Description: {bug.description}</h4>
        <h4>Severity: {bug.severity}</h4>
        {/* <h4>Labels: {bug.labels.join(' , ')}</h4> */}
        <button ><Link to="/bug">Back</Link></button>
            <section>
                <button ><Link to={`/bug/${bug.prevBugId}`}>Prev Bug</Link></button>
                <button ><Link to={`/bug/${bug.nextBugId}`}>Next Bug</Link></button>
            </section>
      </div>
    )
}

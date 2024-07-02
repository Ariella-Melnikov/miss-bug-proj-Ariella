const { useEffect, useState } = React
const { useParams, useNavigate } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export function BugDetails() {
  const [bug, setBug] = useState(null)
  const params = useParams()
  const navigate = useNavigate()
  console.log('params:', params)

  // const { bugId } = useParams()

  useEffect(() => {
    loadBug()
  }, [])

  function loadBug() {
    bugService
      .get(params.bugId)
      .then(setBug)
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
        <button onClick={onBack}>Back</button>
      </div>
    )
}

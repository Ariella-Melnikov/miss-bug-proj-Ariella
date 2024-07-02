import { utilService } from "../services/util.service.js"

const {useState, useEffect, useRef} = React

export function BugFilter({filterBy, onSetFilter}) {
  const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
  const onSetFilterDebounce = useRef(utilService.debounce(onSetFilter, 300))

  useEffect(() => {
    onSetFilterDebounce.current(filterByToEdit)
  }, [filterByToEdit])

//   function handleChange({target}) {
//     const field = target.name
//     let value = target.value

//     switch (target.type) {
//       case 'number':
//       case 'range':
//           value = +value
//           break;

//       case 'checkbox':
//           value = target.checked
//           break

//       default:
//           break;
//   }

//   setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
// }

function handleChange({ target }) {
  const { name, value, type, checked } = target;

  // Handle different input types
  let updatedValue = value;
  if (type === 'number' || type === 'range') {
    updatedValue = +value; // Convert to number
  } else if (type === 'checkbox') {
    updatedValue = checked; // Use checked state for checkbox
  }

  setFilterByToEdit(prevFilter => ({
    ...prevFilter,
    [name]: updatedValue
  }));
}

  function onSubmitFilter(ev) {
    ev.preventDefault()
    onSetFilter(filterByToEdit)
  }

  // ! DRY!. WE WILL NEVER REPEAT OUR SELVES
  // function handleTxtChange({ target }) {
  //     const value = target.value
  //     setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, txt: value }))
  // }

  // function handleMinSpeedChange({ target }) {
  //     const value = target.value
  //     setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, minSpeed: value }))
  // }

  const {txt, minSeverity} = filterByToEdit
  return (
    <section className="bug-filter full main-layout">
      <h2>Filter Our Bugs</h2>

      <form onSubmit={onSubmitFilter}>
        <label htmlFor="txt">Title:</label>
        <input
          value={txt}
          onChange={handleChange}
          name="txt"
          id="txt"
          type="text"
          placeholder="By Title"
        />

        <label htmlFor="minSeverity">Severity:</label>
        <input
          value={minSeverity}
          onChange={handleChange}
          type="number"
          name="minSeverity"
          id="minSeverity"
          placeholder="By minSeverity"
        />

        <button type="submit">Filter Bugs</button>
      </form>
    </section>
  );
}
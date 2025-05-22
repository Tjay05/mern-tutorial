import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useWorkoutsContext } from "../hooks/useWorkoutContext";

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState('');
  const [load, setLoad] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You Suppose login na...')
      return
    };

    const workout = {title, load, reps};

    const response = await fetch('https://mern-tutorial-zpvg.onrender.com/api/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTitle(''),
      setLoad(''),
      setReps('');
      setError(null);
      setEmptyFields([]);
      dispatch({type: 'CREATE_WORKOUT', payload: json})
    }
    
  }

  return (
    <form className="create lg:col-span-1" onSubmit={handleSubmit}>
      <h3 className="">Add a New Workout</h3>

      <label className="label">Exercise Title:</label>
      <input 
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title} 
        className={emptyFields.includes('title') ? 'error input-field' : 'input-field'}
      />

      <label className="label">Load (in Kg):</label>
      <input 
        type="number"
        onChange={(e) => setLoad(e.target.value)}
        value={load} 
        className={emptyFields.includes('load') ? 'error input-field' : 'input-field'}
      />
      
      <label className="label">Reps:</label>
      <input 
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps} 
        className={emptyFields.includes('reps') ? 'error input-field' : 'input-field'}
      />

      <button className="submit-btn">Add Workout</button>
      {error && <div className="warning">{error}</div>}
    </form>
  );
}
 
export default WorkoutForm;
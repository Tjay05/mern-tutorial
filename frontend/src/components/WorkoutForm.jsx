import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useModalContext } from "../hooks/useModalContext";
import { useWorkoutsContext } from "../hooks/useWorkoutContext";

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const { isModalOpen, setIsModalOpen } = useModalContext();

  const [title, setTitle] = useState('');
  const [load, setLoad] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!user) {
      setError('You Suppose login na...');
      setIsLoading(false);
      return;
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
      setIsLoading(false);
    }
    if (response.ok) {
      setTitle(''),
      setLoad(''),
      setReps('');
      setError(null);
      setEmptyFields([]);
      dispatch({type: 'CREATE_WORKOUT', payload: json})
      setIsLoading(false);
      setIsModalOpen(!isModalOpen);
    }
    
  }

  return (
    <>
      <form className={isModalOpen ? `block shadow-2xl bg-white rounded-lg p-4 absolute lg:shadow-none lg:px-0 lg:bg-transparent lg:col-span-1 lg:relative` : 'hidden lg:block lg:py-4'} onSubmit={handleSubmit}>
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

        {!isLoading && <button className="submit-btn">Add Workout</button>}
        {isLoading && <button disabled className="submit-btn">Adding Workout...</button>}
        {error && <div className="warning">{error}</div>}
      </form>
    </>
  );
}
 
export default WorkoutForm;
import { useWorkoutsContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";

// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  const handleClick = async () => {
    if (!user) {
      return
    }

    const response = await fetch('https://mern-tutorial-zpvg.onrender.com/api/workouts/' + workout._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({type: 'DELETE_WORKOUT', payload: json})
    }
  };

  return (
    <div className="bg-white rounded-sm my-5 p-3 relative shadow-sm lg:p-5">
      <h4 className="mb-3 text-[#1aac83] lg:text-lg lg:mb-5 font-bold">{workout.title}</h4>
      <p className="text-[#555] text-sm lg:text-base"><strong>Load (kg): </strong>{workout.load}</p>
      <p className="text-[#555] text-sm lg:text-base"><strong>Reps: </strong>{workout.reps}</p>
      <p className="text-[#555] text-sm lg:text-base">{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
      <span className="material-symbols-outlined absolute top-[20px] right-[20px] cursor-pointer bg-[#f1f1f1] p-1 rounded-[50%]" onClick={handleClick} >delete</span>
    </div>
  );
}
 
export default WorkoutDetails;
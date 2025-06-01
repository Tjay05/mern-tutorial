import { useEffect } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";
// import PictureForm from "../components/PicUpload";

const Home = () => {
  const {workouts, dispatch} = useWorkoutsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch('https://mern-tutorial-zpvg.onrender.com/api/workouts', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({type: 'SET_WORKOUTS', payload: json})
      }
    }

    if (user) {
      fetchWorkouts();
    }
  }, [dispatch, user]);

  return (
    <div className="grid grid-cols-1 lg:gap-10 lg:grid-cols-4">
      <div className="workouts lg:col-span-3">
        {workouts && workouts.map((workout) => (
          <WorkoutDetails key={workout._id} workout={workout} />
        ))}
      </div>
      <WorkoutForm/>
      {/* <PictureForm/> */}
    </div>
  );
}
 
export default Home;
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { useWorkoutsContext } from "./useWorkoutContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: workoutsDispatch } = useWorkoutsContext();

  const logout = () => {
    // remove user from local storage
    localStorage.removeItem('user');

    // dispatch logout action
    dispatch({type: 'LOGOUT'});
    workoutsDispatch({type: 'SET_WORKOUTS', payload: null})
  }

  return {logout};
}
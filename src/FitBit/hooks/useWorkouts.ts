import { useState, useEffect, useCallback } from "react";
import type { Workout } from "../types";
import { apiCall } from "../api";

export const useWorkouts = (token: string | null) => {
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);

  useEffect(() => {
    const getWorkouts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiCall("/fitbit/getUserWorkouts", {}, token);
        console.log("User's workouts: ", data);
        setAllWorkouts(data.workouts || []);
      } catch (e) {
        console.error("Error while getting workouts", e);
        setError("Failed to load workouts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getWorkouts();
  }, [token]);

  const addWorkout = useCallback(
    async (name: string, reps: number, duration: number) => {
      try {
        setIsAddingWorkout(true);
        const data = await apiCall(
          "/fitbit/addUserWorkout",
          {
            method: "POST",
            body: JSON.stringify({ name, reps, duration }),
          },
          token
        );
        console.log("Add Workout details are: ", data);
        setAllWorkouts((prev) => [...prev, data.workout]);
      } catch (error) {
        console.error("Error adding custom workout:", error);
        setError("Failed to add workout. Please try again.");
      } finally {
        setIsAddingWorkout(false);
      }
    },
    [token]
  );

  return { allWorkouts, loading, error, isAddingWorkout, addWorkout, setAllWorkouts };
};

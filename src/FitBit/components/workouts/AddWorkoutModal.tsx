import React, { useState } from "react";
import { X } from "lucide-react";
import type { AddWorkoutModalProps } from "../../types";

export const AddWorkoutModal: React.FC<AddWorkoutModalProps> = ({
  isOpen,
  onClose,
  onAddWorkout,
}) => {
  const [workoutName, setWorkoutName] = useState("");
  const [reps, setReps] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutName.trim() || !reps || !duration) return;
    onAddWorkout(workoutName.trim(), parseInt(reps, 10), parseInt(duration, 10));
    setWorkoutName("");
    setReps("");
    setDuration("");
    onClose();
  };

  const handleClose = () => {
    setWorkoutName("");
    setReps("");
    setDuration("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Add New Workout</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Workout Name *
            </label>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="e.g., Push-ups"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reps *
            </label>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="e.g., 15"
              min="1"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration (minutes) *
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 10"
              min="1"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Add Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

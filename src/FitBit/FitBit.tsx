import React, { useState, useEffect } from "react";
import { Search, Plus, X } from "lucide-react";
import axios from "axios";

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fats: number;
  carbohydrates: number;
  fiber: number;
  sugar: number;
  sodium: number;
  created_at: string;
  updated_at: string;
}

interface MealCategory {
  id: string;
  name: string;
  meals: Meal[];
}

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeal: (mealName: string) => void;
}

interface ApiResponse {
  meals: Meal[];
  total_count: number;
}

const AddMealModal: React.FC<AddMealModalProps> = ({
  isOpen,
  onClose,
  onAddMeal,
}) => {
  const [mealName, setMealName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mealName.trim()) return;

    onAddMeal(mealName.trim());

    // Reset form
    setMealName("");
    onClose();
  };

  const handleClose = () => {
    setMealName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Add New Meal</h2>
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
              Meal Name *
            </label>
            <input
              type="text"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="e.g., 2 Slices Toast"
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
              Add Meal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MealItem: React.FC<{
  meal: Meal;
  onDragStart: (meal: Meal) => void;
  isFromList?: boolean;
}> = ({ meal, onDragStart, isFromList = false }) => {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(meal);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/json", JSON.stringify(meal));
  };

  const formatNutritionInfo = () => {
    const parts = [];

    parts.push(`${meal.calories} cal`);
    parts.push(`${meal.protein}g protein`);
    parts.push(`${meal.carbohydrates}g carbs`);
    parts.push(`${meal.fats}g fats`);

    if (meal.fiber > 0) parts.push(`${meal.fiber}g fiber`);
    if (meal.sugar > 0) parts.push(`${meal.sugar}g sugar`);
    if (meal.sodium > 0) parts.push(`${meal.sodium}mg sodium`);

    return parts.join(" • ");
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`bg-gray-700 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:bg-gray-600 hover:scale-105 hover:shadow-lg ${
        isFromList ? "border-l-4 border-blue-400" : "border border-gray-600"
      }`}
    >
      <div className="font-medium text-white text-sm mb-2">{meal.name}</div>
      <div className="text-gray-300 text-xs">{formatNutritionInfo()}</div>
    </div>
  );
};

const MealSlotComponent: React.FC<{
  meal: Meal;
  categoryId: string;
  onRemoveMeal: (categoryId: string, mealId: string) => void;
  onDragStart: (meal: Meal) => void;
}> = ({ meal, categoryId, onRemoveMeal, onDragStart }) => {
  return (
    <div className="relative group">
      <div className="relative">
        <MealItem meal={meal} onDragStart={onDragStart} />
        <button
          onClick={() => onRemoveMeal(categoryId, meal.id)}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
};

const MealCategory: React.FC<{
  category: MealCategory;
  onDropMeal: (categoryId: string, meal: Meal) => void;
  onRemoveMeal: (categoryId: string, mealId: string) => void;
  onDragStart: (meal: Meal) => void;
}> = ({ category, onDropMeal, onRemoveMeal, onDragStart }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set drag over to false if we're leaving the category container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const mealData = e.dataTransfer.getData("application/json");
    if (mealData) {
      const meal = JSON.parse(mealData);
      onDropMeal(category.id, meal);
    }
  };

  return (
    <div
      className={`bg-gray-800 rounded-xl p-4 transition-all duration-300 min-h-[200px] ${
        isDragOver ? "ring-2 ring-blue-400 bg-gray-700" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3 className="text-white font-semibold text-lg mb-4">{category.name}</h3>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 gap-3 mb-4">
        {category.meals.map((meal) => (
          <MealSlotComponent
            key={`${category.id}-${meal.id}`}
            meal={meal}
            categoryId={category.id}
            onRemoveMeal={onRemoveMeal}
            onDragStart={onDragStart}
          />
        ))}

        {/* Drop zone when empty */}
        {category.meals.length === 0 && (
          <div className="col-span-1 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-8 flex items-center justify-center text-gray-400 text-sm hover:border-gray-500 transition-colors duration-200">
            Drop meals here
          </div>
        )}
      </div>
    </div>
  );
};

const MealList: React.FC<{
  meals: Meal[];
  searchTerm: string;
  onDragStart: (meal: Meal) => void;
  onAddMealClick: () => void;
}> = ({ meals, searchTerm, onDragStart }) => {
  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {filteredMeals.map((meal, index) => (
        <div
          key={meal.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <MealItem meal={meal} onDragStart={onDragStart} isFromList />
        </div>
      ))}
    </div>
  );
};

export default function FitBitApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedMeal, setDraggedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mealCategories, setMealCategories] = useState<MealCategory[]>([
    {
      id: "breakfast",
      name: "Breakfast",
      meals: [],
    },
    {
      id: "lunch",
      name: "Lunch",
      meals: [],
    },
    {
      id: "dinner",
      name: "Dinner",
      meals: [],
    },
  ]);

  // Inject styles into the head
  useEffect(() => {
    const styleId = "fitbit-custom-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out forwards;
          opacity: 0;
          transform: translateX(-50px);
        }

        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out forwards;
          opacity: 0;
          transform: translateX(50px);
        }

        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
          transform: scaleX(0);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        .meals-list-container {
          position: sticky;
          top: 6rem;
          height: calc(100vh - 8rem);
        }

        .meals-list-scrollable {
          height: calc(100vh - 18rem);
          overflow-y: auto;
        }

        .app-header {
          position: sticky;
          top: 0;
          z-index: 40;
          background: rgba(17, 24, 39, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(75, 85, 99, 0.3);
        }

        .main-content {
          padding-top: 1rem;
        }

        @media (max-width: 1024px) {
          .meals-list-container {
            position: relative;
            height: auto;
            top: 0;
          }

          .meals-list-scrollable {
            height: 300px;
          }

          .mobile-layout {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .mobile-meals-list {
            order: 1;
          }

          .mobile-categories {
            order: 2;
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        @media (max-width: 640px) {
          .meals-list-scrollable {
            height: 250px;
          }

          .mobile-categories {
            gap: 0.75rem;
          }

          .app-header {
            padding: 1rem;
          }

          .main-content {
            padding: 1rem;
          }
        }

        @media (max-height: 600px) {
          .meals-list-scrollable {
            height: calc(100vh - 14rem);
          }
        }

        @media (max-height: 800px) {
          .meals-list-scrollable {
            height: calc(100vh - 16rem);
          }
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          to {
            transform: scaleX(1);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Fetch meals from API
  useEffect(() => {
    const getMeals = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<ApiResponse>(
          "http://127.0.0.1:8000/fitbit/getMeals"
        );
        console.log("Meals are : ", response.data);
        setAllMeals(response.data.meals);
      } catch (e) {
        console.error("Error while getting meals", e);
        setError("Failed to load meals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getMeals();
  }, []);

  const handleDragStart = (meal: Meal) => {
    setDraggedMeal(meal);
  };

  const handleDropMeal = (categoryId: string, meal: Meal) => {
    setMealCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          // Add meal to the category (allow multiple meals)
          return {
            ...category,
            meals: [
              ...category.meals,
              { ...meal, id: `${meal.id}-${Date.now()}` },
            ],
          };
        }
        return category;
      })
    );
  };

  const handleRemoveMeal = (categoryId: string, mealId: string) => {
    setMealCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            meals: category.meals.filter((meal) => meal.id !== mealId),
          };
        }
        return category;
      })
    );
  };

  const handleAddMealClick = () => {
    setIsModalOpen(true);
  };

  const handleAddCustomMeal = async (mealName: string) => {
    try {
      // Here you would typically make an API call to create the meal
      // For now, we'll create a mock meal object
      const newMeal: Meal = {
        id: Date.now().toString(),
        name: mealName,
        calories: 0,
        protein: 0,
        fats: 0,
        carbohydrates: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to all meals list
      setAllMeals((prev) => [...prev, newMeal]);
    } catch (error) {
      console.error("Error adding custom meal:", error);
      setError("Failed to add meal. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    console.log("dragged meal is : ", draggedMeal);
  }, [draggedMeal]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading meals...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl text-center">
          <div className="mb-4">⚠️ {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sticky Header */}
      <div className="app-header">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in">
              FitBit
            </h1>
            <div className="w-24 h-1 bg-blue-400 mx-auto rounded-full animate-scale-in"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content max-w-7xl mx-auto px-6">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 animate-slide-in-left">
            <div className="meals-list-container">
              <div className="bg-gray-800 rounded-xl p-4">
                <h2 className="text-white font-semibold text-lg mb-4">
                  List of Meals ({allMeals.length})
                </h2>
                <div className="relative mb-4">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search Filter"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                  />
                </div>

                {/* Meal List */}
                <div className="pb-4 meals-list-scrollable custom-scrollbar">
                  <MealList
                    meals={allMeals}
                    searchTerm={searchTerm}
                    onDragStart={handleDragStart}
                    onAddMealClick={handleAddMealClick}
                  />
                </div>
                {/* Add Meal Button */}
                <div className="relative mb-4">
                  <button
                    onClick={handleAddMealClick}
                    className="absolute transform -translate-y-1/2 w-full bg-blue-600 hover:bg-blue-500 text-white text-sm py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mb-4"
                  >
                    <Plus size={16} />
                    Add New Meal
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-6 animate-slide-in-right">
            {mealCategories.map((category, index) => (
              <div
                key={category.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <MealCategory
                  category={category}
                  onDropMeal={handleDropMeal}
                  onRemoveMeal={handleRemoveMeal}
                  onDragStart={handleDragStart}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden mobile-layout">
          {/* Meals List for Mobile */}
          <div className="mobile-meals-list animate-fade-in">
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="text-white font-semibold text-lg mb-4">
                List of Meals ({allMeals.length})
              </h2>
              <div className="relative mb-4">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search Filter"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                />
              </div>

              {/* Meal List */}
              <div className="meals-list-scrollable custom-scrollbar">
                <MealList
                  meals={allMeals}
                  searchTerm={searchTerm}
                  onDragStart={handleDragStart}
                  onAddMealClick={handleAddMealClick}
                />
              </div>
            </div>
          </div>

          {/* Categories for Mobile */}
          <div className="mobile-categories">
            {mealCategories.map((category, index) => (
              <div
                key={category.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MealCategory
                  category={category}
                  onDropMeal={handleDropMeal}
                  onRemoveMeal={handleRemoveMeal}
                  onDragStart={handleDragStart}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
      <AddMealModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddMeal={handleAddCustomMeal}
      />
    </div>
  );
}

import { createContext, useContext, useState, useEffect } from 'react';
import { getUserProgress, markItemComplete, getAllUserProgress } from '../api/moduleApi';
import { useUser } from './UserContext';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [completedItems, setCompletedItems] = useState(new Set());
  const [progressData, setProgressData] = useState({});
  const { user } = useUser();

  // Load user progress when user changes
  useEffect(() => {
    if (user) {
      loadAllProgress();
    } else {
      setCompletedItems(new Set());
      setProgressData({});
    }
  }, [user]);

  const loadAllProgress = async () => {
    try {
      const allProgress = await getAllUserProgress();
      
      // Extract all completed items
      const completed = new Set();
      const progressByModule = {};
      
      allProgress.forEach(progress => {
        progressByModule[progress.moduleId] = progress;
        progress.completedItems?.forEach(item => {
          completed.add(item.itemId.toString());
        });
      });
      
      setCompletedItems(completed);
      setProgressData(progressByModule);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const loadModuleProgress = async (moduleId) => {
    try {
      const progress = await getUserProgress(moduleId);
      
      if (progress && progress.completedItems) {
        const completed = new Set(completedItems);
        progress.completedItems.forEach(item => {
          completed.add(item.itemId.toString());
        });
        setCompletedItems(completed);
        
        setProgressData(prev => ({
          ...prev,
          [moduleId]: progress
        }));
      }
    } catch (error) {
      console.error('Error loading module progress:', error);
    }
  };

  const markComplete = async (moduleId, unitId, itemId) => {
    // Optimistically update UI
    setCompletedItems(prev => new Set([...prev, itemId.toString()]));

    // Save to backend
    try {
      const result = await markItemComplete(moduleId, unitId, itemId);
      
      if (result && result.progress) {
        setProgressData(prev => ({
          ...prev,
          [moduleId]: result.progress
        }));
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      // Rollback on error
      setCompletedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId.toString());
        return newSet;
      });
    }
  };

  const isCompleted = (itemId) => {
    return completedItems.has(itemId?.toString());
  };

  const getModuleProgress = (module) => {
    if (!module || !module.units) return 0;
    
    const totalItems = module.units.reduce(
      (sum, unit) => sum + (unit.items?.length || 0), 
      0
    );
    
    if (totalItems === 0) return 0;
    
    const completedCount = module.units.reduce(
      (sum, unit) => 
        sum + (unit.items?.filter(item => completedItems.has(item._id?.toString())).length || 0),
      0
    );
    
    return Math.round((completedCount / totalItems) * 100);
  };

  const getUnitProgress = (unit) => {
    if (!unit || !unit.items) return 0;
    
    const totalItems = unit.items.length;
    if (totalItems === 0) return 0;
    
    const completedCount = unit.items.filter(item => 
      completedItems.has(item._id?.toString())
    ).length;
    
    return Math.round((completedCount / totalItems) * 100);
  };

  const getCompletedItemsCount = (module) => {
    if (!module || !module.units) return 0;
    
    return module.units.reduce(
      (sum, unit) => 
        sum + (unit.items?.filter(item => completedItems.has(item._id?.toString())).length || 0),
      0
    );
  };

  return (
    <ProgressContext.Provider 
      value={{ 
        completedItems, 
        progressData,
        markComplete, 
        isCompleted, 
        getModuleProgress,
        getUnitProgress,
        getCompletedItemsCount,
        loadModuleProgress,
        loadAllProgress
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}

export default ProgressContext;
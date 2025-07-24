import { useState, useEffect, useCallback } from "react";

interface OfflineStorageOptions {
  key: string;
  defaultValue?: any;
  syncOnline?: boolean;
}

interface OfflineData<T> {
  data: T;
  timestamp: number;
  synced: boolean;
}

export const useOfflineStorage = <T>({
  key,
  defaultValue,
  syncOnline = true,
}: OfflineStorageOptions) => {
  // syncOnline parameter is reserved for future use
  console.debug("Offline storage initialized with syncOnline:", syncOnline);
  const [data, setData] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingSync, setPendingSync] = useState<T[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`offline_${key}`);
      if (stored) {
        const parsed: OfflineData<T> = JSON.parse(stored);
        setData(parsed.data);

        // Check for pending sync items
        if (!parsed.synced) {
          setPendingSync((prev) => [...prev, parsed.data]);
        }
      }
    } catch (error) {
      console.error("Error loading offline data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  // Save data to localStorage
  const saveData = useCallback(
    (newData: T, synced = false) => {
      const offlineData: OfflineData<T> = {
        data: newData,
        timestamp: Date.now(),
        synced,
      };

      try {
        localStorage.setItem(`offline_${key}`, JSON.stringify(offlineData));
        setData(newData);

        if (!synced) {
          setPendingSync((prev) => [...prev, newData]);
        }
      } catch (error) {
        console.error("Error saving offline data:", error);
      }
    },
    [key]
  );

  // Mark data as synced
  const markAsSynced = useCallback(
    (syncedData: T) => {
      try {
        const stored = localStorage.getItem(`offline_${key}`);
        if (stored) {
          const parsed: OfflineData<T> = JSON.parse(stored);
          parsed.synced = true;
          localStorage.setItem(`offline_${key}`, JSON.stringify(parsed));

          setPendingSync((prev) =>
            prev.filter(
              (item) => JSON.stringify(item) !== JSON.stringify(syncedData)
            )
          );
        }
      } catch (error) {
        console.error("Error marking data as synced:", error);
      }
    },
    [key]
  );

  // Clear offline data
  const clearData = useCallback(() => {
    try {
      localStorage.removeItem(`offline_${key}`);
      setData(defaultValue);
      setPendingSync([]);
    } catch (error) {
      console.error("Error clearing offline data:", error);
    }
  }, [key, defaultValue]);

  // Get all offline keys (for cleanup)
  const getAllOfflineKeys = useCallback(() => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("offline_")) {
        keys.push(key);
      }
    }
    return keys;
  }, []);

  return {
    data,
    isLoading,
    pendingSync,
    saveData,
    markAsSynced,
    clearData,
    getAllOfflineKeys,
  };
};

// Hook for managing offline queue
export const useOfflineQueue = () => {
  const [queue, setQueue] = useState<
    Array<{
      id: string;
      action: string;
      data: any;
      timestamp: number;
    }>
  >([]);

  useEffect(() => {
    // Load queue from localStorage
    try {
      const stored = localStorage.getItem("offline_queue");
      if (stored) {
        setQueue(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading offline queue:", error);
    }
  }, []);

  const addToQueue = useCallback((action: string, data: any) => {
    const item = {
      id: `${Date.now()}_${Math.random()}`,
      action,
      data,
      timestamp: Date.now(),
    };

    setQueue((prev) => {
      const newQueue = [...prev, item];
      localStorage.setItem("offline_queue", JSON.stringify(newQueue));
      return newQueue;
    });

    return item.id;
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue((prev) => {
      const newQueue = prev.filter((item) => item.id !== id);
      localStorage.setItem("offline_queue", JSON.stringify(newQueue));
      return newQueue;
    });
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    localStorage.removeItem("offline_queue");
  }, []);

  return {
    queue,
    addToQueue,
    removeFromQueue,
    clearQueue,
  };
};

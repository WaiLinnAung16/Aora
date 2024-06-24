import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Models } from "react-native-appwrite";

const useAppWrite = <T>(fn: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fn();
      setData(response);
    } catch (error: any) {
      Alert.alert("Error", error.messages);
      
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const refetch = async () => fetchData();

  return { data, refetch };
};

export default useAppWrite;

import { useParams } from "next/navigation";

export const useFood = () => {
  const { foodId } = useParams();
  const foodID = Array.isArray(foodId) ? foodId[0] : foodId;

  return {
    foodID,
  };
};

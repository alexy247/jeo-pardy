import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ICategory } from '../data/types'

interface ICreateCategoryStore {
    categoriesListByPackAndRound: Record<string, Record<number, ICategory[]>>;

    addToMap: (packId: string, roundId: number, item: ICategory) => void;
    getByKey: (packId: string, roundId: number) => ICategory[];
    removeFromMap: (packId: string, roundId: number, categoryId: string) => void;
    
    clearMap: () => void;
}

const useCreateCategoryStore = create<ICreateCategoryStore>()(
    persist(
    (set, get) => ({
        categoriesListByPackAndRound: {} as Record<string, Record<number, ICategory[]>>,
      
        addToMap: (packId: string, roundId: number, item: ICategory) => {
            let currentList = get().categoriesListByPackAndRound;

            if (packId in currentList) {
                currentList[packId][roundId] = [...(currentList[packId][roundId] || []), item];
            } else {
                currentList[packId] = { [roundId]: [item] };
            }

            set({ categoriesListByPackAndRound: currentList });
        },

        // Получить по ключу
        getByKey: (packId: string, roundId: number): ICategory[] => {
            const currentList = get().categoriesListByPackAndRound;
            return currentList[packId]?.[roundId] || [];
        },

        removeFromMap: (packId: string, roundId: number, categoryId: string) => {
            let currentList = get().categoriesListByPackAndRound;

            if (packId in currentList && roundId in currentList[packId]) {
                currentList[packId][roundId] = currentList[packId][roundId].filter(category => category.id !== categoryId);
                set({ categoriesListByPackAndRound: currentList });
            }
        },

      // TODO: Поддержать позже
      clearMap: () => set({ categoriesListByPackAndRound: {} as Record<string, Record<number, ICategory[]>> }),
    }),
    {
      name: 'new-category-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

export default useCreateCategoryStore;
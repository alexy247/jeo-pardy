import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

export function useCancellableFetch<T>(
  fetchFn: (signal: AbortSignal) => Promise<T>,
  deps: any[] = []
) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const { setLoading, setError } = useGameStore();

  useEffect(() => {
    // Отменяем предыдущий запрос
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый контроллер
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);

    fetchFn(abortController.signal)
      .catch(error => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.log('Request cancelled by cleanup');
          return;
        }
        setError(error instanceof Error ? error.message : 'Request failed');
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      });

    // Очистка при размонтировании или изменении зависимостей
    return () => {
      abortController.abort();
    };
  }, deps);

  // Функция для ручной отмены
  const cancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  return { cancel };
}
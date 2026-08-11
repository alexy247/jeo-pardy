import { useState } from "react";
import { useGame } from "../context/GameContext";
import { useGameStore } from "../store/useGameStore";

import ErrorBoundary from "./ErrorBoundary";
import ErrorFallback from "../components/error-fallback/ErrorFallback";

const ErrorBoundaryWithStore = ({ children }: { children: React.ReactNode }) => {
  // Забираем все нужные данные из стора через селекторы
    const { user } = useGame();
    const { currentGameSession } = useGameStore();
  
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <ErrorFallback onRetry={() => setHasError(false)} />;
  }

  // Передаем данные как пропсы в классовый компонент
  return (
    <ErrorBoundary 
      userId={user?.id}
      sessionId={currentGameSession}
      onError={() => setHasError(true)}
      fallback={<ErrorFallback onRetry={() => setHasError(false)} />}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWithStore;
import { isDevMode } from "../../lib/enviromentUtils";
import ButtonType from "../actions/ButtonType";
import CenteringBlock from "../ui/centering-block/CenteringBlock";

// components/ErrorFallback.tsx
interface ErrorFallbackProps {
  onRetry?: () => void;        // Функция для повторной попытки
  error?: Error | null;        // Объект ошибки (для деталей в dev-режиме)
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  onRetry, 
  error
}) => {
  return (
    <CenteringBlock>
      <div className="error-fallback" role="alert">
        <h2>⚠️ Что-то пошло не так</h2>
        <p className="error-fallback__message">
          Не удалось загрузить этот раздел. Пожалуйста, попробуйте еще раз.
        </p>
        
        {/* Показываем детали ошибки только в разработке */}
        {isDevMode && error && (
          <details className="error-fallback__details">
            <summary>Технические детали</summary>
            <pre>{error.message}</pre>
            <pre>{error.stack}</pre>
          </details>
        )}

        <div className="error-fallback__actions">
          <ButtonType label="Попробовать снова" onClick={onRetry} />
        </div>
      </div>
    </CenteringBlock>
  );
};

export default ErrorFallback;
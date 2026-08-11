interface ThrowErrorProps {
  shouldThrow?: boolean;
  errorMessage?: string;
  children?: React.ReactNode;
}

export const ThrowError: React.FC<ThrowErrorProps> = ({ 
  shouldThrow = true, 
  errorMessage = 'Тестовая ошибка!',
  children 
}) => {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return <>{children}</>;
};
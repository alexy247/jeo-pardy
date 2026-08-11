import { Component } from 'react';
import { sendLog } from "../lib/logger";
import { isDevMode } from '../lib/enviromentUtils';

interface IErrorBoundaryProps extends React.PropsWithChildren {
    userId?: string;
    sessionId?: string;
    fallback: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<IErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: IErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    logger = (message: string) => sendLog({
        level: 'error',
        userId: this.props.userId || 'anonym',
        sessionId: this.props.sessionId || 'unknown',
        component: 'ErrorBoundary',
        message: message
    });

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Сбрасываем состояние ошибки в "true" при первом возникновении
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (isDevMode) {
        console.error('❌ ErrorBoundary caught an error:', error, errorInfo);
    }

    this.logger(`Error caught. Error: ${error.message}, componentStack: ${errorInfo.componentStack}`);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

render() {
    const { hasError } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Если передан кастомный fallback — используем его
      return fallback;
    }

    return children;
  }
}

export default ErrorBoundary;
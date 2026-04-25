import { SessionId } from "../data/types";

type logLevel = 'info' | 'warn' | 'error' | 'debug';

interface ILoggerData {
    level: logLevel;
    userId: string;
    sessionId: SessionId;
    component: string;
    message: string;
}

export async function sendLog(logData: ILoggerData) {
    const data = {
        timestamp: new Date().toISOString(),
        level: logData.level,  // info, warn, error, debug
        service: 'jeo-pardy',
        message: logData.message,
        request_id: logData.component,
        environment: import.meta.env.VITE_NODE_ENV,
        status_code: 200,
        response_time: 1,
        request_method: 'sendLog',
        request_path: window.location.pathname,
        user_id: logData.userId,
        session_id: logData.sessionId,
        host: window.location.host,
        user_agent: navigator.userAgent
    };

    await fetch(`https://${import.meta.env.VITE_REACT_APP_TINYBIRD_HOST}/v0/events?name=logs`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 
            Authorization: `Bearer ${import.meta.env.VITE_REACT_APP_TINYBIRD_APPEND_TOKEN}`,
            'Content-Type': 'application/json',
        }
    });
}
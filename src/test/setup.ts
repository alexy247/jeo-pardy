import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Автоматически очищаем DOM после каждого теста
afterEach(() => {
  cleanup();
});
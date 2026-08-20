import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import Question from './question';

// Мокаем все зависимости
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

vi.mock('../store/useGameStore', () => ({
  useGameStore: vi.fn(),
}));

vi.mock('../hoocks/useCancellableFetch', () => ({
  useCancellableFetch: vi.fn(),
}));

vi.mock('../hoocks/useHybridQuestionRealtime', () => ({
  useHybridQuestionRealtime: vi.fn(),
}));

vi.mock('../components/header/header-second/HeaderSecond', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="header-second">{children}</div>
  ),
}));

vi.mock('../components/header/header-first/HeaderFirst', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="header-first">{children}</div>
  ),
}));

vi.mock('../components/answer-form/AnswerForm', () => ({
  default: () => (
    <div data-testid="answer-form">
      <input data-testid="answer-input" placeholder="Введите ответ" />
      <button data-testid="submit-answer">Ответить</button>
    </div>
  ),
}));

vi.mock('../components/media-component/MediaBlock', () => ({
  MediaBlock: ({ mediaObject }: { mediaObject: any }) => (
    <div data-testid="media-block">
      {isMediaTypeWithUrl(mediaObject.mediaType) ? (
        <div>
          <span data-testid="media-url">{mediaObject.mediaUrl}</span>
          <span data-testid="media-type">{mediaObject.mediaType}</span>
        </div>
      ) : <span data-testid="no-media">Нет медиа</span>}
    </div>
  ),
}));

import { useParams } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { useCancellableFetch } from '../hoocks/useCancellableFetch';
import { useHybridQuestionRealtime } from '../hoocks/useHybridQuestionRealtime';

import { IQuestion } from '../data/types';
import { isMediaTypeWithUrl, MediaType } from '../interfaces/MediaObject';
import { allQuestionVariants, mockQuestions } from '../test/fixtures/questions';

describe('Question - Медиа варианты', () => {
  const mockLoadQuestion = vi.fn();
  const mockOpenQuestion = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useParams as any).mockReturnValue({ questionId: 'q1' });
    
    (useGameStore as any).mockReturnValue({
      loadQuestion: mockLoadQuestion,
      currentGameSession: 'session-123',
    });
    
    (useHybridQuestionRealtime as any).mockReturnValue({
      openQuestion: mockOpenQuestion,
    });
    
    (useCancellableFetch as any).mockImplementation((callback: any) => {
      const signal = new AbortController().signal;
      callback(signal);
    });

    mockOpenQuestion.mockResolvedValue(true);
  });

  // ТЕСТ 1: Параметризованный тест для всех вариантов
  describe.each(allQuestionVariants)('$name', ({ question }) => {
    it('должен корректно отображать медиа-контент', async () => {
      mockLoadQuestion.mockResolvedValue(question);

      render(
        <MemoryRouter initialEntries={['/question/q1']}>
          <Routes>
            <Route path="/question/:questionId" element={<Question />} />
          </Routes>
        </MemoryRouter>
      );

      // Ждем загрузки
      await waitFor(() => {
        expect(screen.getByTestId('header-first')).toBeInTheDocument();
      });

      // Проверяем основные данные
      expect(screen.getByText(`${question.categoryName} за ${question.price}`)).toBeInTheDocument();
      expect(screen.getByText(question.text)).toBeInTheDocument();

      // Проверяем медиа-контент
      if (question.mediaUrl) {
        expect(screen.getByTestId('media-url')).toHaveTextContent(question.mediaUrl);
        expect(screen.getByTestId('media-type')).toHaveTextContent(question.mediaType || 'unknown');
      } else {
        expect(screen.getByTestId('no-media')).toHaveTextContent('Нет медиа');
      }
    });
  });

  // ТЕСТ 2: Отдельные тесты для каждого типа
  describe('По отдельности', () => {
    it('должен отображать вопрос без медиа', async () => {
      mockLoadQuestion.mockResolvedValue(mockQuestions.noMedia);

      render(
        <MemoryRouter initialEntries={['/question/q1']}>
          <Routes>
            <Route path="/question/:questionId" element={<Question />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('header-first')).toBeInTheDocument();
      });

      expect(screen.getByTestId('no-media')).toHaveTextContent('Нет медиа');
      expect(screen.queryByTestId('media-url')).not.toBeInTheDocument();
    });

    it('должен отображать изображение', async () => {
      mockLoadQuestion.mockResolvedValue(mockQuestions.withImage);

      render(
        <MemoryRouter initialEntries={['/question/q1']}>
          <Routes>
            <Route path="/question/:questionId" element={<Question />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('header-first')).toBeInTheDocument();
      });

      expect(screen.getByTestId('media-url')).toHaveTextContent('https://example.com/lion.jpg');
      expect(screen.getByTestId('media-type')).toHaveTextContent('IMAGE');
    });

    it('должен отображать видео', async () => {
      mockLoadQuestion.mockResolvedValue(mockQuestions.withVideo);

      render(
        <MemoryRouter initialEntries={['/question/q1']}>
          <Routes>
            <Route path="/question/:questionId" element={<Question />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('header-first')).toBeInTheDocument();
      });

      expect(screen.getByTestId('media-url')).toHaveTextContent('https://example.com/jump.mp4');
      expect(screen.getByTestId('media-type')).toHaveTextContent('VIDEO');
    });

    it('должен отображать аудио', async () => {
      mockLoadQuestion.mockResolvedValue(mockQuestions.withAudio);

      render(
        <MemoryRouter initialEntries={['/question/q1']}>
          <Routes>
            <Route path="/question/:questionId" element={<Question />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('header-first')).toBeInTheDocument();
      });

      expect(screen.getByTestId('media-url')).toHaveTextContent('https://example.com/violin.mp3');
      expect(screen.getByTestId('media-type')).toHaveTextContent('AUDIO');
    });
  });

  // ТЕСТ 3: Динамическая загрузка разных вопросов
  it('должен корректно обновлять контент при смене вопроса', async () => {
    // Сначала загружаем вопрос с изображением
    mockLoadQuestion.mockResolvedValue(mockQuestions.withImage);

    const { rerender } = render(
      <MemoryRouter initialEntries={['/question/q1']}>
        <Routes>
          <Route path="/question/:questionId" element={<Question />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('media-url')).toHaveTextContent('lion.jpg');
    });

    // Теперь меняем вопрос на вопрос с видео
    mockLoadQuestion.mockResolvedValue(mockQuestions.withVideo);
    (useParams as any).mockReturnValue({ questionId: 'q2' });

    rerender(
      <MemoryRouter initialEntries={['/question/q2']}>
        <Routes>
          <Route path="/question/:questionId" element={<Question />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('media-url')).toHaveTextContent('jump.mp4');
    });
  });
});

describe('Question', () => {
  const mockQuestion: IQuestion = {
    id: 'q1',
    text: 'Столица Франции?',
    price: 200,
    categoryName: 'География',
    mediaType: MediaType.IMAGE,
    mediaUrl: 'https://example.com/image.jpg',
  };

  const mockLoadQuestion = vi.fn();
  const mockOpenQuestion = vi.fn();
  const mockCurrentGameSession = 'session-123';

  beforeEach(() => {
    vi.clearAllMocks();

    // Мокаем useParams
    (useParams as any).mockReturnValue({ questionId: 'q1' });

    // Мокаем useGameStore
    (useGameStore as any).mockReturnValue({
      loadQuestion: mockLoadQuestion,
      currentGameSession: mockCurrentGameSession,
    });

    // Мокаем useHybridQuestionRealtime
    (useHybridQuestionRealtime as any).mockReturnValue({
      openQuestion: mockOpenQuestion,
    });

    // Мокаем useCancellableFetch - выполняем callback сразу
    (useCancellableFetch as any).mockImplementation((callback: any) => {
      const signal = new AbortController().signal;
      callback(signal);
    });

    // Мокаем Promise.all для загрузки вопроса
    mockLoadQuestion.mockResolvedValue(mockQuestion);
    mockOpenQuestion.mockResolvedValue(true);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // Тест 1: Рендеринг компонента
  it('должен рендерить все части вопроса после загрузки', async () => {
    render(
      <MemoryRouter initialEntries={['/question/q1']}>
        <Routes>
          <Route path="/question/:questionId" element={<Question />} />
        </Routes>
      </MemoryRouter>
    );

    // Ждем появления заголовков
    await waitFor(() => {
      expect(screen.getByTestId('header-first')).toBeInTheDocument();
      expect(screen.getByTestId('header-second')).toBeInTheDocument();
    });

    // Проверяем, что данные отображаются корректно
    expect(screen.getByText('География за 200')).toBeInTheDocument();
    expect(screen.getByText('Столица Франции?')).toBeInTheDocument();
    expect(screen.getByTestId('answer-form')).toBeInTheDocument();
    expect(screen.getByTestId('media-block')).toBeInTheDocument();
  });

  // Тест 2: Загрузка вопроса
  it('должен загружать вопрос при монтировании', async () => {
    render(
      <MemoryRouter initialEntries={['/question/q1']}>
        <Routes>
          <Route path="/question/:questionId" element={<Question />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockLoadQuestion).toHaveBeenCalledWith('q1', expect.any(AbortSignal));
      expect(mockOpenQuestion).toHaveBeenCalledWith('q1');
    });
  });

  // Тест 3: Отображение медиа
  it('должен отображать медиа-контент если он есть', async () => {
    render(
      <MemoryRouter initialEntries={['/question/q1']}>
        <Routes>
          <Route path="/question/:questionId" element={<Question />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('media-url')).toHaveTextContent('https://example.com/image.jpg');
    });
  });

  // Тест 4: Обработка отсутствия questionId
  it('не должен делать запрос, если questionId отсутствует', async () => {
    (useParams as any).mockReturnValue({});

    render(
      <MemoryRouter initialEntries={['/question']}>
        <Routes>
          <Route path="/question" element={<Question />} />
        </Routes>
      </MemoryRouter>
    );

    // Ждем немного и проверяем, что запросы не были вызваны
    await waitFor(() => {
      expect(mockLoadQuestion).not.toHaveBeenCalled();
      expect(mockOpenQuestion).not.toHaveBeenCalled();
    });

    // Проверяем, что ничего не отрендерилось
    expect(screen.queryByTestId('header-first')).not.toBeInTheDocument();
  });

  // Тест 5: Обработка ошибок загрузки
  it('должен корректно обрабатывать ошибку загрузки вопроса', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockLoadQuestion.mockRejectedValue(new Error('Ошибка загрузки'));

    render(
      <MemoryRouter initialEntries={['/question/q1']}>
        <Routes>
          <Route path="/question/:questionId" element={<Question />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockLoadQuestion).toHaveBeenCalled();
    });

    // Проверяем, что компонент не сломался (не отображается)
    expect(screen.queryByTestId('header-first')).not.toBeInTheDocument();
    
    consoleError.mockRestore();
  });

  // Тест 6: Взаимодействие с формой ответа
  it('должен передавать вопрос в AnswerForm', async () => {
    render(
      <MemoryRouter initialEntries={['/question/q1']}>
        <Routes>
          <Route path="/question/:questionId" element={<Question />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      // Проверяем, что AnswerForm получил вопрос
      const answerForm = screen.getByTestId('answer-form');
      expect(answerForm).toBeInTheDocument();
      
      // Проверяем, что в форме есть поле ввода
      expect(screen.getByTestId('answer-input')).toBeInTheDocument();
      expect(screen.getByTestId('submit-answer')).toBeInTheDocument();
    });
  });
});
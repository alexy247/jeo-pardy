import { IQuestion } from '../../data/types';
import { MediaType } from '../../interfaces/MediaObject';

// Тип вопроса: варианты медиа
export type QuestionVariant = 'no-media' | 'image' | 'video' | 'audio';

// Фабрика для создания вопросов разных типов
export const createMockQuestion = (
  variant: QuestionVariant,
  overrides?: Partial<IQuestion>
): IQuestion => {
  const baseQuestion: IQuestion = {
    id: 'q1',
    text: 'Столица Франции?',
    price: 200,
    categoryName: 'География',
    mediaType: MediaType.TEXT,
    mediaUrl: '',
  };

  const mediaVariants: Record<QuestionVariant, Partial<IQuestion>> = {
    'no-media': {
      // Без медиа
    },
    'image': {
      mediaUrl: 'https://example.com/paris.jpg',
      mediaType: MediaType.IMAGE,
    },
    'video': {
      mediaUrl: 'https://example.com/paris.mp4',
      mediaType: MediaType.VIDEO,
    },
    'audio': {
      mediaUrl: 'https://example.com/paris.mp3',
      mediaType: MediaType.AUDIO,
    },
  };

  return {
    ...baseQuestion,
    ...mediaVariants[variant],
    ...overrides,
  };
};

// Готовые мок-вопросы для каждого типа
export const mockQuestions = {
  noMedia: createMockQuestion('no-media', {
    id: 'q1',
    text: 'Столица Франции?',
    price: 200,
    categoryName: 'География',
  }),
  
  withImage: createMockQuestion('image', {
    id: 'q2',
    text: 'Какое животное изображено?',
    price: 300,
    categoryName: 'Животные',
    mediaUrl: 'https://example.com/lion.jpg',
    mediaType: MediaType.IMAGE,
  }),
  
  withVideo: createMockQuestion('video', {
    id: 'q3',
    text: 'Что происходит в видео?',
    price: 400,
    categoryName: 'Видео',
    mediaUrl: 'https://example.com/jump.mp4',
    mediaType: MediaType.VIDEO,
  }),
  
  withAudio: createMockQuestion('audio', {
    id: 'q4',
    text: 'Какой инструмент звучит?',
    price: 250,
    categoryName: 'Музыка',
    mediaUrl: 'https://example.com/violin.mp3',
    mediaType: MediaType.AUDIO,
  }),
};

// Массив всех вариантов для параметризованных тестов
export const allQuestionVariants: Array<{
  name: string;
  variant: QuestionVariant;
  question: IQuestion;
}> = [
  {
    name: 'без медиа',
    variant: 'no-media',
    question: mockQuestions.noMedia,
  },
  {
    name: 'с изображением',
    variant: 'image',
    question: mockQuestions.withImage,
  },
  {
    name: 'с видео',
    variant: 'video',
    question: mockQuestions.withVideo,
  },
  {
    name: 'с аудио',
    variant: 'audio',
    question: mockQuestions.withAudio,
  },
];
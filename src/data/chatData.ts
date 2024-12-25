import { ACADEMIC_QUESTIONS } from './questions/academic';
import { FACILITIES_QUESTIONS } from './questions/facilities';
import { CULTURAL_QUESTIONS } from './questions/cultural';
import { SPORTS_QUESTIONS } from './questions/sports';
import { ENTERTAINMENT_QUESTIONS } from './questions/entertainment';
import { GENERAL_QUESTIONS } from './questions/general';

export const TODAS_LAS_PREGUNTAS = {
  ...ACADEMIC_QUESTIONS,
  ...FACILITIES_QUESTIONS,
  ...CULTURAL_QUESTIONS,
  ...SPORTS_QUESTIONS,
  ...ENTERTAINMENT_QUESTIONS,
  ...GENERAL_QUESTIONS,
};
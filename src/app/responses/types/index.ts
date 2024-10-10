import { Form, Question } from '@prisma/client';

export interface ResponseWithAnswersAndOptions {
  id: string;
  formId: string;
  answers: AnswerWithOptions[];
}

export interface IndividualResponse {
  id: string;
  formId: string;
  answers: AnswerWithQuestionAndOptions[];
}

export interface IndividualResponseResult {
  response: IndividualResponse;
  count: number;
}

export interface Option {
  text: string;
}


interface BaseAnswer {
  id: string;
  responseId: string;
  questionId: string;
  text: string;
  optionIds: string[];
  options: Option[];
}

export interface AnswerWithOptions extends BaseAnswer {}

export interface AnswerWithQuestionAndOptions extends BaseAnswer {
  question: Question;
}




export interface ResponsWithAnswersAndForm {
  id: string;
  submittedDate: Date;
  answers: AnswerWithQuestionAndOptions[];
  form: Form;
}

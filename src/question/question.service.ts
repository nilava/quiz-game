import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './question.schema';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async findAll() {
    return this.questionModel.find().exec();
  }

  async getRandomQuestions(limit = 6) {
    return this.questionModel.aggregate([{ $sample: { size: limit } }]);
  }
}

import React, { useState } from 'react';
import { Plus, Trash2, ArrowDown, ArrowUp, Star, MessageSquare, List, CheckSquare } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { Question } from '../../types';

interface FormBuilderProps {
  initialQuestions?: Question[];
  onQuestionsChange: (questions: Question[]) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  initialQuestions = [],
  onQuestionsChange,
}) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);

  const handleAddQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: '',
      type,
      required: false,
      options: type === 'multiple-choice' ? [''] : undefined,
    };
    
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    onQuestionsChange(updatedQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
    onQuestionsChange(updatedQuestions);
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === questions.length - 1)
    ) {
      return;
    }
    
    const updatedQuestions = [...questions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedQuestions[index], updatedQuestions[newIndex]] = 
      [updatedQuestions[newIndex], updatedQuestions[index]];
    
    setQuestions(updatedQuestions);
    onQuestionsChange(updatedQuestions);
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
    onQuestionsChange(updatedQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    const question = { ...updatedQuestions[questionIndex] };
    
    if (!question.options) return;
    
    const options = [...question.options];
    options[optionIndex] = value;
    question.options = options;
    
    updatedQuestions[questionIndex] = question;
    setQuestions(updatedQuestions);
    onQuestionsChange(updatedQuestions);
  };

  const handleAddOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = { ...updatedQuestions[questionIndex] };
    
    if (!question.options) {
      question.options = [''];
    } else {
      question.options = [...question.options, ''];
    }
    
    updatedQuestions[questionIndex] = question;
    setQuestions(updatedQuestions);
    onQuestionsChange(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = { ...updatedQuestions[questionIndex] };
    
    if (!question.options || question.options.length <= 1) return;
    
    const options = [...question.options];
    options.splice(optionIndex, 1);
    question.options = options;
    
    updatedQuestions[questionIndex] = question;
    setQuestions(updatedQuestions);
    onQuestionsChange(updatedQuestions);
  };

  const getQuestionTypeIcon = (type: Question['type']) => {
    switch (type) {
      case 'rating':
        return <Star size={16} />;
      case 'text':
        return <MessageSquare size={16} />;
      case 'multiple-choice':
        return <List size={16} />;
      case 'yes-no':
        return <CheckSquare size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Star size={16} />}
          onClick={() => handleAddQuestion('rating')}
        >
          Add Rating
        </Button>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<MessageSquare size={16} />}
          onClick={() => handleAddQuestion('text')}
        >
          Add Text
        </Button>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<List size={16} />}
          onClick={() => handleAddQuestion('multiple-choice')}
        >
          Add Multiple Choice
        </Button>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<CheckSquare size={16} />}
          onClick={() => handleAddQuestion('yes-no')}
        >
          Add Yes/No
        </Button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No questions added yet. Use the buttons above to add questions.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id} className="relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600">
                    {index + 1}
                  </div>
                  <div className="flex items-center text-sm font-medium text-gray-600">
                    {getQuestionTypeIcon(question.type)}
                    <span className="ml-1 capitalize">{question.type} Question</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-600"
                    onClick={() => handleMoveQuestion(index, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-600"
                    onClick={() => handleMoveQuestion(index, 'down')}
                    disabled={index === questions.length - 1}
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-red-600"
                    onClick={() => handleRemoveQuestion(index)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="Question"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                  placeholder="Enter your question here"
                />

                {question.type === 'multiple-choice' && question.options && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Options
                    </label>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1"
                        />
                        <button
                          type="button"
                          className="p-1 text-gray-400 hover:text-red-600"
                          onClick={() => handleRemoveOption(index, optionIndex)}
                          disabled={question.options?.length === 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Plus size={16} />}
                      onClick={() => handleAddOption(index)}
                    >
                      Add Option
                    </Button>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`required-${question.id}`}
                    checked={question.required}
                    onChange={(e) => handleQuestionChange(index, 'required', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`required-${question.id}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Required
                  </label>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
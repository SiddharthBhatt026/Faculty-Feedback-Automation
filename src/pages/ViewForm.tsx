import React, { useState } from 'react';
import { ArrowLeft, Edit, Download, Share2, Trash2, CheckCircle, BarChart } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useFeedback } from '../context/FeedbackContext';
import { Question, FeedbackResponse } from '../types';
import { courses } from '../data/mockData';

interface ViewFormProps {
  formId: string;
  onBack: () => void;
}

interface ResponseSummaryItemProps {
  question: Question;
  responses: FeedbackResponse[];
}

const ResponseSummaryItem: React.FC<ResponseSummaryItemProps> = ({ 
  question, 
  responses 
}) => {
  // Get answers for this question
  const answers = responses
    .map(response => response.answers.find(a => a.questionId === question.id))
    .filter(Boolean);
  
  if (answers.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-1">{question.text}</h3>
        <p className="text-sm text-gray-500">No responses yet</p>
      </div>
    );
  }
  
  const renderResponseSummary = () => {
    switch (question.type) {
      case 'rating':
        const ratings = answers.map(a => Number(a?.answer || 0));
        const avgRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
        
        return (
          <div>
            <div className="flex items-center mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(avgRating) 
                        ? 'text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm font-medium">
                {avgRating.toFixed(1)} out of 5
              </span>
            </div>
            <p className="text-xs text-gray-500">Based on {ratings.length} responses</p>
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-2">
            {answers.map((answer, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md text-sm">
                {String(answer?.answer || '')}
              </div>
            ))}
          </div>
        );
      
      case 'multiple-choice':
        if (!question.options) return null;
        
        const optionCounts = question.options.reduce((acc, option) => {
          acc[option] = 0;
          return acc;
        }, {} as Record<string, number>);
        
        answers.forEach(answer => {
          const selectedOptions = Array.isArray(answer?.answer) 
            ? answer?.answer 
            : [answer?.answer];
          
          selectedOptions.forEach(option => {
            if (typeof option === 'string' && optionCounts[option] !== undefined) {
              optionCounts[option]++;
            }
          });
        });
        
        return (
          <div className="space-y-2">
            {Object.entries(optionCounts).map(([option, count]) => (
              <div key={option} className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ 
                      width: `${(count / answers.length) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="ml-2 text-xs text-gray-500">
                  {option}: {count} ({Math.round((count / answers.length) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        );
      
      case 'yes-no':
        const yesCount = answers.filter(a => String(a?.answer).toLowerCase() === 'yes').length;
        const noCount = answers.filter(a => String(a?.answer).toLowerCase() === 'no').length;
        const yesPercentage = Math.round((yesCount / answers.length) * 100);
        
        return (
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${yesPercentage}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-gray-500">
                Yes: {yesCount} ({yesPercentage}%)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-red-600 h-2.5 rounded-full" 
                  style={{ width: `${100 - yesPercentage}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-gray-500">
                No: {noCount} ({100 - yesPercentage}%)
              </span>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-900 mb-1">{question.text}</h3>
      {renderResponseSummary()}
    </div>
  );
};

const ViewForm: React.FC<ViewFormProps> = ({ formId, onBack }) => {
  const { getFormById, getResponsesByFormId } = useFeedback();
  const [activeTab, setActiveTab] = useState<'overview' | 'responses'>('overview');
  
  const form = getFormById(formId);
  const responses = getResponsesByFormId(formId);
  
  if (!form) {
    return (
      <div>
        <Button 
          variant="ghost" 
          leftIcon={<ArrowLeft size={16} />} 
          onClick={onBack}
        >
          Back
        </Button>
        <p className="mt-4">Form not found.</p>
      </div>
    );
  }
  
  const course = courses.find(c => c.id === form.courseId);
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const isActive = form.isActive;
  const isExpired = new Date(form.deadline) < new Date();

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft size={16} />}
          onClick={onBack}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 ml-2">{form.title}</h1>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <Badge 
            variant={isActive ? (isExpired ? 'warning' : 'success') : 'default'}
          >
            {isActive ? (isExpired ? 'Expired' : 'Active') : 'Inactive'}
          </Badge>
          {form.isAnonymous && (
            <Badge variant="info">Anonymous</Badge>
          )}
          <span className="text-sm text-gray-500">
            Created on {formatDate(form.createdAt)}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Edit size={16} />}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Download size={16} />}
          >
            Export
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Share2 size={16} />}
          >
            Share
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Trash2 size={16} />}
          >
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Form Details</CardTitle>
                </div>
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${
                      activeTab === 'overview'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${
                      activeTab === 'responses'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('responses')}
                  >
                    Responses
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === 'overview' ? (
                <div>
                  <p className="text-gray-700 mb-4">{form.description}</p>
                  
                  <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-medium">Questions</h3>
                    {form.questions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-md p-4">
                        <div className="flex items-center mb-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mr-2">
                            {index + 1}
                          </span>
                          <h4 className="text-sm font-medium">{question.text}</h4>
                          {question.required && (
                            <span className="ml-2 text-xs text-red-500">Required</span>
                          )}
                        </div>
                        
                        <div className="ml-8">
                          <p className="text-xs text-gray-500 mb-1">
                            Type: <span className="capitalize">{question.type}</span>
                          </p>
                          
                          {question.type === 'multiple-choice' && question.options && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">Options:</p>
                              <ul className="list-disc list-inside text-sm text-gray-700">
                                {question.options.map((option, i) => (
                                  <li key={i} className="ml-2">{option}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  {responses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No responses yet.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <p className="text-sm text-gray-500">
                          Showing {responses.length} responses
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<BarChart size={16} />}
                        >
                          View Analytics
                        </Button>
                      </div>
                      
                      <div>
                        {form.questions.map((question) => (
                          <ResponseSummaryItem
                            key={question.id}
                            question={question}
                            responses={responses}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Course</p>
                  <p className="font-medium">
                    {course ? `${course.code}: ${course.name}` : 'Unknown Course'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="font-medium">{formatDate(form.deadline)}</p>
                  {isActive && !isExpired && (
                    <p className="text-xs text-gray-500">
                      {Math.ceil((new Date(form.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                    </p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Responses</p>
                  <p className="font-medium">{responses.length}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Questions</p>
                  <p className="font-medium">{form.questions.length}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                fullWidth
                variant={isActive ? 'danger' : 'primary'}
                leftIcon={isActive ? <CheckCircle size={16} /> : <CheckCircle size={16} />}
              >
                {isActive ? 'Deactivate Form' : 'Activate Form'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewForm;
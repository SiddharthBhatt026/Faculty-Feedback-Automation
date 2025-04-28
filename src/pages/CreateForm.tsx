import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import FormBuilder from '../components/feedback/FormBuilder';
import { useFeedback } from '../context/FeedbackContext';
import { useAuth } from '../context/AuthContext';
import { Question, FeedbackForm } from '../types';
import { courses } from '../data/mockData';

interface CreateFormProps {
  onBack: () => void;
  onCreateSuccess: (formId: string) => void;
}

const CreateForm: React.FC<CreateFormProps> = ({ onBack, onCreateSuccess }) => {
  const { createForm } = useFeedback();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Get courses for the current faculty
  const facultyCourses = courses.filter(
    course => course.facultyId === currentUser?.id
  );
  
  // Calculate minimum date (today) for deadline input
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !courseId || !deadline || questions.length === 0) {
      alert('Please fill in all required fields and add at least one question.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newForm: Omit<FeedbackForm, 'id' | 'createdAt'> = {
        title,
        description,
        courseId,
        questions,
        deadline,
        isActive: true,
        isAnonymous,
      };
      
      const createdForm = await createForm(newForm);
      onCreateSuccess(createdForm.id);
    } catch (error) {
      console.error('Error creating form:', error);
      alert('An error occurred while creating the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900 ml-2">Create Feedback Form</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="space-y-4">
                <Input
                  label="Form Title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Mid-semester Feedback for CS101"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the purpose of this feedback form"
                    rows={3}
                    className="w-full rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
            </Card>
          </div>
          
          <div>
            <Card>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <select
                    required
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select a course</option>
                    {facultyCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code}: {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Input
                  label="Deadline"
                  type="date"
                  required
                  min={minDate}
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="anonymous"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Allow anonymous responses
                  </label>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Form Questions</h2>
          <FormBuilder
            initialQuestions={questions}
            onQuestionsChange={setQuestions}
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Save size={16} />}
          >
            Create Form
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
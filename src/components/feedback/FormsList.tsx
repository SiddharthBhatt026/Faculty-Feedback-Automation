import React from 'react';
import { PlusCircle, Search } from 'lucide-react';
import Button from '../ui/Button';
import { FeedbackForm, FeedbackSummary } from '../../types';
import FeedbackCard from './FeedbackCard';

interface FormsListProps {
  forms: FeedbackForm[];
  summaries: FeedbackSummary[];
  onCreateForm: () => void;
  onViewFormDetails: (formId: string) => void;
}

const FormsList: React.FC<FormsListProps> = ({
  forms,
  summaries,
  onCreateForm,
  onViewFormDetails,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'active' | 'inactive'>('all');

  const filteredForms = forms.filter((form) => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase())
      || form.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ? true : 
      filter === 'active' ? form.isActive : 
      !form.isActive;
    
    return matchesSearch && matchesFilter;
  });

  const getSummaryForForm = (formId: string) => {
    return summaries.find(summary => summary.formId === formId);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Feedback Forms</h2>
        <Button
          onClick={onCreateForm}
          leftIcon={<PlusCircle size={16} />}
        >
          Create New Form
        </Button>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search forms..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'active' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={filter === 'inactive' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('inactive')}
          >
            Inactive
          </Button>
        </div>
      </div>
      
      {filteredForms.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No forms found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? `No forms match "${searchTerm}". Try a different search term.` 
              : "You haven't created any forms yet."}
          </p>
          <div className="mt-6">
            <Button
              onClick={onCreateForm}
              leftIcon={<PlusCircle size={16} />}
            >
              Create New Form
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <FeedbackCard
              key={form.id}
              form={form}
              summary={getSummaryForForm(form.id)}
              onViewDetails={onViewFormDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FormsList;
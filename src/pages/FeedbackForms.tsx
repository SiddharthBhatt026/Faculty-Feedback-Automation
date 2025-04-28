import React from 'react';
import { useFeedback } from '../context/FeedbackContext';
import FormsList from '../components/feedback/FormsList';

interface FeedbackFormsProps {
  onCreateForm: () => void;
  onViewFormDetails: (formId: string) => void;
}

const FeedbackForms: React.FC<FeedbackFormsProps> = ({
  onCreateForm,
  onViewFormDetails,
}) => {
  const { forms, summaries } = useFeedback();
  
  return (
    <div>
      <FormsList
        forms={forms}
        summaries={summaries}
        onCreateForm={onCreateForm}
        onViewFormDetails={onViewFormDetails}
      />
    </div>
  );
};

export default FeedbackForms;
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  FeedbackForm, 
  FeedbackResponse, 
  FeedbackSummary, 
  ActionItem,
  Question
} from '../types';
import { 
  feedbackForms as initialForms, 
  feedbackResponses as initialResponses,
  feedbackSummaries as initialSummaries,
  actionItems as initialActionItems
} from '../data/mockData';

interface FeedbackContextType {
  forms: FeedbackForm[];
  responses: FeedbackResponse[];
  summaries: FeedbackSummary[];
  actionItems: ActionItem[];
  createForm: (form: Omit<FeedbackForm, 'id' | 'createdAt'>) => Promise<FeedbackForm>;
  updateForm: (id: string, updates: Partial<FeedbackForm>) => Promise<FeedbackForm>;
  deleteForm: (id: string) => Promise<boolean>;
  submitResponse: (response: Omit<FeedbackResponse, 'id' | 'submittedAt'>) => Promise<FeedbackResponse>;
  createActionItem: (item: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ActionItem>;
  updateActionItem: (id: string, updates: Partial<ActionItem>) => Promise<ActionItem>;
  getFormById: (id: string) => FeedbackForm | undefined;
  getSummaryByFormId: (formId: string) => FeedbackSummary | undefined;
  getResponsesByFormId: (formId: string) => FeedbackResponse[];
  getActionItemsByFormId: (formId: string) => ActionItem[];
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [forms, setForms] = useState<FeedbackForm[]>(initialForms);
  const [responses, setResponses] = useState<FeedbackResponse[]>(initialResponses);
  const [summaries, setSummaries] = useState<FeedbackSummary[]>(initialSummaries);
  const [actionItems, setActionItems] = useState<ActionItem[]>(initialActionItems);

  const createForm = async (formData: Omit<FeedbackForm, 'id' | 'createdAt'>): Promise<FeedbackForm> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newForm: FeedbackForm = {
          ...formData,
          id: `form-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        setForms([...forms, newForm]);
        resolve(newForm);
      }, 500);
    });
  };

  const updateForm = async (id: string, updates: Partial<FeedbackForm>): Promise<FeedbackForm> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const formIndex = forms.findIndex(form => form.id === id);
        if (formIndex === -1) {
          reject(new Error('Form not found'));
          return;
        }
        
        const updatedForm = { ...forms[formIndex], ...updates };
        const updatedForms = [...forms];
        updatedForms[formIndex] = updatedForm;
        setForms(updatedForms);
        resolve(updatedForm);
      }, 500);
    });
  };

  const deleteForm = async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setForms(forms.filter(form => form.id !== id));
        resolve(true);
      }, 500);
    });
  };

  const submitResponse = async (responseData: Omit<FeedbackResponse, 'id' | 'submittedAt'>): Promise<FeedbackResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newResponse: FeedbackResponse = {
          ...responseData,
          id: `response-${Date.now()}`,
          submittedAt: new Date().toISOString(),
        };
        setResponses([...responses, newResponse]);
        
        // Update summary if exists
        const existingSummary = summaries.find(s => s.formId === responseData.formId);
        if (existingSummary) {
          const updatedSummary = {
            ...existingSummary,
            responseCount: existingSummary.responseCount + 1,
          };
          setSummaries(summaries.map(s => s.formId === responseData.formId ? updatedSummary : s));
        }
        
        resolve(newResponse);
      }, 500);
    });
  };

  const createActionItem = async (itemData: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ActionItem> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date().toISOString();
        const newItem: ActionItem = {
          ...itemData,
          id: `action-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
        setActionItems([...actionItems, newItem]);
        resolve(newItem);
      }, 500);
    });
  };

  const updateActionItem = async (id: string, updates: Partial<ActionItem>): Promise<ActionItem> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const itemIndex = actionItems.findIndex(item => item.id === id);
        if (itemIndex === -1) {
          reject(new Error('Action item not found'));
          return;
        }
        
        const updatedItem = { 
          ...actionItems[itemIndex], 
          ...updates, 
          updatedAt: new Date().toISOString() 
        };
        const updatedItems = [...actionItems];
        updatedItems[itemIndex] = updatedItem;
        setActionItems(updatedItems);
        resolve(updatedItem);
      }, 500);
    });
  };

  const getFormById = (id: string): FeedbackForm | undefined => {
    return forms.find(form => form.id === id);
  };

  const getSummaryByFormId = (formId: string): FeedbackSummary | undefined => {
    return summaries.find(summary => summary.formId === formId);
  };

  const getResponsesByFormId = (formId: string): FeedbackResponse[] => {
    return responses.filter(response => response.formId === formId);
  };

  const getActionItemsByFormId = (formId: string): ActionItem[] => {
    return actionItems.filter(item => item.formId === formId);
  };

  return (
    <FeedbackContext.Provider value={{
      forms,
      responses,
      summaries,
      actionItems,
      createForm,
      updateForm,
      deleteForm,
      submitResponse,
      createActionItem,
      updateActionItem,
      getFormById,
      getSummaryByFormId,
      getResponsesByFormId,
      getActionItemsByFormId,
    }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = (): FeedbackContextType => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
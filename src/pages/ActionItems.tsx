import React, { useState } from 'react';
import { Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useFeedback } from '../context/FeedbackContext';
import { useAuth } from '../context/AuthContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { ActionItem } from '../types';

const ActionItems: React.FC = () => {
  const { actionItems, createActionItem, updateActionItem, forms } = useFeedback();
  const { currentUser } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newActionItem, setNewActionItem] = useState({
    description: '',
    formId: '',
  });

  const facultyActionItems = actionItems.filter(
    item => item.facultyId === currentUser?.id
  );

  const facultyForms = forms.filter(form => {
    const course = courses.find(c => c.id === form.courseId);
    return course?.facultyId === currentUser?.id;
  });

  const handleCreateActionItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionItem.description || !newActionItem.formId) return;

    try {
      await createActionItem({
        description: newActionItem.description,
        formId: newActionItem.formId,
        facultyId: currentUser?.id || '',
        status: 'pending',
      });
      setIsCreating(false);
      setNewActionItem({ description: '', formId: '' });
    } catch (error) {
      console.error('Error creating action item:', error);
    }
  };

  const handleStatusUpdate = async (itemId: string, newStatus: ActionItem['status']) => {
    try {
      await updateActionItem(itemId, { status: newStatus });
    } catch (error) {
      console.error('Error updating action item:', error);
    }
  };

  const getStatusIcon = (status: ActionItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'in-progress':
        return <Clock size={16} className="text-blue-500" />;
      case 'pending':
        return <AlertCircle size={16} className="text-yellow-500" />;
    }
  };

  const getStatusBadgeVariant = (status: ActionItem['status']): 'success' | 'info' | 'warning' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'info';
      case 'pending':
        return 'warning';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Action Items</h1>
        <Button
          onClick={() => setIsCreating(true)}
          leftIcon={<Plus size={16} />}
        >
          Create Action Item
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Action Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateActionItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Related Form
                </label>
                <select
                  value={newActionItem.formId}
                  onChange={(e) => setNewActionItem(prev => ({ ...prev, formId: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a form</option>
                  {facultyForms.map(form => (
                    <option key={form.id} value={form.id}>{form.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={newActionItem.description}
                  onChange={(e) => setNewActionItem(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Create
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facultyActionItems.map(item => {
          const form = forms.find(f => f.id === item.formId);
          return (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {getStatusIcon(item.status)}
                    <Badge
                      variant={getStatusBadgeVariant(item.status)}
                      className="ml-2"
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {form?.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>

                <div className="flex justify-end space-x-2">
                  {item.status !== 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(item.id, 'completed')}
                    >
                      Mark Complete
                    </Button>
                  )}
                  {item.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(item.id, 'in-progress')}
                    >
                      Start Progress
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ActionItems;
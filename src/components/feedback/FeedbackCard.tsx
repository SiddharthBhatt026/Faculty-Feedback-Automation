import React from 'react';
import { CalendarClock, Users, ArrowRight, Eye } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { FeedbackForm, FeedbackSummary } from '../../types';

interface FeedbackCardProps {
  form: FeedbackForm;
  summary?: FeedbackSummary;
  onViewDetails: (formId: string) => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ 
  form, 
  summary, 
  onViewDetails 
}) => {
  const isActive = form.isActive;
  const responseCount = summary?.responseCount || 0;
  const averageRating = summary?.averageRating || 0;
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Calculate days remaining until deadline
  const calculateDaysRemaining = (deadlineString: string) => {
    const deadline = new Date(deadlineString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysRemaining = calculateDaysRemaining(form.deadline);
  const isExpired = daysRemaining < 0;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="flex-1">{form.title}</CardTitle>
          <Badge 
            variant={isActive ? (isExpired ? 'warning' : 'success') : 'default'}
            className="ml-2 self-start"
          >
            {isActive ? (isExpired ? 'Expired' : 'Active') : 'Inactive'}
          </Badge>
        </div>
        <CardDescription>{form.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <CalendarClock size={16} className="text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Deadline</p>
              <p className="text-sm font-medium">
                {formatDate(form.deadline)}
                {!isExpired && (
                  <span className="text-xs ml-2 text-gray-500">
                    ({daysRemaining} days left)
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Users size={16} className="text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Responses</p>
              <p className="text-sm font-medium">{responseCount}</p>
            </div>
          </div>
        </div>
        
        {summary && summary.averageRating > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Average Rating</p>
            <div className="flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(averageRating) 
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
              <span className="text-sm font-medium ml-2">
                {averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        )}
        
        {form.isAnonymous && (
          <Badge variant="info" size="sm">Anonymous</Badge>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          variant="outline"
          fullWidth
          rightIcon={<ArrowRight size={16} />}
          onClick={() => onViewDetails(form.id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeedbackCard;
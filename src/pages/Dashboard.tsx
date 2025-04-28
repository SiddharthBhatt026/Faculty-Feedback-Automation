import React from 'react';
import { Calendar, Clock, BarChart, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import DashboardMetrics from '../components/feedback/DashboardMetrics';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { courses } from '../data/mockData';

interface RecentActivityProps {
  title: string;
  timestamp: string;
  description: string;
  type: 'form' | 'response' | 'action';
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  title,
  timestamp,
  description,
  type,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'form':
        return <Calendar size={16} className="text-blue-500" />;
      case 'response':
        return <Clock size={16} className="text-purple-500" />;
      case 'action':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'form':
        return 'primary';
      case 'response':
        return 'secondary';
      case 'action':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <div className="flex items-start py-4 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0 mr-4">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          {getIcon()}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex-shrink-0 ml-4 flex flex-col items-end">
        <Badge variant={getTypeColor()} size="sm">
          {type === 'form' ? 'Form' : type === 'response' ? 'Response' : 'Action'}
        </Badge>
        <p className="mt-1 text-xs text-gray-500">{timestamp}</p>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { forms, summaries, responses, actionItems } = useFeedback();
  
  // Select courses for the current faculty
  const facultyCourses = courses.filter(
    course => course.facultyId === currentUser?.id
  );
  
  // Get pending action items
  const pendingActions = actionItems.filter(
    item => item.facultyId === currentUser?.id && item.status !== 'completed'
  );
  
  // For faculty: recent forms, recent responses to their forms
  // For admin: all recent activity
  const isAdmin = currentUser?.role === 'admin';
  const isFaculty = currentUser?.role === 'faculty';
  
  const recentActivities = [
    {
      title: "Mid-semester Feedback Form Created",
      timestamp: "2 hours ago",
      description: "A new feedback form was created for CS101",
      type: "form" as const,
    },
    {
      title: "New Response Received",
      timestamp: "3 hours ago",
      description: "A student submitted feedback for MATH201",
      type: "response" as const,
    },
    {
      title: "Action Item Completed",
      timestamp: "1 day ago",
      description: "Created supplementary materials for challenging topics",
      type: "action" as const,
    },
    {
      title: "End of Semester Evaluation Created",
      timestamp: "2 days ago",
      description: "A new evaluation form was created for PHYS301",
      type: "form" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {currentUser?.name}! Here's what's happening with your feedback.
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            rightIcon={<BarChart size={16} />}
          >
            View Analytics
          </Button>
        </div>
      </div>

      <DashboardMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-gray-100">
                {recentActivities.map((activity, index) => (
                  <RecentActivity
                    key={index}
                    title={activity.title}
                    timestamp={activity.timestamp}
                    description={activity.description}
                    type={activity.type}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Pending Action Items</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingActions.length === 0 ? (
                <p className="text-gray-500 text-sm">No pending action items.</p>
              ) : (
                <div className="space-y-4">
                  {pendingActions.map((action) => (
                    <div 
                      key={action.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          variant={action.status === 'in-progress' ? 'info' : 'warning'}
                          size="sm"
                        >
                          {action.status === 'in-progress' ? 'In Progress' : 'Pending'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(action.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{action.description}</p>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm" variant="outline">
                          Mark Complete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
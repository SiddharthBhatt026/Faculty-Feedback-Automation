import React from 'react';
import { Users, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../ui/Card';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  color,
}) => {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-semibold">{value}</p>
          
          {trend && (
            <div className="mt-1 flex items-center">
              <span 
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          )}
          
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        </div>
        
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <div className={`text-${color}-600`}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
};

const DashboardMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Active Feedback Forms"
        value={12}
        description="Currently available for responses"
        icon={<FileText size={24} />}
        trend={{ value: 8, isPositive: true }}
        color="blue"
      />
      
      <MetricCard
        title="Total Responses"
        value={243}
        description="Across all feedback forms"
        icon={<Users size={24} />}
        trend={{ value: 12, isPositive: true }}
        color="purple"
      />
      
      <MetricCard
        title="Avg. Rating"
        value="4.2/5"
        description="Overall faculty satisfaction"
        icon={<CheckCircle size={24} />}
        trend={{ value: 0.5, isPositive: true }}
        color="green"
      />
      
      <MetricCard
        title="Pending Action Items"
        value={8}
        description="Requiring attention"
        icon={<AlertCircle size={24} />}
        trend={{ value: 3, isPositive: false }}
        color="yellow"
      />
    </div>
  );
};

export default DashboardMetrics;
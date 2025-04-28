import React from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { useAuth } from '../context/AuthContext';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { format } from 'date-fns';

const Analytics: React.FC = () => {
  const { forms, responses, summaries } = useFeedback();
  const { currentUser } = useAuth();

  // Filter forms for the current faculty
  const facultyForms = forms.filter(form => {
    const course = courses.find(c => c.id === form.courseId);
    return course?.facultyId === currentUser?.id;
  });

  // Prepare data for response trends
  const responseTrends = facultyForms.map(form => {
    const formResponses = responses.filter(r => r.formId === form.id);
    return {
      id: form.title,
      data: formResponses.reduce((acc: any[], response) => {
        const date = format(new Date(response.submittedAt), 'yyyy-MM-dd');
        const existing = acc.find(item => item.x === date);
        if (existing) {
          existing.y += 1;
        } else {
          acc.push({ x: date, y: 1 });
        }
        return acc;
      }, []).sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime())
    };
  });

  // Prepare data for rating distribution
  const ratingDistribution = Array(5).fill(0);
  responses.forEach(response => {
    response.answers.forEach(answer => {
      if (typeof answer.answer === 'number' && answer.answer >= 1 && answer.answer <= 5) {
        ratingDistribution[answer.answer - 1]++;
      }
    });
  });

  const ratingData = ratingDistribution.map((count, index) => ({
    rating: `${index + 1} Star${index === 0 ? '' : 's'}`,
    count,
  }));

  // Prepare data for sentiment analysis
  const sentimentData = summaries.map(summary => ({
    id: summary.sentimentScore >= 0.7 ? 'Positive' : summary.sentimentScore >= 0.4 ? 'Neutral' : 'Negative',
    value: 1,
    color: summary.sentimentScore >= 0.7 ? '#10B981' : summary.sentimentScore >= 0.4 ? '#F59E0B' : '#EF4444'
  })).reduce((acc, curr) => {
    const existing = acc.find(item => item.id === curr.id);
    if (existing) {
      existing.value += curr.value;
    } else {
      acc.push(curr);
    }
    return acc;
  }, [] as any[]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveLine
                data={responseTrends}
                margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
                xScale={{ type: 'time', format: '%Y-%m-%d' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                axisBottom={{
                  format: '%b %d',
                  tickRotation: -45,
                }}
                pointSize={8}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                enableSlices="x"
                useMesh={true}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveBar
                data={ratingData}
                keys={['count']}
                indexBy="rating"
                margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
                padding={0.3}
                colors={{ scheme: 'nivo' }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Count',
                  legendPosition: 'middle',
                  legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsivePie
                data={sentimentData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: 'nivo' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                radialLabelsSkipAngle={10}
                radialLabelsTextXOffset={6}
                radialLabelsTextColor="#333333"
                radialLabelsLinkOffset={0}
                radialLabelsLinkDiagonalLength={16}
                radialLabelsLinkHorizontalLength={24}
                radialLabelsLinkStrokeWidth={1}
                radialLabelsLinkColor={{ from: 'color' }}
                slicesLabelsSkipAngle={10}
                slicesLabelsTextColor="#333333"
                animate={true}
                motionStiffness={90}
                motionDamping={15}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summaries.map(summary => (
                <div key={summary.formId} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">
                    {forms.find(f => f.id === summary.formId)?.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Response Rate</p>
                      <p className="font-medium">{summary.responseCount} responses</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Average Rating</p>
                      <p className="font-medium">{summary.averageRating.toFixed(1)} / 5.0</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-500 text-sm mb-1">Top Comments</p>
                    <ul className="list-disc list-inside text-sm">
                      {summary.topComments.map((comment, index) => (
                        <li key={index}>{comment}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
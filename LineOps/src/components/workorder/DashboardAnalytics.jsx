import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import '../../styles/DashboardAnalytics.css';
import PropTypes from 'prop-types';


const DashboardAnalytics = ({ workOrders, cars }) => {
  // Flatten work orders into a single array
  const allOrders = [
    ...(workOrders.pending || []),
    ...(workOrders.inprogress || []),
    ...(workOrders.complete || [])
  ];

  // Prepare data for status chart
  const statusData = [
    { name: 'Pending', value: workOrders.pending?.length || 0 },
    { name: 'In Progress', value: workOrders.inprogress?.length || 0 },
    { name: 'Complete', value: workOrders.complete?.length || 0 },
  ];

  // Compute department counts
  const departmentCounts = allOrders.reduce((acc, order) => {
    const dept = order.department || 'Unknown';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const departmentData = Object.entries(departmentCounts).map(([key, value]) => ({
    name: key,
    value,
  }));

  // Prepare data for car status chart
  const carStatusCounts = cars?.reduce((acc, car) => {
    const status = car.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const carStatusData = Object.entries(carStatusCounts || {}).map(([key, value]) => ({
    name: key,
    value,
  }));

  // Color sets for charts
  const COLORS = ['#0088FE', '#FFBB28', '#FF8042', '#9C27B0', '#4CAF50', '#795548'];

  // Custom Label Component

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return value ? (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12px"
      >
        {`${value} (${(percent * 100).toFixed(0)}%)`}
      </text>
    ) : null;
  };

  CustomLabel.propTypes = {
    cx: PropTypes.number.isRequired,
    cy: PropTypes.number.isRequired,
    midAngle: PropTypes.number.isRequired,
    innerRadius: PropTypes.number.isRequired,
    outerRadius: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  // Custom Tooltip Component

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      CustomTooltip.propTypes = {
        active: PropTypes.bool.isRequired,
        payload: PropTypes.array,
      };
    
      return (
        <div style={{ 
          backgroundColor: '#40444b',
          padding: '8px',
          border: '1px solid #202225',
          borderRadius: '4px'
        }}>
          <p style={{ color: '#fff', margin: 0 }}>
            {`${payload[0].name}: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="analytics-container">
      {/* Status Breakdown Chart */}
      <div className="chart-container">
        <h3 className="chart-title">Status Breakdown</h3>
        <div className="pie-chart-wrapper">
          <PieChart width={350} height={300}>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={<CustomLabel />}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              align="center" 
              layout="horizontal" 
              wrapperStyle={{ paddingTop: '10px' }}
            />
          </PieChart>
        </div>
      </div>

      {/* Department Breakdown Chart */}
      <div className="chart-container">
        <h3 className="chart-title">Department Breakdown</h3>
        <div className="pie-chart-wrapper">
          <PieChart width={350} height={300}>
            <Pie
              data={departmentData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#82ca9d"
              label={<CustomLabel />}
            >
              {departmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              align="center" 
              layout="horizontal" 
              wrapperStyle={{ paddingTop: '10px' }}
            />
          </PieChart>
        </div>
      </div>

      {/* Car Status Breakdown Chart */}
      <div className="chart-container">
        <h3 className="chart-title">Car Status Breakdown</h3>
        <div className="pie-chart-wrapper">
          <PieChart width={350} height={300}>
            <Pie
              data={carStatusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#FF8042"
              label={<CustomLabel />}
            >
              {carStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              align="center" 
              layout="horizontal" 
              wrapperStyle={{ paddingTop: '10px' }}
            />
          </PieChart>
        </div>
      </div>
    </div>
  );
};
DashboardAnalytics.propTypes = {
  workOrders: PropTypes.shape({
    pending: PropTypes.array,
    inprogress: PropTypes.array,
    complete: PropTypes.array,
  }).isRequired,
  cars: PropTypes.array.isRequired,
};

export default DashboardAnalytics;
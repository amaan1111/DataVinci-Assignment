import React, { useState, useEffect } from "react";
import { Table, DatePicker, Select } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import "./styles.css"; // Import the CSS file for styling

const { RangePicker } = DatePicker;
const { Option } = Select;

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [dimensionFilter, setDimensionFilter] = useState("");

  useEffect(() => {
    // Fetch data from Shopify and update the 'data' state
    fetchData();
  }, []);

  const fetchData = () => {
    // Implement the logic to fetch data from Shopify API and update 'data' state
    const fetchedData = [
      { date: "2023-01-01", value: 100, dimension: "A" },
      { date: "2023-01-02", value: 150, dimension: "B" },
      { date: "2023-01-03", value: 200, dimension: "A" }
      // ...
    ];
    setData(fetchedData);
    setFilteredData(fetchedData);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    filterData(dates, dimensionFilter);
  };

  const handleDimensionFilterChange = (value) => {
    setDimensionFilter(value);
    filterData(dateRange, value);
  };

  const filterData = (dates, dimension) => {
    let filtered = data;
    if (dates.length === 2) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= dates[0] && itemDate <= dates[1];
      });
    }
    if (dimension) {
      filtered = filtered.filter((item) => item.dimension === dimension);
    }
    setFilteredData(filtered);
  };

  const scorecardItems = [
    { label: "Total Orders", value: filteredData.length },
    {
      label: "Total Sales",
      value: filteredData.reduce((total, item) => total + item.value, 0)
    },
    {
      label: "Average Sales",
      value: (
        filteredData.reduce((total, item) => total + item.value, 0) /
        filteredData.length
      ).toFixed(2)
    },
    {
      label: "Unique Dimensions",
      value: [...new Set(filteredData.map((item) => item.dimension))].length
    }
    // Add more scorecard items as needed
  ];

  const scorecards = scorecardItems.map((item, index) => (
    <div key={index} className="scorecard">
      <h3>{item.label}</h3>
      <p>{item.value}</p>
    </div>
  ));

  const graphData = filteredData.map((item) => ({
    date: item.date,
    value: item.value
  }));

  const tableColumns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Value", dataIndex: "value", key: "value" },
    { title: "Dimension", dataIndex: "dimension", key: "dimension" }
  ];

  return (
    <div>
      <div className="filters">
        <RangePicker onChange={handleDateRangeChange} />
        <Select
          placeholder="Select Dimension"
          onChange={handleDimensionFilterChange}
        >
          <Option value="A">A</Option>
          <Option value="B">B</Option>
          {/* Add more options for dimensions */}
        </Select>
      </div>
      <div className="scorecards">{scorecards}</div>
      <div className="graph">
        <LineChart width={800} height={300} data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </div>
      <div className="table">
        <Table
          columns={tableColumns}
          dataSource={filteredData}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default App;

import { Box, Container, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

const Dashboard = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const loadGoogleCharts = () => {
      if (window.google && window.google.charts) {
        window.google.charts.load('current', { packages: ['corechart'] });
        window.google.charts.setOnLoadCallback(drawChart);
      }
    };

    const drawChart = async () => {
      try {
        if (!token) return;

        const response = await fetch('./api/books/statstics', {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token from state
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to fetch data:', errorData.message);
          return;
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error('Unexpected response format:', data);
          return;
        }

        const chartData = [['Category', 'Count']];
        data.forEach(item => {
          chartData.push([item.category, parseInt(item.count, 10)]);
        });

        const dataTable = window.google.visualization.arrayToDataTable(chartData);
        const options = {
          title: 'Books by Category',
          pieHole: 0.4,
          tooltip: { text: 'percentage' },
        };

        const chart = new window.google.visualization.PieChart(document.getElementById('piechart_3d'));
        chart.draw(dataTable, options);
      } catch (error) {
        console.error('Error fetching or drawing chart:', error);
      }
    };

    if (token) {
      loadGoogleCharts();
    }
  }, [token]);

  //for book status
  useEffect(() => {
    const loadGoogleCharts = () => {
      if (window.google && window.google.charts) {
        window.google.charts.load('current', { packages: ['corechart', 'bar'] });
        window.google.charts.setOnLoadCallback(drawTrendlines);
      }
    };

    const drawTrendlines = async () => {
      try {
        const response = await fetch('./api/admin/statusStat');
        const data = await response.json();

        const dataTable = new window.google.visualization.DataTable();
        dataTable.addColumn('string', 'Status');
        dataTable.addColumn('number', 'Count');

        dataTable.addRows([
          ['Approved', data.approved || 0],
          ['Rejected', data.rejected || 0],
        ]);

        const options = {
          title: 'Count of Approved and Rejected Books',
          hAxis: { title: 'Status' },
          vAxis: { title: 'Count' },
          legend: { position: 'none' },
          bars: 'vertical', // Bar chart
          // colors: ['#2196F3', '#F44336'], // Custom colors: Blue for Approved, Red for Rejected
        };

        const chart = new window.google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(dataTable, options);
      } catch (error) {
        console.error('Error fetching or drawing chart:', error);
      }
    };

    loadGoogleCharts();
  }, []);
// for users status
useEffect(() => {
  const loadGoogleCharts = () => {
    if (window.google && window.google.charts) {
      window.google.charts.load('current', { packages: ['corechart'] });
      window.google.charts.setOnLoadCallback(drawVisualization);
    }
  };

  const drawVisualization = async () => {
    try {
      const response = await fetch('./api/admin/userstatus');
      const data = await response.json();

      // Prepare data for Google Charts
      const chartData = google.visualization.arrayToDataTable([
        ['Status', 'Count'],
        ['Approved', data.approved],
        ['Pending', data.pending],
      ]);

      const options = {
        title: 'Number of Users by Status',
        hAxis: { title: 'Status' },
        vAxis: { title: 'Count' },
        colors: ['#2196F3', '#FF5722'], // Blue for Approved, Red for Pending
      };

      const chart = new google.visualization.BarChart(document.getElementById('chart_div2'));
      chart.draw(chartData, options);
    } catch (error) {
      console.error('Error fetching or drawing chart:', error);
    }
  };

  loadGoogleCharts();
}, []);
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Container
            maxWidth="sm"
            sx={{ ml: 2, mt: 2, flex: 1 }}
          >
            <Typography variant="h4" gutterBottom color="#23395B" sx={{ mb: 4, fontWeight: 'bold' }}>
              Book Statistics by Category
            </Typography>
            <Paper elevation={3} sx={{ p: 2 }}>
              <div id="piechart_3d" style={{ width: '100%', height: '500px' }}></div>
            </Paper>
          </Container>
          <Container
            maxWidth="sm"
            sx={{ ml: 2, mt: 2, flex: 1 }}
          >
             <Typography variant="h4" gutterBottom color="#23395B" sx={{ mb: 4, fontWeight: 'bold' }}>
            Book Status Statistics
          </Typography>
          <Paper elevation={3} sx={{ p: 2 }}>
            <div id="chart_div" style={{ width: '100%', height: '500px' }}></div>
          </Paper>
          </Container>
        </Box>
        <Container maxWidth="lg" sx={{ ml: 2, mt: 2 }}>
          <Typography variant="h4" gutterBottom color="#23395B" sx={{ mb: 4, fontWeight: 'bold' }}>
            User Status Statistics
          </Typography>
          <Paper elevation={3} sx={{ p: 2 }}>
            <div id="chart_div2" style={{ width: '100%', height: '500px' }}></div>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;

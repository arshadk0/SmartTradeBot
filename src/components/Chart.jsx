import React from 'react'
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import '../App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const cdata =[2,3,-4,-6,5];
const color = cdata.map((item) => item>0 ? 'rgba(53, 162, 235, 0.5)' : 'rgba(255, 99, 132, 0.5)');

const Chart = () => {
     
  const data = {
    labels: ['Red', 'Orange', 'Blue','green' , 'yellow'],
    datasets: [
        {
          label: ['Profit'],
          data: cdata,
          backgroundColor: color,
          borderWidth: 0.2,
        }
    ]
}
 
  return (
    <>
    <div className='heading'>
      Finance Chart
    </div>
    <div className='chart-container'>
      <Bar
        data={data}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Cryptocurrency prices"
            },
            legend: {
              display: true,
              position: "bottom"
           }
          }
        }}
      />
    </div>
    </>
  )
}

export default Chart
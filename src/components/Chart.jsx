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
const color = cdata.map((item) => item>0 ? 'blue' : 'red');

const Chart = () => {
     
  const data = {
    labels: ['Red', 'Orange', 'Blue','green' , 'yellow'],
    datasets: [
        {
          label: 'Popularity of colours',
          data: cdata,
          backgroundColor: color,
          borderWidth: 1,
        }
    ]
}
 
  return (
    <div>
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
  )
}

export default Chart
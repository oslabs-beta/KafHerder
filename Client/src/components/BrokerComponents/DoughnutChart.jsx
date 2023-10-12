import React, { useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);


function DoughnutChart({ chartData }) {
    const visualData = {
        labels: ['Online Partitions', 'Offline Partitions'],
        datasets: [{
          label: '# of Partitions',
          data: [chartData.kafka_server_replicamanager_partitioncount, chartData.kafka_server_replicamanager_offlinereplicacount],
          backgroundColor: ['#72D1C8', '#ED9097'],
          borderColor: ['#72D1C8', '#ED9097'],
        }]
    }
  return <Doughnut data={visualData} />
  
}

export default DoughnutChart
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartServices = (props: any) => {
  const [services, setServices] = useState(['Atm', 'Financial', 'Shipping', 'Mail']);
  const [customersServed, setCustomersServed] = useState([30, 10, 5, 20]);


  


//   useEffect(() => {
//       // Funzione per recuperare i nomi dei servizi
//     const fetchServiceNames = async () => {
//         const response = await API.getNameServices();
//         setServices(response.data);
//     };

//     const fetchCustomerData = async () => {
//         // Funzione per recuperare il numero di clienti serviti tramite API
//         const response = await API.getNumCustomerServed();
//         setCustomersServed(response.data);
//     };
//     fetchServiceNames();
//     fetchCustomerData();
//   }, []);

  const getData = () => {
    return {
      labels: services, // Colonne dinamiche dai nomi dei servizi
      datasets: [
        {
          label: 'Customers Served',
          data: customersServed, // Dati dinamici
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1,
        },
      ],
    };
  };

  const getOptions = () => {
    return {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Customers Served Per Service',
        },
      },
    };
  };

  return <Bar data={getData()} options={getOptions()} />;
};


const BarChartCounters = (props: any) => {
    const [services, setServices] = useState(['Atm', 'Financial', 'Shipping', 'Mail']);
    const [customersServed, setCustomersServed] = useState([[30, 10, 5, 20],
                                                            [23, 5, 6, 12],
                                                            [10, 23, 0, 2],
                                                            [5, 10, 0, 10]]);
  
    const DATA_COUNT = 7;
    const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};
    
    const labels = ['Counter 1', 'Counter 2', 'Counter 3', 'Counter 4', 'Counter 5', 'Counter 6'];
    const data = {
        labels: labels,
        datasets: [
        {
            label: 'Dataset 1',
            data: [20, 10, 5],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
            label: 'Dataset 1',
            data: [20, 10, 5],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },{
            label: 'Dataset 1',
            data: [20, 10, 5],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },
        ]
    };
    
  
  
  //   useEffect(() => {
  //       // Funzione per recuperare i nomi dei servizi
  //     const fetchServiceNames = async () => {
  //         const response = await API.getNameServices();
  //         setServices(response.data);
  //     };
  
  //     const fetchCustomerData = async () => {
  //         // Funzione per recuperare il numero di clienti serviti tramite API
  //         const response = await API.getNumCustomerServed();
  //         setCustomersServed(response.data);
  //     };
  //     fetchServiceNames();
  //     fetchCustomerData();
  //   }, []);
  
    const getData = () => {
      return {
        labels: services, // Colonne dinamiche dai nomi dei servizi
        datasets: [
          {
            label: 'Customers Served',
            data: customersServed, // Dati dinamici
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
          },
        ],
      };
    };
  
    const getOptions = () => {
      return {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Chart.js Bar Chart - Stacked',
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      };
    };
  
    return <Bar data={getData()} options={getOptions()} />;
  };

export { BarChartServices, BarChartCounters };

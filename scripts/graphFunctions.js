
export async function displayEnergyForTrip(input, element){

    var ctx = document.getElementById(element).getContext('2d');

    let chartStatus = Chart.getChart(element); 
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }

    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: input[3],
            datasets: [{
                label: 'Energy used in a single trip for',
                data: input[2],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    
    })

};

export async function displayTotalEnergyForTrip(input,element){
    
    let labels=[]
    let totalEnergy=[]
    var ctx = document.getElementById(element).getContext('2d');
    input.map(x=>{
        labels.push(x.driverName)
        totalEnergy.push(x.driverEnergy)
    })
    console.log("labels:", labels)
    console.log("totalE:", totalEnergy)
   
    const myChart2 = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Total Energy per Driver',
            data: totalEnergy,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }

})

};


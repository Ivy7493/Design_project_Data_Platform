let currentSelection = {}
let adminTable;
let adminTableConfig;

let driverTable;
let driverConfig;

let carTable;
let carConfig;

export function setAdminTable(document, data){
    let gridDiv = document.querySelector('#myGrid');
    gridDiv.innerHTML = ""
    const columnDefs = [
        { field: "username" },
        { field: "email" },
        { field: "access" }
      ];
      
      // specify the data
      let rowData = []
      data.map(x => {
        let temp = {
            username: x.user.username, email: x.user.email, access: x.user.level
        }
        rowData.push(temp)
      })
      // let the grid know which columns and what data to use
      const gridOptions = {
        columnDefs: columnDefs,
        rowData: rowData,
        rowSelection: 'single',
        onSelectionChanged: () => {
            const selectedData = gridOptions.api.getSelectedRows();
            currentSelection = selectedData;
          },
      };
      adminTableConfig = gridOptions
      adminTable = new agGrid.Grid(gridDiv, adminTableConfig);
}

export function setDriverTable(data){
  let gridDiv = document.querySelector('#driverTable');
    gridDiv.innerHTML = ""
    const columnDefs = [
        { field: "DriverID" },
        { field: "name" },
        { field: "deviceID" },
        { field: "car" },
        { field: "employement" }
      ];
     
      // specify the data
      let rowData = []
      data.map(x => {
        
        let temp = {
            DriverID: x.driverID ,name: x.name,deviceID: x.deviceID, car: x.car, employement: x.employement
        }
        rowData.push(temp)
      })
      // let the grid know which columns and what data to use
      const gridOptions = {
        columnDefs: columnDefs,
        rowData: rowData,
        rowSelection: 'single',
        onSelectionChanged: () => {
            const selectedData = gridOptions.api.getSelectedRows();
            currentSelection = selectedData;
            
          },
      };
      driverConfig = gridOptions
      driverTable = new agGrid.Grid(gridDiv, driverConfig);
}

export function setCarTable(data){
  let gridDiv = document.querySelector('#carTable');
    gridDiv.innerHTML = ""
    const columnDefs = [
        { field: "CarID" },
        { field: "name" },
        { field: "mass" },
        { field: 'area'},
        { field: 'drag'},
        {field: 'fuelType'},
        { field: "operation" }
      ];
     
      // specify the data
      let rowData = []
      data.map(x => {
        
        let temp = {
            CarID: x.carID , name: x.name, mass: x.mass, area: x.area, drag: x.drag, fuelType: x.fuelType,  operation: x.operation
        }
        rowData.push(temp)
      })
      // let the grid know which columns and what data to use
      const gridOptions = {
        columnDefs: columnDefs,
        rowData: rowData,
        rowSelection: 'single',
        onSelectionChanged: () => {
            const selectedData = gridOptions.api.getSelectedRows();
            currentSelection = selectedData;
            
          },
      };
      carConfig = gridOptions
      carTable = new agGrid.Grid(gridDiv, carConfig);
}

export function RemoveAdminEntry(){
    adminTableConfig.api.applyTransaction({ remove: currentSelection});
}

export function getCurrentTableSelection(){
    return currentSelection
}
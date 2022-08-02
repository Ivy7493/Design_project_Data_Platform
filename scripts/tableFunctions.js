let currentSelection = {}
let adminTable;
let adminTableConfig;

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
        console.log(x)
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
            console.log('Selection Changed', currentSelection);
          },
      };
      adminTableConfig = gridOptions
      adminTable = new agGrid.Grid(gridDiv, adminTableConfig);
}

export function RemoveAdminEntry(){
    adminTableConfig.api.applyTransaction({ remove: currentSelection});
}

export function getCurrentTableSelection(){
    return currentSelection
}
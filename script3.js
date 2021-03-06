var columnDefs = [
    {
        headerName: "Athlete", 
        field: "athlete", 
        width: 150, 
        "checkboxSelection": true, 
        headerCheckboxSelection: true, 
        headerCheckboxSelectionFilteredOnly:true,
        floatingFilterComponentParams: {
            suppressFilterButton: true,
            // color: 'red'
            // isFullWidthCell: true,
        
        },
    },
];

function RowSelected(event){
    if(event.node.isSelected()){
      console.log("deselected");
      event.node.setSelected(false, false);
    } else {
      event.node.setSelected(true);
      console.log("selected, add");
    }
    
}

var gridOptions = {
    columnDefs: columnDefs,
    onRowClicked: RowSelected,
    suppressRowClickSelection: true,
    enableRangeSelection: true,
    enableCellChangeFlash: true,
    rowSelection: 'multiple',
    rowData: null,
    headerHeight: 0,
    components: {
        // headerHeight: 1500,
        customNumberFloatingFilter: getNumberFloatingFilterComponent()
    },
    floatingFilter: true,
    onGridReady: function (params) {
        params.api.sizeColumnsToFit();
    },
};
function getNumberFloatingFilterComponent() {
    function NumberFloatingFilter() {
    }

    NumberFloatingFilter.prototype.init = function (params) {
        // this.suppressResize = true;
        // this.isFullWidthCell = true;
        this.onFloatingFilterChanged = params.onFloatingFilterChanged;
        this.eGui = document.createElement('div');
        this.eGui.innerHTML = '<input type="text"/>'
        this.currentValue = null;
        this.eFilterInput = this.eGui.querySelector('input');
        this.eFilterInput.style.color = 'red';
        var that = this;
        function onInputBoxChanged() {
            if (that.eFilterInput.value === '') {
                //Remove the filter
                that.onFloatingFilterChanged(null);
                return;
            }

            that.currentValue = String(that.eFilterInput.value);
            that.onFloatingFilterChanged({
                model: {
                    //In this example we are only interested in filtering by greaterThan
                    type: 'equals',
                    filter: that.currentValue
                }
            });
        }
        this.eFilterInput.addEventListener('input', onInputBoxChanged);
    };

    NumberFloatingFilter.prototype.onParentModelChanged = function (parentModel) {
        // When the filter is empty we will receive a null message her
        if (!parentModel) {
            this.eFilterInput.value = '';
            this.currentValue = null;
        } else {
            this.eFilterInput.value = parentModel.filter + '';
            this.currentValue = parentModel.filter;
        }
    };

    NumberFloatingFilter.prototype.getGui = function () {
        return this.eGui;
    };

    return NumberFloatingFilter;
}
function selectAllAmerican() {
    gridOptions.api.forEachNode( function (node) {
        if (node.data.country === 'United States') {
            node.setSelected(true);
        }
    });
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', './data.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});
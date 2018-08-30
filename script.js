
var columnDefs = [
    {
        headerName: "Gold", 
        field: "gold",
        filter: 'agTextColumnFilter', 
        suppressMenu: true,
        // suppressColumnVirtualisation: true,
        // suppressResize: true,
        // suppressSizeToFit: true,
        floatingFilterComponent: 'customNumberFloatingFilter',
        floatingFilterComponentParams: {
            suppressFilterButton: true,
            // color: 'red'
            
        },
        // width: "500",
    
        headerClass: 'my-css-class',

     
    },
];

var gridOptions = {
    components: {
        headerHeight: 1500,
        customNumberFloatingFilter: getNumberFloatingFilterComponent()
    },
    floatingFilter: true,
    columnDefs: columnDefs,
    // enableColResize: true,
    rowData: null,
    headerHeight: 0,
    // enableFilter: true,
    // suppressColumnVirtualisation: true,
    // colSpan: 51

    headerCellRenderer: (params) =>{return '<h1 column="headerColDef">' + 111 + '</h1>'}
};

function getNumberFloatingFilterComponent() {
    function NumberFloatingFilter() {
    }

    NumberFloatingFilter.prototype.init = function (params) {
        // this.suppressResize = true;
        this.onFloatingFilterChanged = params.onFloatingFilterChanged;
        this.eGui = document.createElement('div');
        this.eGui.innerHTML = '<input style="width:100%" type="text"/>'
        this.currentValue = null;
        this.eFilterInput = this.eGui.querySelector('input');
        // this.eFilterInput.style.color = params.color;
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



// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid-docs/master/src/olympicWinnersSmall.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});
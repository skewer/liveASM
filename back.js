//define some sample data
//var Tabulator = require('tabulator-tables');
var tabledata = [
    {id:1, name:"Oli Bob", age:"12", col:"red", dob:"",rating:5},
    {id:2, name:"Mary May", age:"1", col:"blue", dob:"14/05/1982"},
    {id:3, name:"Christine Lobowski", age:"42", col:"green", dob:"22/05/1982"},
    {id:4, name:"Brendon Philips", age:"125", col:"orange", dob:"01/08/1980"},
    {id:5, name:"Margret Marmajuke", age:"16", col:"yellow", dob:"31/01/1999"},
];
function checkRow(row) {
    var rowData = row.getData();
    var id = rowData.id;
    var input = rowData.input;
    var output = rowData.output;
    if(isNaN(id) || id>15 || id < 0){
        alert("Wrong id");
    }
    if(isNaN(input) || input>15 || input < 0){
        alert("Wrong input");
    }
    if(isNaN(output) || output>15 || output < 0){
        alert("Wrong output");
    }
}
var table = new Tabulator("#example-table", {
	data:tabledata,           //load row data from array
	layout:"fitDataFill",      //fit columns to width of table
	responsiveLayout:"hide",  //hide columns that dont fit on the table
	tooltips:true,            //show tool tips on cells
	addRowPos:"top",          //when adding a new row, add it to the top of the table
	history:true,             //allow undo and redo actions on the table
	pagination:"local",       //paginate the data
	paginationSize:16,         //allow 7 rows per page of data
	movableColumns:true,      //allow column order to be changed
	resizableRows:true,       //allow row order to be changed
	initialSort:[             //set the initial sort order of the data
		{column:"name", dir:"asc"},
	],
	columns:[                 //define the table columns
        {title:"PE", field:"id", editor:"input",formatter:function(cell, formatterParams){
            var value = cell.getValue()
            if(value > 15)
            {
                return "<span style='color:red; font-weight:bold;'>" + value + "</span>";
            }
            else {
                return value;
            }
        }},
        //{title:"type",field:"type",editor:"select",editorParams:{values:["ALU", "Load","Store"]}},
        {title:"type",field:"type",editor:"select",editorParams:{values:["ALU", "Load","Store"]}},
		{title:"Input", field:"input", align:"left", editor:"input"},
		{title:"Output", field:"output", width:95, editor:"input"}
    ],
    cellEdited:function(cell){
        //cell - cell component
        var colField = cell.getColumn().getField();
        var cellValue = cell.getValue();
        switch (colField) {
            case "id":
                if(isNaN(cellValue) || cellValue>15 || cellValue < 0){
                    alert("Wrong id");
                }
                break;
            case "input":
                    if(isNaN(cellValue) || cellValue>15 || cellValue < 0){
                        alert("Wrong input");
                    }
                    break;
            case "output":
                    if(isNaN(cellValue) || cellValue>15 || cellValue < 0){
                        alert("Wrong output");
                    }
                    break;
            default:
                break;
        }
    },
});

$("#add-row").click(function(){
    table.addRow({});
});
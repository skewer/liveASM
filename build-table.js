function addPage(table, pageSize){
    for (var i = 0; i < pageSize; i++) {
        table.push({id:rowNum,cycle:Math.floor(rowNum/pageSize),pe_id:i});
        rowNum++;
    }
}

function buildConnect(dimSize, method){
    var connect = {"in":[],"out":[]};
    for(var j=0;j<dimSize;j++){
        for(var i=0;i<dimSize;i++){
            var peIn=[];
            var peOut=[];
            if(i>0){
                peIn.push(i-1+j*dimSize);
            }
            if(j>0){
                peIn.push(i+(j-1)*dimSize);
            }
            if(i<dimSize-1){
                peOut.push(i+1+j*dimSize);
            }
            if(j<dimSize-1){
                peOut.push(i+(j+1)*dimSize)
            }
            connect["in"].push(peIn);
            connect["out"].push(peOut);       
        }
    }
    return connect;
}

var peNum=16;
var validPeNum="max:"+(peNum-1);
var peaConnect =buildConnect(4,"systolic");
var colNameOverview = [{title:"Cycle", field:"id", headerVertical:false, sorter:"number"}];
for(var i=0;i<peNum;i++){
    colNameOverview.push({title:"PE"+i, field:"pe"+i, headerVertical:false});
}
var tableOverview = new Tabulator("#confOverview", {
	//data:tabledata,           //load row data from array
	layout:"fitColumns",      //fit columns to width of table
	responsiveLayout:"hide",  //hide columns that dont fit on the table
	tooltips:true,            //show tool tips on cells
	addRowPos:"top",          //when adding a new row, add it to the top of the table
	history:true,             //allow undo and redo actions on the table
	pagination:"local",       //paginate the data
	paginationSize:peNum,         //allow 7 rows per page of data
	//movableColumns:true,      //allow column order to be changed
	resizableRows:true,       //allow row order to be changed
	initialSort:[             //set the initial sort order of the data
		{column:"id", dir:"asc"},
	],
    columns:colNameOverview,
    resizableRows:false,
    //resizableColumns:false,
});

var rowNum = 0;
var tabledata = [];
addPage(tabledata,peNum);
var tableConfPerCycle = new Tabulator("#confPerCycle", {
	data:tabledata,           //load row data from array
	layout:"fitColumns",      //fit columns to width of table
	responsiveLayout:"hide",  //hide columns that dont fit on the table
	tooltips:true,            //show tool tips on cells
	addRowPos:"top",          //when adding a new row, add it to the top of the table
    history:true,             //allow undo and redo actions on the table
    height:"460px",
    groupBy:"cycle",
    groupToggleElement:"header",
    // pagination:"local",       //paginate the data
    // paginationSize:peNum,         //allow 7 rows per page of data
    // paginationAddRow:"table",
    //paginationSizeSelector:true,
    movableColumns:true,      //allow column order to be changed
    resizableRows:false,
    //resizableColumns:false,
	initialSort:[             //set the initial sort order of the data
		{column:"name", dir:"asc"},
	],
    columns:[                 //define the table columns
        {title:"ID", field:"id",hideInHtml:true},
        {title:"Cycle", field:"cycle"},
        {title:"PE", field:"pe_id",validator:["min:0",validPeNum]},
        {title:"Type",field:"pe_type",headerSort:false, editor:"select",editorParams:{values:["ALU", "Load","Store"]}},
        {title:"Input", field:"input", align:"left", editor:"select",editorParams:function(cell){
            row = cell.getRow().getData();
            return peaConnect["in"][row.pe_id]
        }},
        {title:"Output", field:"output", width:95, editor:"select",editorParams:function(cell){
            row = cell.getRow().getData();
            return peaConnect["out"][row.pe_id]
        }},
        {title:"Repeat", field:"repeat", editor:"input",validator:["min:0","max:255"]},
    ],
    dataOverview:[],
    dataEdited:function(data){
        //data - the updated table data
        dataOverview = [];
        for(var i=0;i<rowNum/peNum;i++){
            var row ={};
            row.id=i;
            for(var j=0;j<peNum;j++){
                row["PE"+j]="null";
            }
            dataOverview.push(row);
        }
        data.forEach(row => {
            //var rowData = row.getData();
            if("pe_type" in row && !(row.pe_type===undefined)){
            var key = "pe"+row.pe_id;
            var id = Math.floor(row.id/peNum);
            var t = row.pe_type;
            dataOverview[id][key]=t;
            }
        });
        tableOverview.replaceData(dataOverview);
    },
    dataLoaded:function(data){
        //data - all data loaded into the table
        dataOverview = [];
        for(var i=0;i<data.length/peNum;i++){
            var row ={};
            row.id=i;
            for(var j=0;j<peNum;j++){
                row["PE"+j]="null";
            }
            dataOverview.push(row);
        }
        data.forEach(row => {
            //var rowData = row.getData();
            if("pe_type" in row && !(row.pe_type===undefined)){
            var key = "pe"+row.pe_id;
            var id = Math.floor(row.id/peNum);
            var t = row.pe_type;
            dataOverview[id][key]=t;
            }
        });
        tableOverview.replaceData(dataOverview);
    },
    cellClick:function(e, cell){
        row = cell.getRow().getData();
        document.getElementById("txtPe").innerHTML = "PE:"+row.pe_id+" Input:"+peaConnect["in"][row.pe_id]+" Output:"+peaConnect["out"][row.pe_id];
    },

    downloadConfig:{
        columnGroups:false, //include column groups in column headers for download
        rowGroups:false, //do not include row groups in download
        columnCalcs:false, //do not include column calculation rows in download
    },
});
document.getElementById("add-page").onclick=function(){
    for(var i=0;i<peNum;i++){
    tableConfPerCycle.addRow({id:rowNum,cycle:Math.floor(rowNum/peNum),pe_id:i});
    rowNum++;
    }
    
    tableConfPerCycle.setSort("id", "asc");
};

document.getElementById("download-json").onclick=function(){
    tableConfPerCycle.download("json", "data.json");
};

document.getElementById("load-json").onclick=function(){
    tableConfPerCycle.setDataFromLocalFile(".json");

};


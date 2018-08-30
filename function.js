var Stopdata;
var chose;
function choose_route(num) {
	   chose = num;
        $("#chose").html("<input type=\"button\" class=\"btn btn-primary\" value=\"去程\" onclick=\"querry_route(0)\"><input type=\"button\" class=\"btn btn-primary\" value=\"回程\" onclick=\"querry_route(1)\">");
}
function querry_route(direction){
    link="https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/Keelung?" +
        "$filter=RouteUID eq \'" + 
        Stopdata[chose]["RouteUID"] + 
        "\' and Direction eq \'" + 
        direction +
        "\'&$format=json" ;
    $.ajax({
        type:"GET",
        url:link,
        dataType:"json",
        success:function(msg){
            txt = "";
            dict = {}; 
            for(var i=0;i<msg.length;i++){
                dict[msg[i]["StopUID"]] = msg[i]["EstimateTime"]/60;
            }
            index = chose + direction;
            for(var i=0;i<Stopdata[index]["Stops"].length;i++){
                if (Stopdata[index]["Stops"][i]["StopUID"] in dict){
                    if(isNaN(dict[Stopdata[index]["Stops"][i]["StopUID"]])){
                        time="未發車";
                    }else{
                        time=dict[Stopdata[index]["Stops"][i]["StopUID"]];
                    }
                }else{
                    time="進站中";
                }
                txt = txt + Stopdata[index]["Stops"][i]["StopName"]["Zh_tw"] +
                    " " + time + "<br>";
            }
            $("#route").html(txt);
        }
    })
}
function querry_busName() {
    var key = document.getElementById("keyword");
    alert(key);
    link="https://ptx.transportdata.tw/MOTC/v2/Bus/StopOfRoute/City/Keelung?" + 
         "$select=RouteUID,Stops,RouteName&"+
	     "$filter=contains(RouteName/Zh_tw,\'" + key.value + "\') eq true" +
	     "&$format=json";
    console.log(link);
    $.ajax({
        type:"GET",
        url:link,
        dataType:"json",
        success:function(msg){
	    alert("hi");
            Stopdata = msg;
            txt = "";
            for (var i=0;i<msg.length;i+=2){ 
                txt = txt + "<button type=\"button\" class=\"btn btn-success\"              onclick=choose_route(" +
                    i + ")>" +
                    msg[i]["RouteName"]["Zh_tw"] + "</button>";
                tmp = msg[i]["RouteName"]["Zh_tw"];
                console.log(tmp);
            }
            $("#busName").html(txt);
        }
    });
}

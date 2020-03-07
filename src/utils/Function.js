export const dataFormat = data=>{

}

export const axiosTiming=(instance, callback) => {
    instance.interceptors.request.use((request) => {
        request.ts = performance.now()
        return request
    })

    instance.interceptors.response.use((response) => {
        callback(Number(performance.now() - response.config.ts))
        return response
    })
}

export const getTime = (Time,format)=>{
    if(!Time){
        Time = new Date();
    }else{
        //将输入的Time转成date
    }
    var year_2 = date.getYear(); //获取当前年份(2位)

    var year = date.getFullYear(); //获取完整的年份(4位)

    var month = date.getMonth(); //获取当前月份(0-11,0代表1月)

    var date = date.getDate(); //获取当前日(1-31)

    var day = date.getDay(); //获取当前星期X(0-6,0代表星期天)

    var time = date.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)

    var hours = date.getHours(); //获取当前小时数(0-23)

    var minutes = date.getMinutes(); //获取当前分钟数(0-59)

    var seconds = date.getSeconds(); //获取当前秒数(0-59)

    var milliseconds = date.getMilliseconds(); //获取当前毫秒数(0-999)

    var LocaleDateString = date.toLocaleDateString(); //获取当前日期

    var mytime=date.toLocaleTimeString(); //获取当前时间

    var LocaleString = date.toLocaleString( ); //获取日期与时间

    var returnVlaue="";
    switch(format){
        case "yyyy":
                returnVlaue = year;
            break;
        case "yy":
                returnVlaue = year2;
            break;
        default:
            break;
    }
    return returnVlaue;
}
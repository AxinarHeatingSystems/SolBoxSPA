import dayjs from "dayjs";

export const parsingDeviceData = (devData) => {
    // let devArr = [];
    const tmpDevData = devData;
    const attrKeys = Object.keys(tmpDevData.attributes);
    if (attrKeys.find(keyItem => keyItem === 'DeviceName')) {
      tmpDevData.DeviceName = tmpDevData.attributes['DeviceName'][0];
    } else {
      tmpDevData.DeviceName = tmpDevData.name
    }

    attrKeys.map(keyItem => {
    
      if(keyItem === 'devSchedules'){
        console.log(keyItem)
        tmpDevData.attributes[keyItem] = parsingScheduledata(tmpDevData.attributes[keyItem]);
        
      }else{
        console.log(keyItem)
        tmpDevData.attributes[keyItem] = tmpDevData.attributes[keyItem][0]
      }
      
    })
    return tmpDevData;
  }


  const parsingScheduledata = (scheduleStrArr) => {
    let scheduleArr = [];
    scheduleStrArr.map(strItem => {
      const splitArr = strItem.split('-');
      const startTimeArr = splitArr[2].split(':');
      const endTimeArr = splitArr[3].split(':');
      console.log(strItem.split('-'), startTimeArr);
      scheduleArr.push({
        weekDay: splitArr[0],
        targetTemp: splitArr[1] === "null"? null : parseInt(splitArr[1]),
        times: [
          {
            start: startTimeArr[0] === "0"? null : dayjs(new Date().setTime(startTimeArr[0])),
            end: endTimeArr[0] === "0"? null : dayjs(new Date().setTime(endTimeArr[0]))
          },
          {
            start: startTimeArr[1] === "0"? null : dayjs(new Date().setTime(startTimeArr[1])),
            end: endTimeArr[1] === "0"? null : dayjs(new Date().setTime(endTimeArr[1]))
          },
          {
            start: startTimeArr[2] === "0"? null : dayjs(new Date().setTime(startTimeArr[2])),
            end: endTimeArr[2] === "0"? null : dayjs(new Date().setTime(endTimeArr[2]))
          }
        ]
      })
    })
    return scheduleArr;
  }
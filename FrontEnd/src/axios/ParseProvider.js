export const parsingDeviceData = (devData) => {
    // let devArr = [];
    const tmpDevData = devData;
    const attrKeys = Object.keys(tmpDevData.attributes);
    if (attrKeys.find(keyItem => keyItem === 'DeviceName')) {
      tmpDevData.DeviceName = tmpDevData.attributes['DeviceName'][0];
    } else {
      tmpDevData.DeviceName = tmpDevData.name
    }
    attrKeys.map(keyItem => tmpDevData.attributes[keyItem] = tmpDevData.attributes[keyItem][0])
    return tmpDevData;
  }
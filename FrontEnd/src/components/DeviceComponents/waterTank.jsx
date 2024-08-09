import { Box } from "@mui/system"
import steamImg from '../../assets/steam.svg'
import { useEffect, useState } from "react";

export const WaterTank = ({ isMobile, isPortrait, WaterTemp, bgColor }) => {
  const [steamCount, setSteamCount] = useState(1);
  const [steamArr, setSteamArr] = useState([]);
  useEffect(() => {

    const tmpCounter = Math.floor((parseFloat(WaterTemp) * 0.1) + 1);
    if (steamCount !== tmpCounter) {
      setSteamCount(tmpCounter)
      let tempSteamArr = []
      for (let index = 0; index < tmpCounter; index++) {
        tempSteamArr.push({
          animationDelay: `${(Math.random() * 5)}s`,
          left: `${110 - parseInt(Math.random() * 40)}px`
        })
      }
      setSteamArr(tempSteamArr);
    }


  }, [WaterTemp])
  return (
    <Box position={"relative"}>
      {steamArr.map((steamItem, key) => (
        <div key={key} className="steamDot" src={steamImg}
          style={{
            animationDelay: steamItem.animationDelay,
            left: steamItem.left
          }}
        ></div>
      ))}
      {/* {(() => {
        const arr = [];
        // for (let i = 0; i < Math.floor((parseInt(WaterTemp) * 0.1) + 1); i++) {
        for (let i = 0; i < steamCount; i++) {
          arr.push(
            <div className="steamDot" src={steamImg}
              style={{
                animationDelay: `${Math.random() * 3}s`,
                left: `${110 - parseInt(Math.random() * 40)}px`
              }}
            ></div>
          );
        }
        return arr;
      })()} */}


      <div className="bowl mx-auto" style={{ marginTop: isPortrait ? '0' : '-20px', background: bgColor, transform: isMobile ? isPortrait ? 'scale(0.8)' : 'scale(0.7)' : 'scale(1)' }}>
        <div className="inner">
          <div className="fill">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="300px" height="300px" viewBox="0 0 300 300" enableBackground="new 0 0 300 300" xmlSpace="preserve">
              <path className="waveShape" d="M300,300V2.5c0,0-0.6-0.1-1.1-0.1c0,0-25.5-2.3-40.5-2.4c-15,0-40.6,2.4-40.6,2.4
	c-12.3,1.1-30.3,1.8-31.9,1.9c-2-0.1-19.7-0.8-32-1.9c0,0-25.8-2.3-40.8-2.4c-15,0-40.8,2.4-40.8,2.4c-12.3,1.1-30.4,1.8-32,1.9
	c-2-0.1-20-0.8-32.2-1.9c0,0-3.1-0.3-8.1-0.7V300H300z" />
            </svg>
          </div>
          <h1 className='inner-text' >{WaterTemp} ºC</h1>

        </div>
      </div>
    </Box>
  )
}
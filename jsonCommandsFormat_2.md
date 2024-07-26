
-------Main Control MQTT topic---------------
Topic: axinar/solbox/MACADD/mainControlJson";

{"pauseCharging":1} --> Pause/ Start power operation 0-pause 1-start
{"pwmEnable":1} --> Enable manual PWM 1-Enabled 0-Dissabled(runs MPPT)
{"PWMset":512} --> Set manual PWM value to 512 (any value between 0 and 1023)
{"enableWeekly":1} --> Enable weekly relay schedule 
{"enableTelemetry":1} --> 1-Device sends data 0-Device doesn't send data
{"resetSystem":1} --> 1-Device resets after 5 seconds
{"forceUpdateCheckFlag":1} --> Force device to check for firmware update (not recomended)
{"delayWifiFlag":1} --> 1-Wifi begins after device reaches 38 PWMduty 0-Wifi begins straight away
{"manualRelayEnable":1} --> 0-Turns relay off 1-Turns relay ON 
{"setNickname":"SomeName"} --> Sets the device's nickname
{"fanControl":1} --> 1-Turns fan on. 0-Turns fan off. If protection temp is reached and fan is on, 0(off) command is disabled
{"CheckLoad":1} --> 1-Clears the last meassured resistor value
{"telemetryMode":1} --> 0-User's telemetry 1-Debugging telemetry 2-Technician's telemetry
{"sendPowerData":1} --> Sends 30 day history of power production per day in axinar/solbox/MACADD/jsonDataSent
{"sendWeekSchedule":1} --> Sends weekly Schedule saved on the device in axinar/solbox/MACADD/jsonDataSent
{"checkBacteriaEnable":1} --> Enables function that checks if the water reached the correct temperature for the right amount of time
{"setMaxWaterTemp":90} --> Sets the max temperature the water is allowed reach (default value is 80)
{"clearProduction":1} --> Clears today's log of watt-hours.
{"devicePaired":1} --> Sets the device pairing flag. 1--True 0--False
{"betaTesting":1} --> 1-The device gets beta versions 0-The device only gets stable versions
{"clearProductionHistory":1} --> Clears the thrirty day log
{"setOwnersMail":"something@aximail.com"} --> Sets the ownersMail value as "something@aximail.com"
{"setVacationPeriod":1,"startDate":[1032024,24062024,99999999],"endDate":[4032024,12072024,99999999]} -->
--> Sets 3 vacation periods. 99999999 is the value set when the period is not used.
--> "setVacationPeriod" can be 0 or 1 and it works as a switch to control whether to check for periods or not
--> First period starts the 1st of March (3rd month) in 2024 and ends on the 4th of March in 2024
--> Second period starts the 24th of June 2024 and ends the 12th of July ib 2024
--> Third period is not used 
Commands can be either sent separately or combined e.g

{"PWMset":825,"pwmEnable":1,"enableTelemetry":1} --> Set the manual PWM value to 825, enable manual PWM, and
						     also enable telemetry. 
{"pwmEnable":0,"enableTelemetry":0} --> Dissable manual PWM and dissable telemetry.

--------------------------------------------------------------------------------------


****** For serial commands ***********
{"credentials":["Axinar_Guest","Axinar2017"]} --- Example
{ 'command' : [ 'ssid' , 'password' ]}

---------------------------------------------------------------------------------------


---------Separate MQTT topic----------
****** Sending Weekly schedule *******
axinar/solbox/MACADD/jsonWeeklyCon
{"weekday":"Monday","timeStart":[090000,103200,999999],"timeEnd":[103000,125700,999999],"targetTemp":65}
Every Monday between 9:00:00AM and 10:30:00AM and 10:32:00AM and 12:57:00PM the system will try to keep the water temperature at 65 degrees C
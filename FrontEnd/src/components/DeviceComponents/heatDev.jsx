import React from "react";
import Card from '@mui/material/Card';
import './dev.css'

export const HeatDev = ({ isMobile, isPortrait, isOn }) => {
  return (
	  <Card sx={{ height: 'fit-content', width: 'fit-content', paddingY: isMobile ? 2 : 5, paddingX: isMobile ? 2 : 4, backgroundColor: 'transparent' }}>
		  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
			  viewBox="0 0 512.001 512.001" width={isMobile ? isPortrait ? 50 : 80 : 150} height={isMobile ? isPortrait ? 50 : 80 : 150} xmlSpace="preserve">
			  <path style={{ fill: '#E6E6E6' }} d="M387.19,447.522H124.81c-17.367,0-31.445-14.078-31.445-31.446V40.401
	c0-17.367,14.078-31.445,31.445-31.445h262.379c17.367,0,31.446,14.078,31.446,31.445v375.675
	C418.636,433.444,404.557,447.522,387.19,447.522z"/>
			  <path style={{ fill: '#F2F2F2' }} d="M124.81,422.446c-3.512,0-6.368-2.857-6.368-6.369V40.401c0-3.512,2.857-6.369,6.368-6.369h262.379
	c3.512,0,6.369,2.857,6.369,6.369v375.675c0,3.512-2.857,6.369-6.369,6.369H124.81z"/>
			  <circle style={{ fill: '#F4550F' }} cx="256.004" cy="358.458" r="50.15" />
			  <path style={{ fill: '#F77346' }} d="M220.539,393.918c19.584,19.584,51.338,19.584,70.923,0c19.584-19.584,19.584-51.338,0-70.923" />
			  <path style={{ fill: '#4D4D4D' }} d="M256,367.412c-4.946,0-8.956-4.01-8.956-8.956v-16.608c0-4.946,4.01-8.956,8.956-8.956
	c4.946,0,8.956,4.01,8.956,8.956v16.608C264.956,363.402,260.946,367.412,256,367.412z"/>
			  <rect x="158.684" y="75.396" style={{ fill: '#35D8B9' }} width="194.639" height="194.639" />
			  <polygon style={{ fill: '#B9FCEF' }} points="353.319,75.398 158.681,270.037 353.319,270.037 " />
			  <path className={isOn ? "heat-dev fireAnim" : "heat-dev"} d="M295.379,236.01c-1.408,0-2.836-0.333-4.167-1.035c-4.376-2.306-6.053-7.722-3.747-12.097
	c14.42-27.362,9.615-47.541,2.412-60.13c-3.801,13.229-11.682,22.329-12.193,22.908c-2.447,2.777-6.351,3.761-9.822,2.479
	c-3.472-1.282-5.797-4.569-5.851-8.269c-0.318-21.607-7.278-37.305-14.653-47.928c-0.677,14.842-7.501,28.898-19.319,38.747
	c-11.779,9.816-16.019,26.035-10.549,40.359l4.601,12.051c1.765,4.621-0.55,9.796-5.172,11.561
	c-4.619,1.766-9.798-0.55-11.561-5.172l-4.602-12.051c-8.2-21.476-1.844-45.793,15.816-60.509
	c10.456-8.713,15.05-22.367,11.99-35.63l-2.958-12.817c-0.806-3.496,0.55-7.136,3.45-9.25c2.899-2.114,6.779-2.294,9.861-0.459
	c1.232,0.734,23.297,14.238,34.543,44.775c-0.086-0.43-0.184-0.861-0.294-1.293c-0.923-3.634,0.515-7.457,3.603-9.583
	c3.088-2.124,7.173-2.103,10.237,0.057c0.519,0.367,12.814,9.158,20.837,25.745c7.383,15.263,12.591,40.276-4.529,72.758
	C301.704,234.271,298.595,236.01,295.379,236.01z"/>
			  <g>
				  <path style={{ fill: '#0f90d6' }} d="M387.19,0H124.81c-22.277,0-40.4,18.124-40.4,40.401v375.675c0,22.277,18.124,40.401,40.4,40.401
		h96.264v46.568c0,4.946,4.01,8.956,8.956,8.956s8.956-4.01,8.956-8.956v-46.568h34.03v46.568c0,4.946,4.01,8.956,8.956,8.956
		c4.946,0,8.956-4.01,8.956-8.956v-46.568h96.264c22.277,0,40.401-18.124,40.401-40.401V40.401C427.591,18.124,409.467,0,387.19,0z
		 M409.68,416.077c0,12.401-10.089,22.49-22.49,22.49H124.81c-12.401,0-22.489-10.089-22.489-22.49V40.401
		c0-12.401,10.088-22.49,22.489-22.49h262.379c12.401,0,22.49,10.089,22.49,22.49v375.675H409.68z"/>
				  <path style={{ fill: '#0f90d6' }} d="M256,299.351c-32.591,0-59.106,26.515-59.106,59.106s26.515,59.106,59.106,59.106
		s59.106-26.515,59.106-59.106S288.591,299.351,256,299.351z M256,399.651c-22.714,0-41.194-18.48-41.194-41.194
		c0-22.714,18.48-41.194,41.194-41.194s41.194,18.48,41.194,41.194C297.194,381.171,278.714,399.651,256,399.651z"/>
				  <path style={{ fill: '#0f90d6' }} d="M353.319,66.442H158.681c-4.946,0-8.956,4.01-8.956,8.956v194.639c0,4.946,4.01,8.956,8.956,8.956
		h194.639c4.946,0,8.956-4.01,8.956-8.956V75.398C362.275,70.452,358.265,66.442,353.319,66.442z M344.364,261.081H167.636V84.354
		h176.727V261.081z"/>
			  </g>
		  </svg>
    </Card>
  )
}
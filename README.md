# BritePrice

BritePrice is a Google Chrome Extension that guides Eventbrite event organizers in pricing the tickets for their events.

A short slide show about the project can be found here: [BritePrice](https://docs.google.com/presentation/d/e/2PACX-1vTvGIe91WIIA4MvmI4n5xozLVZqxJ57QSTpde6_zIueW88ejLvdv4XZVOtU8Kx64Er1vgVkgOZpsaTx/pub?start=false&loop=false&delayms=3000, "BritePrice Demo")

I am currently working to get the app on the Chrome store, but to try the extension for yourself in the meantime:

1. Download this repository locally.
2. Open a Google Chrome browser and navigate to chrome://extensions. Turn on developer mode.
3. Select "Load unpacked" and select the folder "ChromeExtensionRP" to load.
4. Navigate to www.eventbrite.com to create an event.
5. Once you have filled in the relevant event information, click the BritePrice icon next to the address bar in the browser. Select additional features and submit to obtain a suggested ticket price for your event.

The model is hosted on an AWS EC2 instance and is accessed through a proxy.
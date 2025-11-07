import { Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const ResponsiveDimensions = {
    screenWidth,
    screenHeight,


wp: (percentage) => (screenWidth * percentage) / 100,
hp: (percentage) => (screenHeight * percentage) / 100,

containerPadding: screenWidth * 0.05,
cardMargin: screenWidth * 0.04,
buttonHeight: screenHeight * 0.06,

isSmallScreen: screenWidth < 350,
isMediumScreen: screenWidth >= 350 && screenWidth < 400,
isLargeScreen: screenWidth >= 400,
}
export const REGISTER_LAYOUT = {
  box: { left: 4.125, top: 9.81, width: 58.63, height: 52.75 },
  lungs: { left: '18%', top: '23.5%', width: '64%' },
  icons: [
    { left: '40.6%', top: '5.4%', width: '18.45%' },
    { left: '14.29%', top: '24.29%', width: '14.4%' },
    { left: '71.32%', top: '24.29%', width: '14.4%' },
    { left: '73.77%', top: '67.42%', width: '14.4%' },
    { left: '11.83%', top: '67.42%', width: '14.4%' },
  ],
}

export const INTRO_LAYOUT = {
  box: { left: 7.525, top: 40.81, width: 51.86, height: 46.63 },
  lungs: { left: '23.3%', top: '19.3%', width: '53.2%' },
  icons: [
    { left: '45.7%', top: '8.45%', width: '9.7%' },
    { left: '14.8%', top: '27.4%', width: '12.8%' },
    { left: '70%', top: '21.9%', width: '12.8%' },
    { left: '73.7%', top: '64.9%', width: '12.8%' },
    { left: '15.6%', top: '71.5%', width: '12.8%' },
  ],
}

export const heroStyle = ({ box }) => ({
  left: `${box.left}rem`,
  top: `${box.top}rem`,
  width: `${box.width}rem`,
  height: `${box.height}rem`,
})

export const StartTimeOptions = [];
for (let i = 6; i < 22; i++) {
  StartTimeOptions.push(`${`0${i}`.slice(-2)}:00`, `${`0${i}`.slice(-2)}:30`);
}

export const EndTimeOptions = ['06:30'];
for (let i = 7; i < 22; i++) {
  EndTimeOptions.push(`${`0${i}`.slice(-2)}:00`, `${`0${i}`.slice(-2)}:30`);
}
EndTimeOptions.push('22:00');

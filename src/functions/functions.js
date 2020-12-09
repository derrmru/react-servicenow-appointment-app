export default {
    calculateAvailableTimes: (availableTimes, startTime, endTime) => {
        //console.log(availableTimes, startTime, endTime)
        
        //create start end pairs
        let startEnds = [[]];
        availableTimes && availableTimes.sort().map(x => {
            let first = parseInt(x[0].split(':')[0]);
            let second = (parseInt(x[0].split(':')[1]) / 60);
            return startEnds.push(
                    [
                        first + second, 
                        first + second + (parseInt(x[1]) / 60)
                    ]
                )
        })

        //increment through clinic removing available times
        let endNumber = parseInt(endTime.split(':')[0])
        let startNumber = parseInt(startTime.split(':')[0])

        //determine available start times
        startEnds.reverse()
        console.log(startEnds)
        let availableStartTimes = [];
        let startEndPosition = 0;
        let i = endNumber;
        while (i >= startNumber + 0.5) {
            i = i - 0.5
            if (i >= startEnds[startEndPosition][1]) {
                availableStartTimes.push(i)
            } else if (i < startEnds[startEndPosition][1] && i >= startEnds[startEndPosition][0]) {
                i = startEnds[startEndPosition][0] - 0.5
                startEndPosition += 1;
            }
        }
        //console.log(availableStartTimes)
        return availableStartTimes
    }
}
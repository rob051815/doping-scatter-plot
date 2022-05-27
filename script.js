url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

let values = [];

let xScale;
let yScale;

const width = 800;
const height = 600;
const padding = 60;

const svg = d3.select('#canvas');
const tooltip = d3.select('#tooltip');

const drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

const generateScales = () => {  
    xScale = d3.scaleLinear()
                .domain([
                    d3.min(values, (value) => {
                        return value['Year'];
                }) - 1,
                    d3.max(values, (value) => {
                        return value['Year'];
                    }) + 1])
                .range([padding, width - padding])

    yScale = d3.scaleTime()
                .domain([
                    d3.min(values, (value) => {
                        return new Date(value['Seconds'] * 1000);
                }),
                    d3.max(values, (value) => {
                        return new Date(value['Seconds'] * 1000);
                    })])
                .range([padding, height - padding])
}

const generateAxes = () => {
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d')); //formats the tick labels 
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%M:%S'));
    
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
}
const drawPoint = () => {
    svg.selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', 5)
        .attr('data-xvalue', (value) => {
            return value['Year']
        })
        .attr('data-yvalue', (value) => {
            //converts seconds field to miliseconds and pass to date constructor
            return new Date(value['Seconds'] * 1000)
        })
        .attr('cx', value => {
            return xScale(value['Year'])
        })
        .attr('cy', value => {
            return yScale(new Date(value['Seconds'] * 1000))
        })
        .attr('fill', value => {
            return value['Doping'] ? 'var(--plot-red)' : 'var(--plot-green)'
        })
        .on('mouseover', (event, value) => {
            tooltip.transition()
                    .style('visibility', 'visible')
                    .attr('data-year', value['Year'])
            
            let allegation = value['Doping'] ? value['Doping'] : 'No doping allegations';
            tooltip.text(value['Year'] + ' - ' + value['Name'] + ' - ' + value['Nationality'] + ' - '+ allegation);
        })
        .on('mouseout', () => {
            tooltip.transition()
                    .style('visibility', 'hidden')
        })

}

d3.json(url)
    .then((data) => {
        values = data;
        console.log(values);
        drawCanvas();
        generateScales();
        generateAxes();
        drawPoint();
    })
    .catch((err) => {
        console.log(err)
    })



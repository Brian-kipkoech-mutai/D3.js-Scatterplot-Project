import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';

const Scatterplot = () => {
  const [message, setMessage] = useState(null);
  const [dataset, setData] = useState(null);
  
  const svgRef = useRef();
  const h=500
  const w=800
  const padding=60
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setMessage('fetching data...please wait');
        const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json');

        if (!response.ok) {
          throw new Error('network response not okay');
        }

        const json = await response.json();
        setMessage('Fetched data successfully');
        setData( json);
      } 
      catch (error) {
        console.error('error fetching data', error);
        setMessage('Error fetching data');
      }
    };

    fetchData();
  }, []);
 
 useEffect(()=>{

   if(dataset){
     console.log(svgRef.current);
    
    const xScaleData = d3
     .scaleTime()
     .domain([
       d3.min(dataset, (d) => new Date(d['Year']-1, 0)  ),
       d3.max(dataset, (d) => new Date(d['Year']+1, 0)  ) 
     ])
     .range([padding, w - padding]);
    
 const yscale = d3
  .scaleTime()
  .domain([
    d3.min(dataset, (d) => new Date(d['Seconds'] * 1000)),
    d3.max(dataset, (d) => new Date(d['Seconds'] * 1000))
  ])
  .range([padding, h - padding]);
     

    
const svg=d3.select(svgRef.current)
.attr('viewBox', `0 0 ${w} ${h}`);

svg.selectAll('circle')
.data(dataset)
.enter()
.append('circle')
.attr('data-xvalue', d => new Date(d['Year'], 0, 1, 0, 0, d['Seconds'], 0))
.attr('data-yvalue', d=> new Date(d['Year'], 0, 1, 0, 0, d['Seconds'], 0))
.attr('cy',d=>yscale( new Date(d['Seconds'] * 1000)))
.attr('cx', d => xScaleData(new Date(d['Year'], 0)))
.attr('r',5)
.attr('fill',d=>d['Doping'].length<1?'green':'red')
.attr('class','dot')
.on('mouseover',(event ,d)=>{
   const  name =d['Name']
   const nationality=d['Nationality']
   const year= d['Year']
   const time=d['Time']
   const doping=d['Doping']
 d3.select('#tooltip')
    .attr('data-year',  new Date(d['Year'], 0, 1, 0, 0, d['Seconds'], 0))
    .style('opacity',1)
    .html(`${name} : ${nationality}<br/> Year : ${year} ,  Time : ${time} <br/>${doping}`)
    .style('left',`${event.pageX+20}px`)
    .style('top',`${event.pageY-30}px`)

})
.on('mouseleave',()=>{
  d3.select('#tooltip')
    .style('opacity',0)
})

const xAxis=d3.axisBottom(xScaleData)
              
  svg.append('g')
   .attr('id','x-axis')
  .attr('transform',`translate(0,${h-padding})`)
  .call(xAxis)

  const yAxis = d3.axisLeft(yscale).tickFormat(d3.timeFormat('%M:%S'));
  svg.append('g')
  .attr('id', 'y-axis')
  .attr('transform', `translate(${padding},0)`)
  .call(yAxis);



       
   svg.append('text')
   .attr('transform', 'rotate(-90)')
   .attr('x', (-h / 2))
   .attr('y', padding/3)
   .attr('text-anchor', 'middle')
   .style('font-size', '20px')
   .text('Time (Minutes)');

   svg.append('text')
   .attr('x',w/2)
   .attr('y',h-(padding/3))
   .attr('text-anchor','middle')
   .attr('fonts-size','20px')
   .text('Years')

   svg.append('text')
   .attr('x',w-2*padding)
   .attr('y', h/2)
   .attr('text-anchor','end')
   .attr('dominant-baseline','middle')
   .style('font-size','10px')
   .text('Riders with doping allegations')

   svg.append('text')
   .attr('x',w-2*padding)
   .attr('y', 20+h/2)
   .attr('id','legend')
   .attr('text-anchor','end')
   .attr('dominant-baseline','middle')
   .style('font-size','10px')
   .text('No doping allegations')

   svg.append('circle')
   .attr('cx',w-(2*padding)+10)
   .attr('cy', h/2)
   .attr('r',5)
   .attr('fill','red')

   svg.append('circle')
   .attr('cx',w-(2*padding)+10)
   .attr('cy',20+ h/2)
   .attr('r',5)
   .attr('fill','green')
 
 
    

    console.log(dataset);






   }
 }
 ,[dataset])
  return (
     <div className="ui">
      <div className="viewBox">
        <div  id="title">
          <div className="mainTitle"> Doping in Professional Bicycle Racing</div>
          <div className="subtitle">35 Fastest times up Alpe d'Huez</div>
        </div>
       {dataset?<svg ref={svgRef}></svg>:message}
      <div id="tooltip">

      </div>
  
    </div>
     </div>
  );
};

export default Scatterplot;

// tslint:disable
import * as React from 'react';

export interface LoadingComponentProps {
}

export interface LoadingComponentState {
}

export default class LoadingComponent extends React.Component<LoadingComponentProps, LoadingComponentState> {
  constructor(props: LoadingComponentProps) {
    super(props);

    // this.state = {

    // };
  }

  // tslint:disable-next-line:member-ordering
  rectStyle = {
      fill: 'rgba(50, 50, 255, 1)', 
      stroke: 'rgb(255,255,255)',
      strokeWidth:  1, 
    };

    rectNodes: Array<SVGElement|null> = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];

    componentDidMount() {
        console.log('animation mounted');
        // tslint:disable-next-line:no-unused-expression
        if (!document) {
            return;
        }
        const esse = document.getElementById('anim_svg');
        if (!esse) {
            return;
        }

       
        
    }

    componentWillUnmount() {
        console.log('anim will unmount');
    }

  public render() {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 200,
          left: 200,
          zIndex: 4,
        }}
      >
        <svg id="anim_svg" width="180" height="50">
        <g ref={ref => this.rectNodes[0] = ref}> <rect x="0" y="0" width="10" height="50" style={this.rectStyle} /></g>
        <g ref={ref => this.rectNodes[1] = ref}> <rect x="15" y="0" width="10" height="50" style={this.rectStyle} /></g>
        <g ref={ref => this.rectNodes[2] = ref}> <rect x="30" y="0" width="10" height="50" style={this.rectStyle} /></g>
        <g ref={ref => this.rectNodes[3] = ref}> <rect x="45" y="0" width="10" height="50" style={this.rectStyle} /></g>
        <g ref={ref => this.rectNodes[4] = ref}> <rect x="60" y="0" width="10" height="50" style={this.rectStyle} /></g>
        <g ref={ref => this.rectNodes[5] = ref}> <rect x="75" y="0" width="10" height="50" style={this.rectStyle} /></g>
        <g ref={ref => this.rectNodes[6] = ref}> <rect x="90" y="0" width="10" height="50" style={this.rectStyle} /></g>
        <g ref={ref => this.rectNodes[7] = ref}> <rect x="105" y="0" width="10" height="50" style={this.rectStyle} /></g>
        <g ref={ref => this.rectNodes[8] = ref}> <rect x="120" y="0" width="10" height="50" style={this.rectStyle} /></g>
        <g ref={ref => this.rectNodes[9] = ref}> <rect x="135" y="0" width="10" height="50" style={this.rectStyle} /></g>
        <g ref={ref => this.rectNodes[10] = ref}> <rect x="150" y="0" width="10" height="50" style={this.rectStyle} /></g>
        <g ref={ref => this.rectNodes[11] = ref}> <rect x="165" y="0" width="10" height="50" style={this.rectStyle} />        </g>
        </svg>
        <br/>
        <span>C A R R E G A N D O...</span>
      </div>
    );
  }
}

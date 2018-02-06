import React, { Component } from 'react';
import { number, string, arrayOf, object, bool } from 'prop-types';
import { Stage, Layer } from 'react-konva';
import { Easings } from 'konva';

import Dial from './Dial';
import ProgressBar from './ProgressBar';
import Timer from './Timer';
import { formatTime, formatTimePercent } from '../../utils/time';
import { createGradientSteps } from '../../utils/gradient';

import './index.scss';

export default class Clockface extends Component {
  static propTypes = {
    width: number,
    height: number,
    play: bool,
    workTime: number,
    restTime: number,
    currentTime: number,
    dial: arrayOf(object),
    mode: string,
    workCount: number,
    fill: number
  }

  componentWillMount() {
    this.updateGradient();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mode !== this.props.mode) {
      this.updateGradient(nextProps);
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.play !== this.props.play) {
      return;
    }

    // dial ref
    const animateDial = this.refs.dial.children[0].children;
    const { dial, fill } = nextProps;
    
    animateDial.forEach((division, index) =>
      division.to({
        fill: this.gradientSteps[fill],
        opacity: dial[index].opacity,
        x: dial[index].x,
        y: dial[index].y - 50,
        rotation: dial[index].rotation,
        duration: 0.33,
        easing: Easings.EaseInOut
      })
    );
  }

  componentWillUnmount() {
    delete this.gradientSteps;
  }

  updateGradient(props = this.props) {
    const {
      currentTime,
      mode
    } = props;
    const reverse = mode === 'rest';
    
    this.gradientSteps = createGradientSteps('#ff6347', '#2ecc71', currentTime, reverse);
  }

  render() {
    const {
      width,
      height,
      workTime,
      restTime,
      currentTime,
      dial,
      mode,
      workCount,
      fill
    } = this.props;

    const fullTime = (mode === 'rest' && workCount % 4)
      ? restTime
      : (mode === 'rest' && workCount % 4 === 0)
        ? restTime * 3
        : workTime;

    const time = formatTime(currentTime);
    const timePercent = formatTimePercent(fullTime, currentTime);

    const currentColor = this.gradientSteps[fill];

    return (
      <Stage width={width} height={height} className='clockface'>
        <Layer ref={'dial'}>
          <Dial
            dial={dial}
            currentColor={currentColor}
          />
          <Timer
            time={time}
            currentColor={currentColor}
            x={width / 2}
            y={height / 2}
          />
          <ProgressBar
            timePercent={timePercent}
            currentColor={currentColor}
            x={width / 4}
            y={height / 2 + 200}
          />
        </Layer>
      </Stage>
    );
  }
}
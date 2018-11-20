import React, { Component } from 'react';
import { Transition, animated } from 'react-spring';

let loopingIndex = (index, limit) => {
  if (index > limit) return (index % limit - 1);
  if (index < 0) return limit + ((index + 1) % (limit + 1));
  return index
}

class CarouselState extends React.Component {
  state = {
    currentIndex: this.props.currentIndex || 0,
    moved: null,
  }

  forward = () => {
    const { items } = this.props;
    const { currentIndex } = this.state;
    const newIndex = loopingIndex(currentIndex + 1, items.length - 1)
    this.setState({ moved: 'forward' }, () => {
      this.setState({ currentIndex: newIndex })
    });
  }

  back = () => {
    const { items } = this.props;
    const { currentIndex } = this.state;
    const newIndex = loopingIndex(currentIndex - 1, items.length - 1)
    this.setState({ moved: 'backward' }, () => {
      this.setState({ currentIndex: newIndex })
    })
  }

  render() {
    const { items, children } = this.props;
    const { currentIndex, moved } = this.state;
    const previousIndex = loopingIndex(currentIndex - 1, items.length - 1);
    const nextIndex = loopingIndex(currentIndex + 1, items.length - 1);

    return (
      children({
        previousItem: items[previousIndex],
        currentItem: items[currentIndex],
        nextItem: items[nextIndex],
        forward: this.forward,
        back: this.back,
        moved
      })
    )
  }
}

const config = {
  from: { value: -100 },
  enter: { value: 0 },
  leave: { value: 100 }
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <CarouselState items={[1, 2, 3, 4, 5]}>
          {({ previousItem, moved, currentItem, nextItem, forward, back }) => {
            return (
              <div>
                <button onClick={back}>Back</button>
                <Transition
                  items={[currentItem]}
                  {...config}>
                  {item => ({ value }) => {
                    const adjustedValue = moved === 'forward'
                      ? value
                      : moved === 'backward'
                        ? -value
                        : 0
                    return (
                      <animated.div key={item} style={{ transform: `translateX(${adjustedValue}%)` }}>
                        {item}
                      </animated.div>
                    )
                  }}
                </Transition>
                <button onClick={forward}>Forward</button>
              </div>
            )
          }}
        </CarouselState>
      </div>
    )
  }
}

export default App;

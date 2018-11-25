import React, { Component } from 'react';
import styled from 'styled-components';
import { Spring } from 'react-spring';
import {
  MdChevronRight as ChevronRight,
  MdChevronLeft as ChevronLeft
} from 'react-icons/md';

class CarouselState extends React.Component {
  state = {
    previousIndex: this.props.currentIndex || 0,
    currentIndex: this.props.currentIndex || 0,
    moved: null,
    transitioning: false,
    width: 0
  }

  getCarouselContainer = (node) => {
    this.carouselContainer = node;
  }

  updateWidth = () => {
    const width = this.carouselContainer.getBoundingClientRect().width;
    this.setState({ width })
  }

  componentDidMount() {
    this.updateWidth();
    window.addEventListener('resize', this.updateWidth)
  }

  forward = () => {
    const { currentIndex, transitioning } = this.state;
    if (transitioning) return;

    this.setState({
      previousIndex: currentIndex,
      currentIndex: currentIndex + 1,
      transitioning: true
    })
  }

  goToIndex = (newCurrentIndex) => {
    const { currentIndex, transitioning } = this.state;
    if (transitioning) return;

    this.setState({
      previousIndex: currentIndex,
      currentIndex: newCurrentIndex,
      transitioning: true
    });
  }

  back = () => {
    const { currentIndex, transitioning } = this.state;
    if (transitioning) return;

    this.setState({
      previousIndex: currentIndex,
      currentIndex: currentIndex - 1,
      transitioning: true
    })
  }

  cleanup = () => {
    const { items } = this.props;
    const { currentIndex } = this.state;

    let updates = {};

    // Infinite loop backwards
    if (currentIndex <= -1) {
      const lastIndex = items.length - 1
      updates = { previousIndex: lastIndex, currentIndex: lastIndex };
    }

    // Infinite loop forward
    if (currentIndex >= items.length) {
      updates = { previousIndex: 0, currentIndex: 0 };
    }

    this.setState({ ...updates, transitioning: false })
  }

  render() {
    const { items, children } = this.props;
    const { currentIndex, previousIndex, width } = this.state;
    const firstItem = items[0]
    const lastItem = items[items.length - 1]

    return (
      <Spring
        immediate={previousIndex === currentIndex}
        from={{ transform: `translateX(${(previousIndex + 1) * -width}px)` }}
        to={{ transform: `translateX(${(currentIndex + 1) * -width}px)` }}
        onRest={this.cleanup}>
          {(trackProps) => (
            children({
              currentIndex,
              carouselViewItems: [lastItem, ...items, firstItem],
              forward: () => this.goToIndex(currentIndex + 1),
              back: () => this.goToIndex(currentIndex - 1),
              goToIndex: this.goToIndex,
              trackProps,
              getCarouselContainer: this.getCarouselContainer,
              items
            })
          )}
      </Spring>
    )
  }
}

const CarouselBody = styled.div`
  width: 100%;
  overflow-x: hidden;
  position: relative;
`;

const CarouselItem = styled.div`
  width: 100%;
  display: inline-block;
`;

const Track = styled.div`
  white-space: nowrap;
`

const DotButtonList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
`;

const DotButton = styled.div`
  cursor: pointer;
  background-color: grey;
  height: 20px;
  width: 20px;
  border-radius: 10px;
  margin-right: 20px;
`;

const DirectionalButtons = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    height: 30px;
    width: 30px;
    color: grey;
    cursor: pointer;
    font-size: 20px;
  }
`

const Carousel = (props) => {
  const { children } = props;
  return (
    <CarouselState items={children}>
      {({
        carouselViewItems,
        forward,
        back,
        goToIndex,
        trackProps,
        getCarouselContainer,
        items
      }) => {
        return (
          <div>
            <CarouselBody ref={getCarouselContainer}>
              <Track style={trackProps}>
                {carouselViewItems.map((item, index) => (
                  <CarouselItem key={index}>
                    {item}
                  </CarouselItem>
                ))}
              </Track>
              <DirectionalButtons>
                <ChevronLeft onClick={back} />
                <ChevronRight onClick={forward} />
              </DirectionalButtons>
              <DotButtonList>
                {items.map((item, index) => (
                  <DotButton key={index} onClick={() => goToIndex(index)} />
                ))}
              </DotButtonList>
            </CarouselBody>
          </div>
        )
      }}
    </CarouselState>
  )
}

const BigItem = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.color};
  color: white;
`

class App extends Component {
  render() {
    return (
      <div className="App">
        <Carousel>
          <BigItem color="blue">1</BigItem>
          <BigItem color="green">2</BigItem>
          <BigItem color="yellow">3</BigItem>
          <BigItem color="orange">4</BigItem>
          <BigItem color="red">5</BigItem>
        </Carousel>
      </div>
    )
  }
}

export default App;

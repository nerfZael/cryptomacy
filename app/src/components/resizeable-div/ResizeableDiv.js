import React, { Component, createRef } from 'react';

export class ResizeableDiv extends Component {
  constructor(props) {
    super(props);

    const { aspectRatio, className, style, children } = props;

    this.state = {
      position: {
        x: 0,
        y: 0
      },
      width: 0
    };

    this.aspectRatio = aspectRatio ? aspectRatio : 1;
    this.className = className;
    this.children = children;
    this.style = style;
    this.ref = createRef();
  }

  componentDidMount() {
    this.setState({
      width: this.ref.current.offsetWidth
    });

    window.addEventListener('resize', () => {
      if (!this.ref.current) {
        return;
      }

      this.setState({
        width: this.ref.current.offsetWidth
      });
    });
  }

  render() {
    const style = {
      ...this.style,
      height: `${this.state.width  / this.aspectRatio}px`
    };

    return (
      <div ref={this.ref} style={style} className={this.className}>
        {this.props.children}
      </div>
    );
  }
}

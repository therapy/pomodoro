import { Component } from 'react';
import { oneOfType, string, func } from 'prop-types';

export default class Title extends Component {

  static propTypes = {
    title: oneOfType([string, func]).isRequired
  }

  updateTitle(title) {
    return document.title = (typeof title === 'function') ? title() : title;
  }

  render() {
    const { title } = this.props;
    this.updateTitle(title);

    return null;
  }
}
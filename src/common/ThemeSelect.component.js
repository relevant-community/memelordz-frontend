import React, { Component } from 'react';
import PropTypes from 'prop-types';

const themes = [
  { name: 'Yotsuba', className: '' },
  { name: 'Yotsuba B', className: 'yotsuba-b' },
  { name: 'Futaba', className: 'futaba' },
  { name: 'Burichan', className: 'burichan' },
  { name: 'Tomorrow', className: 'tomorrow' },
  { name: 'Photon', className: 'photon' },
];

const storageTag = 'memelordz.theme';

const themeName = localStorage.getItem(storageTag) || 'Yotusba';
themes.forEach(theme => {
  if (theme.name === themeName) document.body.classList.add(theme.className);
});

export default class ThemeSelect extends Component {
  state = {
    theme: localStorage.getItem(storageTag) || 'Yotusba'
  }

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const oldTheme = this.state.theme;
    const newTheme = e.target.value;
    themes.forEach(theme => {
      if (theme.name === newTheme && theme.className) document.body.classList.add(theme.className);
      if (theme.name === oldTheme && theme.className) document.body.classList.remove(theme.className);
    });
    localStorage.setItem(storageTag, newTheme);
    this.setState({ theme: newTheme });
  }

  render() {
    return (
      <div className='themeSelect'>
        {'Style: '}
        <select value={this.state.theme} onChange={this.handleChange}>
          {themes.map(theme => (
            <option key={theme.name} value={theme.name}>{theme.name}</option>
          ))}
        </select>
      </div>
    );
  }
}

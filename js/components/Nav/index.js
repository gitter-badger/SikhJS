import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { baanies, getSettings, setSettings } from '../../constants';
import { Throttle } from 'react-throttle';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Slider from 'material-ui/Slider';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';

export default withRouter(class Nav extends Component {
  constructor(p) {
    super(p);
    this.state = { showDrawer: false, };
  }
  componentDidMount() {
    this.updateFontSize(getSettings().fontSizeMultiplier);
  }
  render () {
    const { push } = this.props.router;
    const nBaanies = baanies.nitnem.map(({ title }) => (
      <MenuItem key={title} onTouchTap={e => { push(`/nitnem/${title}`); this.toggleDrawer(); }} primaryText={title} />)
    );
    return (
      <div>
        <AppBar
          style={{ top: 0, left: 0, position: 'fixed' }} title="SikhJS"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonTouchTap={e => this.toggleDrawer(e)}
        />
        <Drawer open={this.state.showDrawer} docked={false} width={250} onRequestChange={e => this.toggleDrawer()}>
          <MenuItem onTouchTap={e => { push(`/`); this.toggleDrawer()}} primaryText="Home" />
          <MenuItem onTouchTap={e => { push(`/hukamnama`); this.toggleDrawer(); }} primaryText="Hukamnama" />
          <MenuItem onTouchTap={e => { push(`/sggs`); this.toggleDrawer(); }} primaryText="Sri Guru Granth Sahib" />
          <MenuItem onTouchTap={e => { push(`/nitnem`); this.toggleDrawer(); }} primaryText="Nitnem" nestedItems={nBaanies} />
          <MenuItem onTouchTap={e => { push(`/shabads`); this.toggleDrawer(); }} primaryText="Search Shabads" /> 
          <Divider />
          <MenuItem onTouchTap={e => { push(`/calendar`); this.toggleDrawer(); }} primaryText="Calendar" />
          <MenuItem onTouchTap={e => { push(`/authors`); this.toggleDrawer(); }} primaryText="Authors" />
          <MenuItem onTouchTap={e => { push(`/raags`); this.toggleDrawer(); }} primaryText="Raags" />
          <MenuItem onTouchTap={e => { push(`/bookmarks`); this.toggleDrawer(); }} primaryText="Bookmarks" /> 
          <Divider />
          <MenuItem primaryText="Font Size" nestedItems={[
            <Throttle time="200" handler="onChange" key={1}>
              <Slider min={0.25} max={1.75} step={0.1} defaultValue={getSettings().fontSizeMultiplier}
                onChange={(e, v) => this.updateFontSize(v)} />
            </Throttle>
          ]} />
        <MenuItem primaryText="Night Mode" onTouchTap={e => this.toggleNightMode(e)} />
        <Divider />
        <a style={{ textDecoration: 'none' }} href="https://github.com/bogas04/SikhJS/issues/new" target="_blank">
          <MenuItem primaryText="Report Issue" />
        </a>
        <MenuItem onTouchTap={e => { push(`/about`); this.toggleDrawer(); }} primaryText="About" />
      </Drawer>
    </div>
    );
  }
  toggleDrawer(e) {
    this.setState({ showDrawer: !this.state.showDrawer });
    e && e.stopPropagation() && e.preventDefault();
  }
  toggleNightMode (e) {
    this.props.onNightModeToggle();
  }
  updateFontSize (v) {
    document.querySelector('#baaniWrapper').style.fontSize = `${20 * v}px`;
    let newSettings = getSettings();
    newSettings.fontSizeMultiplier = v;
    setSettings(newSettings);
  }
})

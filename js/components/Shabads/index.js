import React, { Component } from 'react';
import Progress from 'material-ui/CircularProgress';
import { Throttle } from 'react-throttle';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import { Card, CardHeader, CardText } from 'material-ui/Card';

import { withRouter } from 'react-router';
import Select from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Shabad from '../Shabad';
import { searchTypes, sourceTypes, API_URL } from '../../constants';

export const SearchCard = withRouter(props => {
  const { ID, Transliteration, WriterID, English, ShabadID, SourceID, Gurmukhi, PageNo, router: { push }} = props;

  const title = <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'flexStart', justifyContent: 'flex-start', flexDirection: 'column', flexWrap: 'wrap', }}>
      <span className="gurbani-text">{Gurmukhi}</span>
      <span style={{ textTransform: 'capitalize' }}>{Transliteration}</span>
    </div>
    <div>
      <FlatButton label="Open Shabad" onTouchTap={e => push(`/shabad/${ShabadID}`)} />
      <FlatButton label={`Open Ang ${PageNo}`} onTouchTap={e => push(`/SGGS/${PageNo}`)} disabled={SourceID !== 'G'} />
      <FlatButton label="Open Raag" onTouchTap={e => push(`/SGGS/${PageNo}`)} disabled />
    </div>
  </div>;
  return (
    <Card style={{ margin: 10 }} key={ID}>
      <CardHeader title={title} textStyle={{ display: 'block' }} showExpandableButton={true} actAsExpander={true} />
      <CardText expandable={true}><Shabad id={ShabadID} WriterID={WriterID} PageNo={PageNo} SourceID={SourceID} /></CardText>
    </Card>
  );
});

export default withRouter(class Shabads extends Component {
  constructor (props) {
    super (props);
    let q = (this.props.params && this.props.params.q) || '';
    this.state = { q, shabads: [], searchType: 0, baaniSrc: 1, loading: false };
  }
  componentDidMount() {
    if(this.state.q !== '') {
      this.queryAPI(this.state);
    }
  }
  search(q) {
    this.setState({ q });
    this.props.router.push(`shabads/${q}`)
    this.queryAPI({...this.state, q });
  }
  updateSearchType(searchType) {
    this.setState({ searchType });
    this.queryAPI({...this.state, searchType });
  }
  updateSource(baaniSrc) {
    this.setState({ baaniSrc });
    this.queryAPI({...this.state, baaniSrc });
  }

  queryAPI({ q, searchType, baaniSrc }) {
    this.setState({ loading: true });
    const mode = 1, maxRecords = 20;
    const url = `${API_URL}?&mode=${mode}&q=${q}&src=${baaniSrc}&type=${searchType}&recnum=${maxRecords}&writer=0&raag=0&format=json`;

    fetch(url).then(r => r.json())
      .then(({ shabads }) => this.setState({ shabads, loading: false }))
      .catch(err => console.error(err));
  }
  render () {
    const { shabads, searchType, baaniSrc, loading } = this.state;
    const styles = {
      select: { width: 300, textOverflow: 'ellipsis', overflow: 'hidden' },
      group: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' },
    };

    return (
      <div>
        <Toolbar className='toolbar'>
          <ToolbarGroup firstChild={true} style={styles.group}>
            <ToolbarTitle className='toolbar-title' text="Gurbani Searcher" />
            <Throttle time={500} handler="onChange">
              <TextField inputStyle={{ fontFamily: 'gurmukhi_heavy' }} id="q" onChange={(e, v) => this.search(v)}
                style={{ width: 300 }} floatingLabelText="Search" hintText="Search"/>
            </Throttle>
            <Select style={styles.select} floatingLabelText="Search Type" value={searchType}
              onChange={(e, v) => this.updateSearchType(v)} children={
                searchTypes.map((v, i) => <MenuItem value={i} primaryText={v} key={i} />)
              } />
            <Select style={styles.select} floatingLabelText="Source of Baani" value={baaniSrc}
              onChange={(e, v) => this.updateSource(v)} children={
                sourceTypes.map((v, i) => <MenuItem value={i} primaryText={v} key={i} />)
              } />
          </ToolbarGroup>
        </Toolbar>
        {
          loading
            ? <Progress size={100} thickness={5} />
            : (
              shabads.length === 0
              ? <h1 style={{ textAlign: 'center' }}> No Shabads Found </h1>
              : shabads.map(({ shabad }) => <SearchCard key={shabad.ID} {...shabad} />)
            )
        }
      </div>
    );
  }
});

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Table, Button } from 'semantic-ui-react';
import { submitResultOnServer } from '../actions/matchActions';
import LocalizedStrings from 'react-localization';

class NextGamesTableElement extends Component {
    constructor(props) {
        super(props);
        this.state = { team1: this.props.match.result.team1, team2: this.props.match.result.team2, resultModified: false };
    }

    parseDate = (datetime) => {
        const date = new Date(datetime);
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return [date.toLocaleDateString("de-DE",options), ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)];
    }

    handleChange = (e) => {
        let state = {...this.state};
        state[e.target.id] = e.target.value;
        state.resultModified = this.resultModified(state, this.props.match.result);
        this.setState(state);
    }

    handleSave = () => {
        let match = {
            team1: this.props.match.team1,
            team2: this.props.match.team2,
            team1Score: this.state.team1, 
            team2Score: this.state.team2
        };
        let state = {...this.state};
        if(state.team1 === '' && state.team2 === '') match.finished = false;
        else {
            match.finished = true;
            if(state.team1 === '') state.team1 = 0;
            if(state.team2 === '') state.team2 = 0;
        }
        state.resultModified = false;
        this.setState(state);
        this.props.submitResult(this.props.match.id, match);
    }

    resultModified = (result, state) => {
        return !(result.team1 === state.team1 && result.team2 === state.team2);
    }
  
    render() {
        const match = this.props.match;
        const [day, time] = this.parseDate(match.datetime);

        let strings = new LocalizedStrings({
            de: {
              save: "Speichern"
            }
        }); 

        const styles = {
            upperCase: { textTransform: 'uppercase' },
            displayBlock: { display: 'block' },
            separator: { fontSize: '2em', padding: '0 0.5em' },
            input: { width: '4em' }
        };

        return (
            <Table.Row>
                <Table.Cell width={3}><small style={styles.displayBlock}>{day}</small>{time}</Table.Cell>
                <Table.Cell width={1}>
                    <img src={'/flags.png'} 
                         className={'flag ' + (match.team1 ? match.team1.code : 'placeholder')} 
                         alt={match.team1 ? match.team1.code : 'placeholder'} />
                </Table.Cell>
                <Table.Cell width={2} style={styles.upperCase}>{match.team1 ? match.team1.name : '-'}</Table.Cell>
                <Table.Cell width={2} style={styles.upperCase}>
                    <Input id="team1" 
                        size="large" 
                        type="number" 
                        min="0" 
                        max="99" 
                        className="text-center"
                        value={this.state.team1}
                        onChange={this.handleChange}
                        style={styles.input} />
                </Table.Cell>
                <Table.Cell style={styles.separator}>-</Table.Cell>
                <Table.Cell width={2} style={styles.upperCase}>
                    <Input id="team2" 
                        size="large" 
                        type="number" 
                        min="0" 
                        max="99" 
                        className="text-center"
                        value={this.state.team2}
                        onChange={this.handleChange}
                        style={styles.input} />
                </Table.Cell>
                <Table.Cell width={2} style={styles.upperCase}>{match.team2 ? match.team2.name : '-'}</Table.Cell>
                <Table.Cell width={1}>
                    <img src={'/flags.png'} 
                         className={'flag ' + (match.team2 ? match.team2.code : 'placeholder')} 
                         alt={match.team2 ? match.team2.code : 'placeholder'} />
                </Table.Cell>
                <Table.Cell width={3}><Button color="green" disabled={!this.state.resultModified} onClick={this.handleSave} content={strings.save} /></Table.Cell>
            </Table.Row>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        submitResult: (id, result) => dispatch(submitResultOnServer(id, result))
    }
}

export default connect(null, mapDispatchToProps)(NextGamesTableElement);
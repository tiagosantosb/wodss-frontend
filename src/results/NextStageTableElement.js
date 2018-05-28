import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Dropdown } from 'semantic-ui-react';
import { submitResultOnServer } from '../actions/matchActions';
import LocalizedStrings from 'react-localization';

class NextStageTableElement extends Component {
    constructor(props) {
        super(props);
        this.state = { teamsModified: false };
        this.state.team1 = (this.props.match.team1) ? this.props.match.team1.code : '';
        this.state.team2 = (this.props.match.team2) ? this.props.match.team2.code : '';
    }

    parseDate = (datetime) => {
        const date = new Date(datetime);
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return [date.toLocaleDateString("de-DE",options), ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)];
    }

    getGroup = (group) => {
        return this.props.teams.filter(team => team.group === group).map(team => { return {text: team.name, value: team.code }; });
    }

    changeTeam1 = (e, { value }) => {
        let state = {...this.state};
        state.team1 = value;
        state.teamsModified = this.teamsModified(state, this.props.match);
        this.setState(state);
    }

    changeTeam2 = (e, { value }) => {
        let state = {...this.state};
        state.team2 = value;
        state.teamsModified = this.teamsModified(state, this.props.match);
        this.setState(state);
    }

    teamsModified = (state, props) => {
        return !(props.team1 && state.team1 === props.team1.code && props.team2 && state.team2 === props.team2.code);
    }

    getTeam = (code) => {
        return this.props.teams.find(team => team.code === code);
    }

    handleSave = () => {
        let match = this.props.match;
        match.team1 = this.getTeam(this.state.team1);
        match.team2 = this.getTeam(this.state.team2);
        this.setState({ teamsModified: false });
        this.props.submitResult(this.props.match.id, match);
    }
  
    render() {
        const match = this.props.match;
        const [day, time] = this.parseDate(match.datetime);

        let strings = new LocalizedStrings({
            de: {
              save: "Speichern",
              select : "Team auswählen"
            }
        }); 

        const styles = {
            upperCase: { textTransform: 'uppercase' },
            displayBlock: { display: 'block' },
            separator: { fontSize: '2em', padding: '0 0.5em' }
        };
                                            
        let team1Options = [];
        [...match.placeholder.group1].forEach(group => team1Options.push(...this.getGroup(group)));

        let team2Options = [];
        [...match.placeholder.group2].forEach(group => team2Options.push(...this.getGroup(group)));

        return (
            <Table.Row>
                <Table.Cell width={2}><small style={styles.displayBlock}>{day}</small>{time}</Table.Cell>
                <Table.Cell width={1}></Table.Cell>
                <Table.Cell width={4} style={styles.upperCase}>
                    <small style={styles.displayBlock}>{match.placeholder.team1}</small>
                    <Dropdown id="team1" placeholder={strings.select} fluid selection options={team1Options} onChange={this.changeTeam1} value={this.state.team1} />
                </Table.Cell>
                <Table.Cell width={1} style={styles.separator}>
                    <small style={styles.displayBlock}>&nbsp;</small>-</Table.Cell>
                <Table.Cell width={4} style={styles.upperCase}>
                    <small style={styles.displayBlock}>{match.placeholder.team2}</small>
                    <Dropdown id="team2" placeholder={strings.select} fluid selection options={team2Options} onChange={this.changeTeam2} value={this.state.team2} />
                </Table.Cell>
                <Table.Cell width={1}></Table.Cell>
                <Table.Cell width={3}><Button color="green" disabled={!this.state.teamsModified} onClick={this.handleSave} content={strings.save} /></Table.Cell>
            </Table.Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        teams: state.teams
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        submitResult: (id, result) => dispatch(submitResultOnServer(id, result))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NextStageTableElement);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Container, Table, Card } from 'semantic-ui-react';
import GameResultTableElement from './GameResultTableElement';
import NextStageTableElement from './NextStageTableElement';
import LocalizedStrings from 'react-localization';

class Results extends Component {
    getNextMatchesWithoutScore = () => {
        let index = this.props.matches.map(match => match.finished).indexOf(false);
        return this.props.matches.slice(index, index + 3);
    }

    getLastMatchesWithScore = () => {
        let index = this.props.matches.map(match => match.finished).indexOf(false);
        return this.props.matches.slice(Math.max(0, index - 3), Math.max(0, index));
    }

    getNextStageWithoutTeams = () => {
        let nextMatch = this.props.matches.find(match => match.team1 === null || match.team2 === null);
        return this.props.matches.filter(match => match.category === nextMatch.category);
    }

    sortByDatetime = (matches) => {
        return matches.sort((a, b) => { return a.datetime > b.datetime; });
    }

    preprocessMatch = (match) => {
        if(match.finished === false) match.result = { team1: '', team2: '' };
        return match;
    }

    parseDate = (datetime) => {
        const date = new Date(datetime);
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return [date.toLocaleDateString("de-DE",options), ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)];
    } 

    render() {
        let strings = new LocalizedStrings({
            de: {
                title: "Ergebnisse erfassen",
                pastGames: "Die letzten Spiele",
                nextGames: "Die nächsten Spiele",
                qualifications: "Qualifizierungen"
            }
        }); 

        return (
            <Container>
                <Header size="large">{strings.title}</Header>
                <Card fluid>
                    <Card.Content>
                        <Card.Header>{strings.pastGames}</Card.Header>
                        <Card.Description>
                            <Table textAlign="center">
                                <Table.Body>
                                    {this.getLastMatchesWithScore().map(match => 
                                        <GameResultTableElement key={match.id} match={this.preprocessMatch(match)} />
                                    )}
                                </Table.Body>
                            </Table>
                        </Card.Description>
                    </Card.Content>
                </Card>
                <Card fluid>
                    <Card.Content>
                        <Card.Header>{strings.nextGames}</Card.Header>
                        <Card.Description>
                            <Table textAlign="center">
                                <Table.Body>
                                    {this.getNextMatchesWithoutScore().map(match => 
                                        <GameResultTableElement key={match.id} match={this.preprocessMatch(match)} />
                                    )}
                                </Table.Body>
                            </Table>
                        </Card.Description>
                    </Card.Content>
                </Card>
                <Card fluid>
                    <Card.Content>
                        <Card.Header>{strings.qualifications}</Card.Header>
                        <Card.Description>
                            <Table textAlign="center">
                                <Table.Body>
                                    {this.getNextStageWithoutTeams().map(match => 
                                        <NextStageTableElement key={match.id} match={match} teams={this.props.teams} />
                                    )}
                                </Table.Body>
                            </Table>
                        </Card.Description>
                    </Card.Content>
                </Card>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        matches: state.matches
    }
}

export default connect(mapStateToProps)(Results);
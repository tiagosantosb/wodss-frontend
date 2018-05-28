import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Container, Tab, Button, Grid, Modal } from 'semantic-ui-react'
import { BrowserRouter as Router } from 'react-router-dom';
import GameTable from './GameTable';
import LocalizedStrings from 'react-localization';

class Games extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: this.combineMatchesAndBets(this.props.matches, this.props.bets),
      infoModal: false
    }
  }

  propertiesDidChange = (nextProps) => {
    return JSON.stringify(this.props.matches) !== JSON.stringify(nextProps.matches)
        || JSON.stringify(this.props.bets) !== JSON.stringify(nextProps.bets);
  }

  // combine matches and bets into games
  combineMatchesAndBets = (matches, bets) => {
    let games = [];
    matches.forEach(match => {
      let bet = bets.find(bet => { return bet.matchId === match.id; });
      let game = { bet: bet, match: match };
      games.push(game);
    });
    return games;
  }

  render() {
    let strings = new LocalizedStrings({
      de: {
        yourBets: "Deine Tipps",
        scoring: "Punktesystem",
        day1: "Spieltag 1",
        day2: "Spieltag 2",
        day3: "Spieltag 3 ",
        roundOf16: "Achtelfinale",
        quarterFinals: "Viertelfinale",
        semiFinals: "Halbfinale",
        final: "Final",
        headingP1: "Punkteverteilung",
        scoringP1: "Du erhälst 1 Punkt für die richtige Tendenz und 1 Punkt für eine korrekte Tordifferenz oder 4 Punkte für jedes richtig getippte Ergebnis.",
        headingP2: "Beispiel",
        scoringP2: "Tippst du auf einen 2-0 Sieg für die Schweiz, diese gewinnt jedoch nur 1-0, erhälst du 1 Punkt für die richtige Tendenz. Gewinnt die Schweiz 3-1 erhälst du 2 Punkte für die Tendenz und Tordifferenz. Gewinnt sie tatsächlich 2-0, so erhälst du 4 Punkte.",
        headingP3: "Spielzeit",
        scoringP3: "Getippt wird auf das Ergebnis nach der regulären Spielzeit und einer etwaigen Verlängerung, also noch vor einem Elfmeterschiessen. Dadurch sind Unentschieden auch nach der Gruppenphase möglich."
      }
    });

    const panes = [
      { menuItem: strings.day1, render: () => <Tab.Pane><GameTable games={this.state.games.filter((g) => { return g.match.category === 1 })} /></Tab.Pane> },
      { menuItem: strings.day2, render: () => <Tab.Pane><GameTable games={this.state.games.filter((g) => { return g.match.category === 2 })} /></Tab.Pane> },
      { menuItem: strings.day3, render: () => <Tab.Pane><GameTable games={this.state.games.filter((g) => { return g.match.category === 3 })} /></Tab.Pane> },
      { menuItem: strings.roundOf16, render: () => <Tab.Pane><GameTable games={this.state.games.filter((g) => { return g.match.category === 4 })} /></Tab.Pane> },
      { menuItem: strings.quarterFinals, render: () => <Tab.Pane><GameTable games={this.state.games.filter((g) => { return g.match.category === 5 })} /></Tab.Pane> },
      { menuItem: strings.semiFinals, render: () => <Tab.Pane><GameTable games={this.state.games.filter((g) => { return g.match.category === 6 })} /></Tab.Pane> },
      { menuItem: strings.final, render: () => <Tab.Pane><GameTable games={this.state.games.filter((g) => { return g.match.category === 7 })} /></Tab.Pane> }
    ];

    const styles = {
      header: { marginBottom: '1rem' }
    };

    return (
      <Container>
        <Grid>
          <Grid.Column width={14} style={styles.header}>
            <Header size="large">{strings.yourBets}</Header>
          </Grid.Column>
          <Grid.Column width={2}>
            <Button circular primary icon="info" floated="right" onClick={() => this.setState({ infoModal: true })} />
          </Grid.Column>
        </Grid>
        <Router>
          <Tab panes={panes} defaultActiveIndex={this.props.stage} />
        </Router>
        <Modal open={this.state.infoModal} size="tiny" onClose={() => this.setState({ infoModal: false })}>
          <Modal.Header>{strings.scoring}</Modal.Header>
          <Modal.Content>
            <Header size="small">{strings.headingP1}</Header>
            <p>{strings.scoringP1}</p>
            <Header size="small">{strings.headingP2}</Header>
            <p>{strings.scoringP2}</p>
            <Header size="small">{strings.headingP3}</Header>
            <p>{strings.scoringP3}</p>
          </Modal.Content>
        </Modal>
      </Container>
    )
  }

  componentWillReceiveProps(nextProps) {
    if(this.propertiesDidChange(nextProps)) {
      this.setState({ games: this.combineMatchesAndBets(nextProps.matches, nextProps.bets) });
    }
  }
}

const mapStateToProps = (state) => {
  return {
    matches: state.matches,
    bets: state.bets,
    stage: state.stage
  }
}

export default connect(mapStateToProps)(Games)

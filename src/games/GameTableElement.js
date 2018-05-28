import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import GameModal from './GameModal';
import LocalizedStrings from 'react-localization';

export default class GameTableElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
  }

  openModal = () => {
    this.setState({ showModal: true });
  }

  closeModal  = () => {
    this.setState({ showModal: false });
  }

  parseDate = (datetime) => {
    const date = new Date(datetime);
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    return [date.toLocaleDateString("de-DE",options), ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)];
  } 
  
  render() {
    const game = this.props.game;
    const [day, time] = this.parseDate(game.match.datetime);

    let strings = new LocalizedStrings({
      de: {
        yourBet: "Dein Tipp",
        result: "Ergebnis",
        points: "Punkte"
      }
    }); 

    let styles = {
      upperCase: { textTransform: 'uppercase' },
      displayBlock: { display: 'block' }
    };

    return (
      <Table.Row onClick={this.openModal}>
        <Table.Cell width={1}>
          <img src={'/flags.png'} 
               className={'flag ' + (game.match.team1 ? game.match.team1.code : 'placeholder')} 
               alt={game.match.team1 ? game.match.team1.code : 'placeholder'} />
        </Table.Cell>
        <Table.Cell width={3} style={styles.upperCase}>{game.match.team1 ? game.match.team1.name : '-'}</Table.Cell>
        <Table.Cell width={2}><small style={styles.displayBlock}>{day}</small>{time}</Table.Cell>
        <Table.Cell width={3} style={styles.upperCase}>{game.match.team2 ? game.match.team2.name : '-'}</Table.Cell>
        <Table.Cell width={1}>
          <img src={'/flags.png'} 
               className={'flag ' + (game.match.team2 ? game.match.team2.code : 'placeholder')} 
               alt={game.match.team2 ? game.match.team2.code : 'placeholder'} />
        </Table.Cell>
        <Table.Cell width={2}><small style={styles.displayBlock}>{strings.yourBet}</small>{game.bet != null ? game.bet.team1Score + ':' + game.bet.team2Score : '-'}</Table.Cell>
        <Table.Cell width={1}><small style={styles.displayBlock}>{strings.result}</small>{game.match.finished ? game.match.result.team1 + ':' + game.match.result.team2 : '-'}</Table.Cell>
        <Table.Cell width={2}>{game.match.finished ? (<small style={styles.displayBlock}>{strings.points}</small>) : ''}{game.match.finished && game.bet ? game.bet.points : '-'}</Table.Cell>
        <GameModal open={this.state.showModal} game={game} onClose={this.closeModal} />
      </Table.Row>
    )
  }
}
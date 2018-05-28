import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import { Header, Button, Container, Modal, Label, Input } from 'semantic-ui-react';
import { setBetOnServer } from '../actions/betActions';
import LocalizedStrings from 'react-localization';

class GameModal extends Component {
    constructor(props) {
        super(props);
        this.state = { team1: '', team2: '', betModified: false };
    }

    handleChange = (e) => {
        let state = {...this.state};
        state[e.target.id] = e.target.value;
        state.betModified = this.betModified(state, this.props.game.bet);
        this.setState(state);
    }

    handleSave = () => {
        let state = {...this.state};
        // replace empty inputs with zero
        if(state.team1 === '') state.team1 = 0;
        if(state.team2 === '') state.team2 = 0;
        // disable the save button
        state.betModified = false;
        this.setState(state);
        // prepare bet object
        let bet = { matchId: this.props.game.match.id, team1Score: state.team1, team2Score: state.team2 };
        if(this.props.game.bet != null) bet.id = this.props.game.bet.id;
        this.props.setGameBet(bet);
    }

    betModified = (bet, state) => {
        if(state == null) state = {};
        state.team1 = (state.team1 == null) ? '' : state.team1;
        state.team2 = (state.team2 == null) ? '' : state.team2;
        return !(bet.team1 === state.team1 && bet.team2 === state.team2);
    }

    render() {
        const open = this.props.open;
        const game = this.props.game;
        const onClose = this.props.onClose;

        let strings = new LocalizedStrings({
            de: {
              draw: "Unentschieden",
              yourBet: "Dein Tipp",
              save: "Speichern",
              otherBets: "Das haben andere getippt"
            }
        }); 

        const styles = {
            header: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
            title: { padding: '0 1em', textTransform: 'uppercase' },
            textCenter: { textAlign: 'center' },
            separator: { fontSize: '2em', padding: '0 0.5em' },
            button: { margin: '1em 0', width: '190px' },
            stadium: { fontWeight: 'bold', fontSize: '0.8em', textAlign: 'center', marginTop: '1em' },
            city: { fontWeight: 'normal', fontSize: '0.7em', textAlign: 'center' },
            input: { width: '4em' }
        };

        const chartData = { 
            labels: [(game.match.team2 ? game.match.team2.name : '-'), strings.draw, (game.match.team1 ? game.match.team1.name : '-')], 
            datasets: [{ 
                data: [
                    game.match.statistics.team2, 
                    game.match.statistics.draw, 
                    game.match.statistics.team1
                ], 
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }]
        };
  
        return (
            <Modal open={open} onClose={onClose} size="tiny">
                <Modal.Header>
                    <div style={styles.header}>
                        <img src={'/flags.png'} 
                            className={'flag ' + (game.match.team1 ? game.match.team1.code : 'placeholder')} 
                            alt={game.match.team1 ? game.match.team1.code : 'placeholder'} />
                        <span style={styles.title}>{game.match.team1 ? game.match.team1.name : '-'} &mdash; {game.match.team2 ? game.match.team2.name : '-'}</span>
                        <img src={'/flags.png'} 
                            className={'flag ' + (game.match.team2 ? game.match.team2.code : 'placeholder')} 
                            alt={game.match.team2 ? game.match.team2.code : 'placeholder'} />
                    </div>
                    <div style={styles.stadium}>{game.match.stadium.name}</div>
                    <div style={styles.city}>{game.match.stadium.city}</div>
                </Modal.Header>
                <Modal.Content style={styles.textCenter}>
                    <Header size="medium">{strings.yourBet}</Header>
                    {game.match.finished === false ? (
                        <div>
                            <Container>
                                <Input id="team1" 
                                       size="huge" 
                                       type="number" 
                                       min="0" 
                                       max="99" 
                                       className="text-center" 
                                       value={this.state.team1}
                                       onChange={this.handleChange}
                                       style={styles.input} />
                                <span style={styles.separator}>-</span>
                                <Input id="team2" 
                                       size="huge" 
                                       type="number" 
                                       min="0" 
                                       max="99" 
                                       className="text-center" 
                                       value={this.state.team2}
                                       onChange={this.handleChange}
                                       style={styles.input} />
                            </Container>
                            <Button icon="check" color="green" style={styles.button} disabled={!this.state.betModified} onClick={this.handleSave} content={strings.save} />
                        </div>
                    ) : (
                        <Container>
                            <Label size="massive">{game.bet != null ? game.bet.team1Score : '/'}</Label>
                            <span style={styles.separator}>-</span>
                            <Label size="massive">{game.bet != null ? game.bet.team2Score : '/'}</Label>
                        </Container>
                    )}
                    <Header size="medium">{strings.otherBets}</Header>
                    <Doughnut data={chartData} options={{cutoutPercentage: 80}} legend={{position: 'bottom'}} />
                </Modal.Content>
            </Modal>
        )
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.game.bet !== undefined) {
            this.setState({ team1: nextProps.game.bet.team1Score });
            this.setState({ team2: nextProps.game.bet.team2Score });
        }
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setGameBet: (id, bet) => dispatch(setBetOnServer(id, bet))
  }
}

export default connect(null, mapDispatchToProps)(GameModal);
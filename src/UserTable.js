import React, { Component } from 'react';
import { Container, Table, Input, Button } from 'semantic-ui-react';
import LocalizedStrings from 'react-localization';

export default class UserTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: this.rankUsers(this.props.users)
    };
  }

  rankUsers = (users) => {
    let rank = 0, previousPoints = Infinity, previousRank = 0;
    return this.sortByPoints(users).map(user => {
      rank++;
      user = {...user, rank: (previousPoints > user.points) ? previousRank = rank : previousRank };
      previousPoints = user.points;
      return user;
    });
  }

  sortByPoints = (users) => {
    return users.sort((a, b) => { return b.points - a.points; });
  }

  handleSearch = (e) => {
    this.setState({ users: this.rankUsers(this.props.users).filter(user => {
      return user.name.toLowerCase().search(e.target.value.toLowerCase()) > -1;
    })});
  }

  render() {
    const styles = {
      search: { float: 'right', marginBottom: '1em' }
    };

    let strings = new LocalizedStrings({
      de: {
        rank: "Rang",
        name: "Name",
        points: "Punkte",
        search: "Suchen...",
        remove: "Entfernen"
      }
    }); 

    const sessionId = this.props.sessionId;
    let previousRank = 0;

    return (
      <Container>
        {this.props.searchable ? (<Input icon="search" placeholder={strings.search} style={styles.search} className="userTableSearch" onChange={this.handleSearch} />) : ''}
        <Table textAlign="center" basic="very">
          <Table.Header>
            {this.props.isCreator ?
              <Table.Row>
                <Table.HeaderCell width={2}>{strings.rank}</Table.HeaderCell>
                <Table.HeaderCell width={7}>{strings.name}</Table.HeaderCell>
                <Table.HeaderCell width={3}>{strings.points}</Table.HeaderCell>
                <Table.HeaderCell width={4} />
              </Table.Row>
            : 
              <Table.Row>
                <Table.HeaderCell width={2}>{strings.rank}</Table.HeaderCell>
                <Table.HeaderCell width={10}>{strings.name}</Table.HeaderCell>
                <Table.HeaderCell width={4}>{strings.points}</Table.HeaderCell>
              </Table.Row> 
            }
          </Table.Header>
          <Table.Body>
            {this.state.users && this.state.users.map(user => 
              this.props.isCreator ? 
                <Table.Row key={user.id} warning={user.id === sessionId}>
                  <Table.Cell>{(user.rank > previousRank) ? previousRank = user.rank : ''}</Table.Cell>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.points}</Table.Cell>
                  {user.id !== sessionId ?
                    <Table.Cell><Button icon="close" content={strings.remove} size="tiny" basic color="red" onClick={() => this.props.onRemove(user.id)} /></Table.Cell>
                  :
                    <Table.Cell />
                  }
                </Table.Row>
              :
                <Table.Row key={user.id} warning={user.id === sessionId}>
                  <Table.Cell>{(user.rank > previousRank) ? previousRank = user.rank : ''}</Table.Cell>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.points}</Table.Cell>
                </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Container>
    )
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ users: this.rankUsers(nextProps.users) });
  }
}
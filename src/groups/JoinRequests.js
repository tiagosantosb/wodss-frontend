import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import LocalizedStrings from 'react-localization';

export default class JoinRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            joinRequesters: this.props.joinRequesters
        };
    }

    render() {
        let strings = new LocalizedStrings({
            de: {
              name: "Name",
              decline: "Ablehnen",
              accept: "Aufnehmen"
            }
        }); 

        return (
            <Table basic="very">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={6}>{strings.name}</Table.HeaderCell>
                        <Table.HeaderCell width={10}></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.state.joinRequesters.map(user => 
                        <Table.Row key={user.id}>
                            <Table.Cell>{user.name}</Table.Cell>
                            <Table.Cell textAlign="right">
                                <Button icon="close" content={strings.decline} size="tiny" basic color="red" onClick={() => this.props.onDecline(user.id)} />
                                <Button icon="check" content={strings.accept} size="tiny" basic color="green" onClick={() => this.props.onAccept(user.id)} />
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        );
    }
}
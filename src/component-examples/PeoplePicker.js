/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React, { Component } from 'react';
import { NormalPeoplePicker } from 'office-ui-fabric-react/lib/Pickers';
import { Persona, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { Button } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export default class PeoplePickerExample extends Component {
  constructor(props) {
    super(props);

    // Text to show in the Suggestions window.
    this.suggestionProps = {
      suggestionsHeaderText: 'Suggested People',
      noResultsFoundText: 'No results found'
    };

    // Helper that uses the JavaScript SDK to communicate with Microsoft Graph.
    this.sdkHelper = window.sdkHelper;
    this.state = {
      selectedPeople: []
    };
    this._showError = this._showError.bind(this);
  }

  // Get the list of people to use as the picker data source.
  componentWillMount() {
    this.sdkHelper.getPeople((err, people) => {
      if (!err) {
        const personas = people.map((p) => {
          let persona = new Persona();

          persona.primaryText = p.displayName;
          persona.secondaryText = p.emailAddresses[0].address || p.userPrincipalName;
          persona.presence = 0;//PersonaPresence.none; resets to 2 at some point// presence isn't supported in Microsoft Graph yet
          persona.imageInitials = (!!p.givenName && !!p.surname) ? 
            p.givenName.substring(0,1) + p.surname.substring(0,1) : null;
          persona.initialsColor = Math.floor(Math.random() * 15) + 0;
          persona.props = { id: p.id };

          return persona;
        });

        this.sdkHelper.getProfilePics(personas, (err, personasWithPics) => {
          this.state = {
            peopleList: personasWithPics
          }
        });
    }
    else this._showError(err);
  });
}

  // Handler for when text is entered into the picker control.
  _onFilterChanged(filterText, items) {
    return filterText ? this.state.peopleList
      .filter(item => item.primaryText.toLowerCase().indexOf(filterText.toLowerCase() ) === 0)
      .filter(item => !this._listContainsPersona(item, items)) : [];
  }
  _listContainsPersona(persona, items) {
    if (!items || !items.length || items.length === 0) {
      return false;
    }
    return items.filter(item => item.primaryText === persona.primaryText).length > 0;
  }
  
  // Handler for when the selection changes in the picker control.
  _onSelectionChanged(items) { 
    // bug? often get this warning: Each child in an array or iterator should have a unique "key" prop.
    this.setState({
      mailResult: null,
      selectedPeople: items
    });
  }

  // Build and send the email to the selected people.
  _sendMailToSelectedPeople() {
    const recipients = this.state.selectedPeople.map((r) => {
      return {
        EmailAddress: {
          Address: r.secondaryText
        }
      }
    });
    this.sdkHelper.sendMail(recipients, (err, toRecipients) => {
      if (!err) {
        this.setState({
          result: {
            type: MessageBarType.success,
            text: `Mail sent to ${toRecipients.length} recipient(s).`
          }
        });
      }
      else this._showError(err);
    });
  }

  // Configure error message.
  _showError(err) {
    this.setState({
      result: {
        type: MessageBarType.error,
        text: `Error ${err.statusCode}: ${err.code} - ${err.message}`
      }
    });
  }

  //onGetMoreResults to page users?
  //onGetMoreResults?: (filter: string, selectedItems?: T[]) => T[] | PromiseLike<T[]>;

  // Renders the people picker using the NormalPeoplePicker template.
  render() {
    return (
      <div>

        <Label>
          Start typing a name in the People Picker:
        </Label>

        <NormalPeoplePicker
          onResolveSuggestions={ this._onFilterChanged.bind(this) }
          pickerSuggestionsProps={ this.suggestionProps }
          getTextFromItem={ (persona) => persona.primaryText }
          onChange={ this._onSelectionChanged.bind(this) }
          className='ms-PeoplePicker'
          key='normal' />
        <br />

        <Button
          buttonType={ 0 }
          onClick={ this._sendMailToSelectedPeople.bind(this) }
          disabled={ (this.state.selectedPeople.length > 0) ? false : true }>
          Send mail
        </Button>
        <br />
        <br />
        
        {
          this.state.result &&
            <MessageBar
              messageBarType={ this.state.result.type }>
              { this.state.result.text }
            </MessageBar> 
        }
      </div>
    );
  }
}

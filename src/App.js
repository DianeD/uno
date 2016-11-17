/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

// This sample uses an open source OAuth 2.0 library that is compatible with the Azure AD v2.0 endpoint.
// Microsoft does not provide fixes or direct support for this library.
// Refer to the library’s repository to file issues or for other support.
// For more information about auth libraries see: https://azure.microsoft.com/documentation/articles/active-directory-v2-libraries/
// Library repo: http://adodson.com/hello.js/

import React, { Component } from 'react';
import hello from 'hellojs';
window.hello = hello;
import GraphSdkHelper from './helpers/GraphSdkHelper';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import PeoplePickerExample from './component-examples/PeoplePicker';
import DetailsListExample from './component-examples/DetailsList';

export default class App extends Component {
  constructor(props) {
    super(props);
    
    // Initialize the auth network.
    hello.init({
      aad: {
        name: 'Azure Active Directory',	
        oauth: {
          version: 2,
          auth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
        },
        scope_delim: ' ',
        form: false
      }
    });
    
    // Initialize the Graph SDK helper and save it in the window object.
    this.sdkHelper = new GraphSdkHelper({ login: this.login.bind(this) });
    window.sdkHelper = this.sdkHelper;

    // Set the isAuthenticated prop: true if there's an aad object in localStorage.hello. 
    this.state = {
      isAuthenticated: (!!hello('aad').getAuthResponse()),
      example: ''
    };
  }

  // Sign the user into Azure AD and store token info in localStorage.hello.
  login() {

    // Initialize the auth request.
    hello.init( {
      aad: 'f72833a0-1e92-46dc-9232-e2c50361dae5'
      }, {
      redirect_uri: 'http://localhost:3000/',
      scope: 'user.readbasic.all mail.send files.read'
    });

    hello.login('aad', { 
      display: 'page',
      state: 'abcd'
    });
  }

  // Sign the user out of the session.
  logout() { 
    hello('aad').logout();
    this.setState({ 
      isAuthenticated: false,
      example: ''
    });
  }

  render() {
    return (
      <div>
        <div>
        {
          
          // Show the command bar with the Sign in or Sign out button.
          <CommandBar
            items={[
              {
                key: 'component-example-menu',
                name: 'Choose component',
                isDisabled: (!this.state.isAuthenticated),
                ariaLabel: 'Choose a component example to render in the page',
                onClick: () => { return; },
                items: [
                  {
                    key: 'picker-example',
                    name: 'People Picker',
                    onClick: () => { this.setState({ example: 'picker-example' }) }
                  },
                  {
                    key: 'details-list-example',
                    name: 'Details List',
                    onClick: () => { this.setState({ example: 'details-list-example' }) }
                  }
                ]
              }  
            ]}
            farItems={[
              {
                key: 'log-in-out=button',
                name: (this.state.isAuthenticated) ? 'Sign out' : 'Sign in',
                onClick: (this.state.isAuthenticated) ? this.logout.bind(this) : this.login.bind(this)
              }
            ]} />
        }
        </div>
        <div className="ms-font-m">
          <div>
            <h2>Office Fabric Components Sample for Microsoft Graph</h2>
            {

              (!this.state.isAuthenticated || this.state.example === '') &&
              <div>
              <p>Welcome to the Office Fabric Components sample for Microsoft Graph!</p>
              <p>To get started, sign in and then choose a component in the command bar.</p>
              </div>
            }
          </div>
          <br />
          {
            
            // Show the selected fabric component example.
            this.state.isAuthenticated &&
              <div>
              {
                this.state.example === 'picker-example' &&
                <PeoplePickerExample />
              }
              {
                this.state.example === 'details-list-example' &&
                <DetailsListExample />
              }
              </div>
          }
          <br />
        </div>
      </div>
    );
  }
}

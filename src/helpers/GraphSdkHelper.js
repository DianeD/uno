/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import Graph from 'msgraph-sdk-javascript';
import async from 'async';

export default class GraphSdkHelper {
  constructor(props) {

    // Initialize the Graph SDK.
    this.client = Graph.init({
      headers: { 'SampleID': 'someHeaderValue' },
      debugLogging: true,
      authProvider: (done) => {
        done(null, window.hello('aad').getAuthResponse().access_token);
      }
    });

    // GET me
    this.getMe = (callback) => {
      this.client 
        .api('/me')
        .select('displayName')
        .get((err, res) => {
          if (!err) {
            callback(res);
          }
          else this._handleError(err);
        });
    }

    // GET me/people
    this.getPeople = (callback) => {
      this.client 
        .api('/me/people')
        .version('beta')
        .filter(`personType eq 'Person'`)
        .select('displayName,givenName,surname,emailAddresses,userPrincipalName')
        .get((err, res) => {
          if (err) {
            this._handleError(err);
          }
          callback(err, (res) ? res.value : null);
        });
    }

    // GET user/id/photo/$value for each person
    this.getProfilePics = (personas, callback) => {
      const personasWithPics = [];
      const pic = (p, done) => {
        this.client 
          .api(`users/${p.props.id}/photo/$value`)
          .responseType('blob')
          .get((err, res, rawResponse) => {
            if (err) {

              // Handle case where the person doesn't have profile pic.
              if (err.statusCode === 404) {            
                personasWithPics.push(p);
              }
              done(err);
            } 
            else {
              p.imageUrl = window.URL.createObjectURL(rawResponse.xhr.response);
              p.initialsColor = null;
              personasWithPics.push(p);
              done();
            }
          });
      };
      async.each(personas, pic, (err) => {
        callback(err, personasWithPics);
      });
    }

    // POST me/sendMail
    this.sendMail = (recipients, callback) => {
      const email = {
        Subject: 'Email from the Microsoft Graph Sample with Office UI Fabric',
        Body: {
          ContentType: 'HTML',
          Content: `<p>Thanks for trying out Office UI Fabric!</p>
            <p>See what else you can do with <a href="http://dev.office.com/fabric#/components">
            Fabric React components</a>.</p>`
        },
        ToRecipients: recipients
      };
      this.client
        .api('/me/sendMail')
        .post({ 'message': email, 'saveToSentItems': true }, (err, res, rawResponse) => {
          if (err) {
            this._handleError(err);
          }
          callback(err, rawResponse.req._data.message.ToRecipients);
        });
    }

    // GET drive/root/children
    this.getFiles = (nextLink, callback) => {
      if (nextLink) {
        this.client
          .api(nextLink)
          .get((err, res) => {
            if (err) {
              this._handleError(err);
            }
            callback(err, res);
          });
      }
      else {
        this.client
          .api('/me/drive/root/children') 
          //.filter(`file ne null`) /////////////would prefer this
          .select('name,createdBy,createdDateTime,lastModifiedBy,lastModifiedDateTime,webUrl,file')
          .top(5) // default page size is 200
          .get((err, res) => {
            if (err) {
              this._handleError(err);
            }
            callback(err, res);
          });
      }
    }

    this._handleError = this._handleError.bind(this);
    this.props = props;
  }
  
  _handleError(err) {
    console.log(err.code + ' - ' + err.message);

    // This sample just redirects to the login function when the token is expired.
    // Production apps should implement more robust token management (check expiry, issue silent xxx).
    if (err.statusCode === 401 && err.message === 'Access token has expired.') {
      this.props.login();
    }
  }
}

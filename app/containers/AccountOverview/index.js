import * as React from 'react';
import { Button, Icon } from 'antd';
import Img from '../../components/Img';
import Profile from '../../images/icon-512x512.png';
import './AccountOverview.css';

export default class AccountOverview extends React.PureComponent {
  state = {
    userinfo: {
      iban: '',
    },
  };

  componentDidMount() {
    fetch('http://bunq.serveo.net/monetary-account?userId=21821', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const temp = data.filter(
          account =>
            // console.log(account.MonetaryAccountBank.id);
            // console.log(
            //   account.MonetaryAccountBank.id ===
            //     window.localStorage.getItem('currentAccountID'),
            // );
          (
            account.MonetaryAccountBank.id ===
            window.localStorage.getItem('currentAccountID'),
        );
      })
      .then(account => {
        console.log(account);
        this.setState({
          userinfo: account.description,
        });
      });
  }

  render() {
    return (
      <div className="overview">
        <div className="overview__header">
          <Img className="overview__logo" src={Profile} alt="account_logo" />
          <div>Account Name</div>
        </div>
        <div className="overview__body">
          <Button className="overview__pay">Pay</Button>
          <a className="overview__option" href="add-money">
            <div className="overview__option-text">
              <Icon type="setting" />
              Add Money
            </div>
            <Icon type="right" />
          </a>
          <a className="overview__option" href="settings">
            <div className="overview__option-text">
              <Icon type="setting" />
              Settings
            </div>
            <Icon type="right" />
          </a>
          <a className="overview__option" href="limit-transaction">
            <div className="overview__option-text">
              <Icon type="setting" />
              Limit Transaction
            </div>
            <Icon type="right" />
          </a>
          <a className="overview__option" href="/time-limit">
            <div className="overview__option-text">
              <Icon type="setting" />
              Time Limit
            </div>
            <Icon type="right" />
          </a>
        </div>
      </div>
    );
  }
}

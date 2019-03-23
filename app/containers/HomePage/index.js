/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Form, Icon, Input, Button, Checkbox, Select } from 'antd';
import './index.css';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError,
} from 'containers/App/selectors';
import H2 from 'components/H2';
import ReposList from 'components/ReposList';
import CenteredSection from './CenteredSection';
import Section from './Section';
import messages from './messages';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';

const Option = Select.Option;
const children = [];
for (let i = 10; i < 36; i += 1) {
  children.push(<Option key={i * 1000}>{i * 1000} seconds</Option>);
}

/* eslint-disable react/prefer-stateless-function */
export class HomePage extends React.PureComponent {
  state = {
    name: '',
    limit: null,
  };

  constructor(props) {
    super(props);
    this.setTimer = this.setTimer.bind(this);
    this.onTimePickerChange = this.onTimePickerChange.bind(this);
  }

  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    if (this.props.username && this.props.username.trim().length > 0) {
      this.props.onSubmitForm();
    }
  }

  setTimer() {
    const now = new Date().getTime();
    window.localStorage.setItem('time_create', JSON.stringify(now));
    window.localStorage.setItem('limit', JSON.stringify(this.state.limit));
  }

  onTimePickerChange(time) {
    this.setState({
      limit: time,
    });
  }

  createAccount(e) {
    e.preventDefault();
    const body = {
      userId: '21821',
      currency: 'EUR',
      description: 'Try',
      dailyLimit: '1000',
      color: '#0099CC',
    };

    fetch('http://bunq.serveo.net/monetary-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(
        data => window.localStorage.setItem('currentAccountID', data[0].Id.id),
        (window.location.href = '/overview'),
      );
  }

  render() {
    const { loading, error, repos } = this.props;
    const reposListProps = {
      loading,
      error,
      repos,
    };

    return (
      <article>
        <Helmet>
          <title>Home Page</title>
          <meta
            name="description"
            content="A React.js Boilerplate application homepage"
          />
        </Helmet>
        <div>
          <CenteredSection>
            <H2>
              <FormattedMessage {...messages.startProjectHeader} />
            </H2>
            <p>
              <FormattedMessage {...messages.startProjectMessage} />
            </p>
          </CenteredSection>
          <Section className="create">
            <H2>
              <FormattedMessage {...messages.trymeHeader} />
            </H2>
            <Form className="create-form" onSubmit={this.createAccount}>
              <Form.Item>
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="name"
                />
              </Form.Item>
              <Form.Item>
                <Select
                  value={this.state.limit}
                  onChange={this.onTimePickerChange}
                >
                  {children}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="create-account-button"
                  onClick={this.setTimer}
                >
                  Create
                </Button>
              </Form.Item>
            </Form>
            <ReposList {...reposListProps} />
          </Section>
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);

import React from 'react';
import { withRouter, RouteComponentProps, Switch, Route } from 'react-router-dom';
import CapabilityList from './CapabilityList';
import CapabilityDetail from './CapabilityDetail';

const Capabilities: React.SFC<RouteComponentProps> = ({ match }) => {
  return (
    <Switch>
      <Route exact default path={`${match.url}`} component={CapabilityList} />
      <Route exact path={`${match.url}/:capabilityId`} component={CapabilityDetail} />
    </Switch>
  )
};

export default withRouter(Capabilities);

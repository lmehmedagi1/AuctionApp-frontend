import React from 'react'
import { homeUrl, aboutUrl, termsAndConditionsUrl, privacyPolicyUrl, shopPageUrl, itemPageUrls, loginUrl, registerUrl, userProfileUrls, sellPageUrl } from 'utils/url'

import {
  Switch,
  Route
} from "react-router-dom";

import ProtectedRoute from 'router/ProtectedRoute';

import TearmsAndConditions from 'components/TearmsAndConditions'
import PrivacyPolicy from 'components/PrivacyPolicy'
import AboutUs from 'components/AboutUs'

import Login from 'components/Login'
import Register from 'components/Register'
import LandingPage from 'components/LandingPage'
import ShopPage from 'components/ShopPage'
import ItemPage from 'components/ItemPage'
import UserProfilePage from 'components/UserProfilePage'

import ScrollToTop from 'utils/ScrollToTop'
import NotFound from 'components/NotFound'
import SellPage from 'components/SellPage'

function Routes(props) {
  return (
    <ScrollToTop>
      <Switch>
        <Route exact path={homeUrl} render={(routeProps) => <LandingPage {...routeProps} setToken={props.setToken}/>}></Route>
        <Route exact path={aboutUrl}><AboutUs /></Route>
        <Route path={termsAndConditionsUrl}><TearmsAndConditions /></Route>
        <Route path={privacyPolicyUrl}><PrivacyPolicy /></Route>
        <Route path={itemPageUrls} render={(routeProps) => <ItemPage {...routeProps} setToken={props.setToken} getToken={props.getToken}/>}></Route>
        <Route exact path={shopPageUrl} component={ShopPage} />
        <Route path={loginUrl}><Login setToken={props.setToken} /></Route>
        <Route path={registerUrl}><Register setToken={props.setToken} /></Route>
        <ProtectedRoute path={sellPageUrl}><SellPage setToken={props.setToken} getToken={props.getToken}/></ProtectedRoute>
        <ProtectedRoute exact path={userProfileUrls}><UserProfilePage setToken={props.setToken} getToken={props.getToken}/></ProtectedRoute>
        <Route><NotFound/></Route>
      </Switch>
    </ScrollToTop>
  )
}

export default Routes;

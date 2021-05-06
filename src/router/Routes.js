import React from 'react'
import { homeUrl, aboutUrl, termsAndConditionsUrl, privacyPolicyUrl, shopPageUrl, itemPageUrls, loginUrl, registerUrl, userProfileUrls, sellPageUrl, resetPasswordUrl } from 'utils/url'

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
import PasswordReset from 'components/PasswordReset';

function Routes(props) {
  return (
    <ScrollToTop>
      <Switch>
        <Route exact path={homeUrl} render={(routeProps) => <LandingPage {...routeProps} setToken={props.setToken} getToken={props.getToken}/>}></Route>
        <Route exact path={aboutUrl} render={(routeProps) => <AboutUs {...routeProps} setToken={props.setToken} getToken={props.getToken}/>}></Route>
        <Route path={termsAndConditionsUrl} render={(routeProps) => <TearmsAndConditions {...routeProps} setToken={props.setToken} getToken={props.getToken}/>}></Route>
        <Route path={privacyPolicyUrl} render={(routeProps) => <PrivacyPolicy {...routeProps} setToken={props.setToken} getToken={props.getToken}/>}></Route>
        <Route path={itemPageUrls} render={(routeProps) => <ItemPage {...routeProps} setToken={props.setToken} getToken={props.getToken}/>}></Route>
        <Route exact path={shopPageUrl} render={(routeProps) => <ShopPage {...routeProps} setToken={props.setToken} getToken={props.getToken}/>}></Route>
        <Route path={loginUrl} render={(routeProps) => <Login {...routeProps} setToken={props.setToken} getToken={props.getToken}/>}></Route>
        <Route path={registerUrl} render={(routeProps) => <Register {...routeProps} setToken={props.setToken} getToken={props.getToken}/>}></Route>
        <Route path={resetPasswordUrl} render={(routeProps) => <PasswordReset {...routeProps} setToken={props.setToken} getToken={props.getToken}/>}></Route>
        <ProtectedRoute path={sellPageUrl}><SellPage setToken={props.setToken} getToken={props.getToken}/></ProtectedRoute>
        <ProtectedRoute exact path={userProfileUrls}><UserProfilePage setToken={props.setToken} getToken={props.getToken}/></ProtectedRoute>
        <Route><NotFound/></Route>
      </Switch>
    </ScrollToTop>
  )
}

export default Routes;

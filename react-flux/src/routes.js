'use strcit';

var React = require('react');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var Route = Router.Route;
var Redirect = Router.Redirect;

var routes = (
    <Route name="app" path="/" handler={ require('./components/app') }>
        <DefaultRoute handler={ require('./components/homePage') } />
        <NotFoundRoute handler={ require('./components/notFoundPage') } />
        <Route name="authors" handler={ require('./components/authors/authorPage')} />
        <Route name="addAuthor" path="author" handler={ require('./components/authors/manageAuthorPage')} />
        <Route name="manageAuthor" path="author/:id" handler={ require('./components/authors/manageAuthorPage')} />
        <Route name="about" handler={ require('./components/about/aboutPage')} />
        <Redirect from="about-us" to="about" />
        <Redirect from="about/*" to="about" />
        <Redirect from="awthors" to="authors" />
    </Route>
);

module.exports = routes;

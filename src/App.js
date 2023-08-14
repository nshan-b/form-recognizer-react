import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
//import AppRoutes from './AppRoutes';
//import './styles/global.css';
import Home from './routes/Home';

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <>
                <Home />
            </>
        );
    }
}
import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import AppRoutes from './AppRoutes';
//import './styles/global.css';
import Home from './routes/Home';
import CustomSidebar from './components/CustomSidebar';
import Preview from './routes/Preview';
import DocEdit from './routes/DocEdit';
import DQ from './routes/DQ';

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Router>
                <div style={{ display: 'flex' }}>
                    <CustomSidebar />
                    <div style={{ flex: 1 }}>
                        <Routes>
                            <Route exact path="/" element={<Home />} />
                            <Route path="/document-queue" element={<DQ />} />
                            <Route path="/preview" element={<Preview />} />
                            <Route path="/edit/:id" element={<DocEdit />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        );
    }
}
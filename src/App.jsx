import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/authcontext";
import AppContent from "./AppContent";
import ReactDOM from "react-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fallback for findDOMNode (ReactQuill compatibility)
if (!ReactDOM.findDOMNode) {
  ReactDOM.findDOMNode = (node) => {
    if (node instanceof HTMLElement) {
      return node;
    }
    return node ? node.$el || node : null;
  };
}

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;

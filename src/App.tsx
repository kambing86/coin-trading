import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Suspense, lazy } from "react";
import { Provider } from "react-redux";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import store from "./store";
import theme from "./theme";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const DashboardPage = lazy(() => import("./components/Dashboard"));

const NotFoundComponent = () => {
  return <div>Page Not Found</div>;
};

const useStyles = makeStyles({
  app: {
    margin: "0 auto",
    flex: "1 0 auto",
    padding: "1rem",
  },
});

const App = () => {
  const classes = useStyles();
  return (
    <div className={`App d-flex flex-wrap align-items-center ${classes.app}`}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Suspense fallback={<>Loading...</>}>
            <Router basename={process.env.PUBLIC_URL ?? ""}>
              <Switch>
                <Route exact path="/" component={DashboardPage} />
                <Route component={NotFoundComponent} />
              </Switch>
            </Router>
          </Suspense>
        </Provider>
      </ThemeProvider>
    </div>
  );
};

export default App;

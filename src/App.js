import React from "react";
// import "./App.css";
import Main from "./Main";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import enLocale from "date-fns/locale/en-US";

const loc = {
  en: enLocale,
};

function App() {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={loc["en"]}>
      <Main />
    </MuiPickersUtilsProvider>
  );
}

export default App;

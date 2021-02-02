import React, { useState, useEffect, Fragment } from "react";
import Avatar from "@material-ui/core/Avatar";
import { isAfter, isToday, format, addDays } from "date-fns";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import DriveEtaIcon from "@material-ui/icons/DriveEta";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import AirplanemodeActiveIcon from "@material-ui/icons/AirplanemodeActive";
import HotelIcon from "@material-ui/icons/Hotel";
import BusinessIcon from "@material-ui/icons/Business";
import DirectionsBoatIcon from "@material-ui/icons/DirectionsBoat";
import Container from "@material-ui/core/Container";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  InputLabel,
  NativeSelect,
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import { set } from "date-fns/esm";
import Icon from "@material-ui/core/Icon";

const api = window.wpApiSurpriceForm;
//const api = { url: "https://surprice.progressnet.io" };

const useStyles = makeStyles((theme) => ({
  container: {
    border: 1,
    backgroundColor: "rgb(37 37 37 / 85%)",
    paddingBottom: 10,
  },
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",

    flexDirection: "column",
    alignItems: "center",
  },
  btn: {
    width: 300,
    // marginLeft: 30,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#e20612",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    justifyContent: "center",
    backgroundColor: "#193b7a",
    width: 180,
    paddingTop: 17,
    paddingBottom: 19,
    fontSize: 16,
  },
  side: {
    marginTop: theme.spacing(6),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
  },
  selectEmpty: {
    margin: 10,
  },
  text: {
    color: "white",
  },
  field: {
    color: "white",
    // margin: 10,
  },
  error: {
    flexDirection: "column",
  },
  icons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  areatext: {
    width: "100%",
    fontSize: 18,
  },
}));

function Main() {
  const [state, setState] = useState({
    fromDP: "",
    toDP: "",
    fromDT: "",
    toDT: "",
    age: null,
    code: "",
    country: "",
  });
  const [countries, setCountries] = useState(null);
  const [areas, setAreas] = useState(null);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(addDays(new Date(), 7));
  const [check, setCheck] = useState(false);
  const [inputValueFrom, setInputValueFrom] = React.useState("");
  const [valueFrom, setValueFrom] = useState(null);
  const [valueTo, setValueTo] = useState(null);
  const [inputValueTo, setInputValueTo] = React.useState("");

  useEffect(() => {
    if (api) {
      fetchInitialData(api);
    }
  }, []);

  useEffect(() => {
    let area;
    if (state.fromDP) {
      area = state.fromDP.replace(/\s+/g, "%20");
      getCountry(area);
    }
  }, [state.fromDP]);

  useEffect(() => {
    let dt;
    if (fromDate) {
      setToDate(addDays(fromDate, 7));
    }
  }, [fromDate]);

  useEffect(() => {
    let dp;
    if (state.country) {
      dp = state.country.replace(/\s+/g, "%20");
      getDepartments(dp).then((response) => {
        const found = response.find((res) => res === state.fromDP);
        if (!found) {
          setValueTo(response[0]);
          setValueFrom(response[0]);
          setState({
            ...state,
            fromDP: response[0],
            toDP: response[0],
          });
        }
      });
    }
  }, [state.country]);

  const callAreasApi = async (url, cb) => {
    // setLoading(true);
    try {
      await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) =>
          response
            .json()
            .then((res) => ({ status: response.status, body: res }))
        )
        .then((myJson) => {
          if (myJson.status === 200) {
            cb(myJson.body);
            // setValueFrom(myJson.body[0]);
          } else {
            cb([]);
          }
        });
    } catch (error) {
      console.log(error);
      // console.log(error);
    }
  };

  const callCountriesApi = async (url, cb) => {
    // setLoading(true);
    try {
      await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) =>
          response
            .json()
            .then((res) => ({ status: response.status, body: res }))
        )
        .then((myJson) => {
          if (myJson.status === 200) {
            cb(myJson.body);
          } else {
            cb([]);
          }
        });
    } catch (error) {
      console.log(error);
      // console.log(error);
    }
  };

  const getCountry = async (ar) => {
    try {
      await fetch(`${api.url}/wp-json/progressnet/v1/area?chosen=${ar}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) =>
          response
            .json()
            .then((res) => ({ status: response.status, body: res }))
        )
        .then((myJson) => {
          if (myJson.status < 300) {
            setState({ ...state, country: myJson.body });
          } else {
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getDepartments = async (ar) => {
    let dp;
    try {
      await fetch(`${api.url}/wp-json/progressnet/v1/country?chosen=${ar}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) =>
          response
            .json()
            .then((res) => ({ status: response.status, body: res }))
        )
        .then((myJson) => {
          if (myJson.status < 300) {
            setAreas(myJson.body);

            dp = myJson.body;
          } else {
            console.log(myJson);
          }
        });
    } catch (error) {
      console.log(error);
    }
    return dp;
  };

  const fetchInitialData = async (url) => {
    const urlA = `${url.url}/wp-json/progressnet/v1/areas`;
    const urlB = `${url.url}/wp-json/progressnet/v1/countries`;

    await Promise.all([
      callAreasApi(urlA, setAreas),
      callCountriesApi(urlB, setCountries),
    ]);
  };

  const handleSearch = (event) => {
    if (state.age < 23) {
      setCheck(true);
      return;
    }
    if (!state.age) {
      return;
    }
    const todateFormat = format(new Date(toDate), "dd-MM-yyy");
    const fromdateFormat = format(new Date(fromDate), "dd-MM-yyy");
    const toTimeFormat = format(new Date(toDate), "HH:mm");
    const fromTimeFormat = format(new Date(fromDate), "HH:mm");

    const promo = () => {
      if (state.code) {
        return `&s_promo=${state.code}`;
      } else {
        return "";
      }
    };

    const url =
      api.url +
      "/choose-your-car/?areafrom=" +
      state.fromDP.replace(/\s+/g, "+") +
      "&areato=" +
      state.toDP.replace(/\s+/g, "+") +
      "&start_date=" +
      fromdateFormat +
      "&selectPickTime=" +
      fromTimeFormat.replace(/:/g, "%3A") +
      "&end_date=" +
      todateFormat +
      "&selectDropTime=" +
      toTimeFormat.replace(/:/g, "%3A") +
      "&s_age=" +
      state.age +
      promo() +
      "&s_country=" +
      state.country;

    window.location.replace(url);
    event.preventDefault();
  };

  const getIcon = (item) => {
    let str = item.toString().toLowerCase();

    if (str.includes("airport")) {
      return <AirplanemodeActiveIcon />;
    } else if (str.includes("hotel")) {
      return <HotelIcon />;
    } else if (str.includes("office")) {
      return <BusinessIcon />;
    } else if (str.includes("port")) {
      return <DirectionsBoatIcon />;
    } else {
      return <BusinessIcon />;
    }
  };

  const handleDateFromChange = (name, val) => {
    const result = isAfter(new Date(val), new Date());
    const todayFormat = format(new Date(), "yyyy-MM-dd'T'HH:mm");

    if (result) {
      setState({
        ...state,
        [name]: val,
      });
    } else if (isToday(new Date(val))) {
      setState({
        ...state,
        [name]: val,
      });
    } else {
      setState({
        ...state,
        [name]: todayFormat,
      });
    }
  };

  const handleFieldsChange = (name, val) => {
    setState({
      ...state,
      [name]: val,
    });
  };

  const addFields = (val) => {
    // handleFieldsChange("toDP", val.target.value);
    // handleFieldsChange("fromDP", val.target.value);
    setValueTo(val);
    setState({
      ...state,
      toDP: val,
      fromDP: val,
    });
  };
  const classes = useStyles();

  return (
    <Container className={classes.container} component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5" className={classes.text}>
          Make a reservation wherever you are
        </Typography>
        <form className={classes.form} noValidate>
          <div className={classes.side}>
            <FormControl>
              {/* <InputLabel id="pick-up" className={classes.text}>
                Pick Up Location*
              </InputLabel> */}
              {areas?.length > 0 && (
                <Autocomplete
                  id="pick-up"
                  options={areas}
                  value={valueFrom}
                  getOptionLabel={(option) => option}
                  style={{ width: 300 }}
                  onChange={(event, newValue) => {
                    setValueFrom(newValue);
                    addFields(newValue);
                  }}
                  inputValue={inputValueFrom}
                  onInputChange={(event, newInputValue) => {
                    setInputValueFrom(newInputValue);
                  }}
                  renderOption={(option) => {
                    return (
                      <Fragment>
                        <Icon style={{ marginRight: 5 }}>
                          {getIcon(option)}
                        </Icon>
                        {option}
                      </Fragment>
                    );
                  }}
                  renderInput={(params) => {
                    return (
                      <Fragment>
                        <TextField {...params} label="Pick Up Location*">
                          <Icon>{getIcon(params)}</Icon>
                        </TextField>
                      </Fragment>
                    );
                  }}
                />
              )}
              {/* <Select
                value={state.fromDP}
                onChange={(val) => addFields(val)}
                name="fromDP"
                labelId="pick-up"
                required
                fullWidth
                // className={classes.field}
                style={{ width: 300 }}
                inputProps={{ "aria-label": "fromDP" }}
              >
                {areas?.length > 0 &&
                  areas?.map((item, i) => {
                    return (
                      <MenuItem
                        className={classes.areatext}
                        key={i}
                        value={item}
                      >
                        <div className={classes.icons}>
                          <div style={{ padding: 10 }}>{getIcon(item)}</div>
                          {item}
                        </div>
                      </MenuItem>
                    );
                  })}
              </Select> */}
            </FormControl>
            <FormControl>
              {areas?.length > 0 && (
                <Autocomplete
                  id="drop-of"
                  options={areas}
                  value={valueTo}
                  getOptionLabel={(option) => option}
                  style={{ width: 300 }}
                  onChange={(event, newValue) => {
                    setValueTo(newValue);
                    handleFieldsChange("toDP", newValue);
                  }}
                  inputValue={inputValueTo}
                  onInputChange={(event, newInputValue) => {
                    setInputValueTo(newInputValue);
                  }}
                  renderOption={(option) => {
                    return (
                      <Fragment>
                        <Icon style={{ marginRight: 5 }}>
                          {getIcon(option)}
                        </Icon>
                        {option}
                      </Fragment>
                    );
                  }}
                  renderInput={(params) => {
                    return (
                      <Fragment>
                        <TextField {...params} label="Drop Of Location*">
                          <Icon>{getIcon(params)}</Icon>
                        </TextField>
                      </Fragment>
                    );
                  }}
                />
              )}
              {/* <InputLabel className={classes.text} id="drop-off">
                Drop Off Location*
              </InputLabel>
              <Select
                value={state.toDP}
                onChange={(val) => handleFieldsChange("toDP", val.target.value)}
                name="toDP"
                required
                style={{ width: 300 }}
                labelId="drop-off"
                fullWidth
                // className={classes.field}
                inputProps={{ "aria-label": "toDP" }}
              >
                {areas?.length > 0 &&
                  areas?.map((item, i) => {
                    return (
                      <MenuItem
                        className={classes.areatext}
                        key={i}
                        value={item}
                      >
                        <div className={classes.icons}>
                          <div style={{ padding: 10 }}>{getIcon(item)}</div>
                          {item}
                        </div>
                      </MenuItem>
                    );
                  })}
              </Select> */}
            </FormControl>
          </div>
          <div className={classes.side}>
            <KeyboardDateTimePicker
              value={fromDate}
              allowKeyboardControl
              disablePast
              ampm={false}
              style={{ width: 300 }}
              variant="dialog"
              minutesStep={5}
              onChange={setFromDate}
              label="Pickup Date*"
              format="dd/MM/yyyy hh:mm a"
            />

            <KeyboardDateTimePicker
              value={toDate}
              disablePast
              ampm={false}
              minDate={fromDate}
              allowKeyboardControl
              style={{ width: 300 }}
              variant="dialog"
              minutesStep={5}
              onChange={setToDate}
              label="Drop off Date/Time*"
              format="dd/MM/yyyy hh:mm a"
            />
          </div>
          <div className={classes.side}>
            <div className={classes.error}>
              <TextField
                error={check ? true : false}
                style={{ width: 300 }}
                id="standard-basic"
                label="Driver's Age*"
                className={classes.input}
                onChange={(e) => {
                  handleFieldsChange("age", e.target.value);
                  setCheck(false);
                }}
                helperText={
                  check ? `Driver's age must be greater or equal to 23` : null
                }
              />
            </div>
            <TextField
              style={{ width: 300 }}
              id="standard-basic"
              label="Promo Code"
              onChange={(e) => {
                handleFieldsChange("code", e.target.value);
              }}
            />
          </div>
          <div className={classes.side}>
            <FormControl>
              <InputLabel id="country">Choose Location By Country*</InputLabel>
              <Select
                value={state.country}
                onChange={(val) =>
                  handleFieldsChange("country", val.target.value)
                }
                style={{ width: 300 }}
                name="country"
                required
                labelId="country"
                fullWidth
                // className={classes.field}
                inputProps={{ "aria-label": "country" }}
              >
                {countries?.length > 0 &&
                  countries?.map((item, i) => {
                    return (
                      <MenuItem key={i} value={item}>
                        {item}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
            <div className={classes.btn}>
              <Button
                onClick={handleSearch}
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
              >
                FIND CAR
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Container>
  );
}

export default Main;

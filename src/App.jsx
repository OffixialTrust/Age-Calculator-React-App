import { useState } from 'react';
import './App.scss';
import arrowIcon from './assets/icon-arrow.svg';

function App() {
  // State to store calculated age
  const [userData, setUserData] = useState({
    years: "--",
    months: "--",
    days: "--"
  });

  // State to store user inputs
  const [inputs, setInputs] = useState({});

  // State to store error messages for each field
  const [errorMsg, setErrorMsg] = useState({
    day: "",
    month: "",
    year: ""
  });

  // State to manage pluralization of age units
  const [plural, setPlural] = useState({
    year: "s",
    month: "s",
    day: "s"
  });

  // State to track error status for each field
  const [errorField, setErrorField] = useState({
    day: false,
    month: false,
    year: false,
  });

  // Get current date information
  const d = new Date();
  const currentYear = d.getFullYear();
  const currentMonth = d.getMonth() + 1; // Month is zero-based
  const currentDay = d.getDate();

  // Handle input changes and update state
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // Calculate and display the user's age
  function calcAge({ year, month, day }) {
    // Ensure inputs are numbers
    year = parseInt(year);
    month = parseInt(month);
    day = parseInt(day);

    let ageYears = currentYear - year;
    let ageMonths = currentMonth - month;
    let ageDays = currentDay - day;

    // Adjust for future birth dates within the year
    if (month > currentMonth || (month === currentMonth && day > currentDay)) {
      ageYears--;
    }

    // Adjust days if the day is in the future
    if (day > currentDay) {
      ageMonths--;
      // Get the last day of the previous month
      const lastDayOfPrevMonth = new Date(
        currentMonth === 1 ? currentYear - 1 : currentYear,
        currentMonth === 1 ? 12 : currentMonth - 1,
        0
      ).getDate();
      ageDays += lastDayOfPrevMonth;
    }

    // Adjust months if negative
    if (ageMonths < 0) {
      ageMonths += 12;
    }

    // Update the calculated age
    setUserData({ years: ageYears, months: ageMonths, days: ageDays });

    // Update pluralization for age units
    setPlural({
      year: ageYears > 1 ? "s" : "",
      month: ageMonths > 1 ? "s" : "",
      day: ageDays > 1 ? "s" : ""
    });
  }

  // Validate user input and trigger age calculation if valid
  function validateInput(input) {
    let yearErrMsg = "", monthErrMsg = "", dayErrMsg = "";
    const year = Number(input.year);
    const month = Number(input.month);
    const day = Number(input.day);

    // Common error message for empty fields
    const emptyMsg = "This field is required";

    // Validate empty fields
    if (!month) monthErrMsg = emptyMsg;
    if (!year) yearErrMsg = emptyMsg;

    // Validate incorrect inputs
    if (month > 12 || month < 1) monthErrMsg = "Must be a valid month";
    if (year > currentYear) yearErrMsg = "Must be in the past";
    if (year > currentYear + 100) yearErrMsg = "pls chill, time traveler";
    if (year === currentYear && month > currentMonth) monthErrMsg = "Must be in the past";
    if (year === currentYear && month === currentMonth && day > currentDay) dayErrMsg = "Must be in the past";
    if (day > 31 || day < 1) dayErrMsg = "Must be a valid day";
    if (year < 500) yearErrMsg = "What are you? A dinosaur?";

    // Check for invalid date (e.g., February 30)
    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day) {
      dayErrMsg = "Must be a valid date";
      if (!day) dayErrMsg = emptyMsg;
    }

    // Update error states
    setErrorField({
      day: !!dayErrMsg,
      month: !!monthErrMsg,
      year: !!yearErrMsg,
    });

    setErrorMsg({ year: yearErrMsg, month: monthErrMsg, day: dayErrMsg });

    // Reset age display if any errors are present
    if (dayErrMsg || monthErrMsg || yearErrMsg) {
      setUserData({ years: "--", months: "--", days: "--" });
    }

    // Calculate age if no errors
    if (!dayErrMsg && !monthErrMsg && !yearErrMsg) {
      calcAge(inputs);
    }
  }

  // Handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    validateInput(inputs);
  }

  return (
    <div id="container">
      <form onSubmit={handleSubmit}>
        <div id="input-box">
          <div className="input-holder">
            <label htmlFor="day" className={errorField.day ? "label-error" : ""}>DAY</label>
            <input
              type="number"
              min={1}
              max={31}
              className={errorField.day ? "input-error" : ""}
              id="day"
              name="day"
              value={inputs.day || ""}
              onChange={handleChange}
            />
            <p>{errorMsg.day}</p>
          </div>

          <div className="input-holder">
            <label htmlFor="month" className={errorField.month ? "label-error" : ""}>MONTH</label>
            <input
              type="number"
              min={1}
              max={12}
              className={errorField.month ? "input-error" : ""}
              id="month"
              name="month"
              value={inputs.month || ""}
              onChange={handleChange}
            />
            <p>{errorMsg.month}</p>
          </div>

          <div className="input-holder">
            <label htmlFor="year" className={errorField.year ? "label-error" : ""}>YEAR</label>
            <input
              type="number"
              min={1}
              className={errorField.year ? "input-error" : ""}
              id="year"
              name="year"
              value={inputs.year || ""}
              onChange={handleChange}
            />
            <p>{errorMsg.year}</p>
          </div>
        </div>

        <button id="submit" type="submit">
          <img src={arrowIcon} alt="submit icon" />
        </button>
      </form>

      <h2 className="age"><span className="purple">{userData.years}</span> year{plural.year}</h2>
      <h2 className="age"><span className="purple">{userData.months}</span> month{plural.month}</h2>
      <h2 className="age"><span className="purple">{userData.days}</span> day{plural.day}</h2>
    </div>
  );
}

export default App;

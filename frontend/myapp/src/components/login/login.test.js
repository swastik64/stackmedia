import { render, screen , waitFor} from  "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect.js";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { BrowserRouter as Router } from 'react-router-dom';


import  {Login} from "./login.jsx";

const mockStore = configureStore([]);

describe('Login component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        error: null,
      },
    });
  });

  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <Router>
        <Login />
        </Router>
      </Provider>
    );
    expect(screen.getByText('F.R.I.E.N.D.S')).toBeInTheDocument();
  });

  test('form submission with valid data', async () => {
    render(
      <Provider store={store}>
        <Router>
        <Login />
        </Router>
      </Provider>
    );
    userEvent.click(screen.getByPlaceholderText('Username'));
    userEvent.type(screen.getByPlaceholderText('Username'), 'john.doe@example.com');
    userEvent.click(screen.getByPlaceholderText('Password'));
    userEvent.type(screen.getByPlaceholderText('Password'), 'password123');

    userEvent.click(screen.getByText('Login'));

    expect(screen.getByPlaceholderText("Username")).toHaveValue('john.doe@example.com');
  });

  
});
import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { countries } from "countries-list";
import MetaData from "../Layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import { getUser } from '../../utils/helpers'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Shipping = ({ shipping, saveShippingInfo }) => {
  const countriesList = Object.values(countries);
  const [phoneNo, setPhoneNo] = useState(shipping.phoneNo);
  const [country, setCountry] = useState(shipping.country);
  const [user, setUser] = useState(getUser() ? getUser() : {})
  let navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    saveShippingInfo({ phoneNo, country });
    navigate("/confirm");
  };

  return (
    <Fragment>
      <MetaData title={"Shipping Info"} />
      <CheckoutSteps shipping />
      <div className="row wrapper" style={{marginBottom: "10.2%"}}>
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-4">Shipping Info</h1>
            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={user.email}
                readOnly
                style={{ userSelect: 'none' }}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone_field">Phone Number</label>
              <input
                type="phone"
                id="phone_field"
                className="form-control"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="country_field">Country</label>
              <select
                id="country_field"
                className="form-control"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                {countriesList.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              id="shipping_btn"
              type="submit"
              className="btn btn-block py-3"
            >
              Continue <ArrowForwardIcon/>
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;

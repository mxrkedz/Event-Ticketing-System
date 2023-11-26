import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../Layout/MetaData";
import InquiryForm from "./InquiryForm";

const InquiryPage = () => {

  return (
    <Fragment>
      <Fragment>
        <div className="container" style={{ marginBottom: "1.63%" }}>
          <h1 className="my-4 text-left">Feedback & Inquiry</h1>
          <hr />
          <section id="posts" className="mt-5">
            <div className="container">
              <InquiryForm/>
            </div>
          </section>
        </div>
      </Fragment>
    </Fragment>

  );
};

export default InquiryPage
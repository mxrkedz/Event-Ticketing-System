import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getToken } from "../../utils/helpers";
import axios from "axios";
import Loader from "../Layout/Loader";

const UserSalesChart = ({ data }) => {
  const [sales, setSales] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userSales = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/customer-sales`,
        config
      );
      setSales(data.customerSales);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  const barColors = ["#1f77b4", "#ff7f0e", "#2ca02c"];
  useEffect(() => {
    userSales();
    // allUsers()
  }, []);

  return (
    <div>
      <h2 style={{color: "white"}}>User Sales Chart</h2>
      <ResponsiveContainer width="100%" height={600}>
        {loading ? (
          <Loader />
        ) : (
          <BarChart data={sales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="userDetails.name" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar dataKey="total">
              {sales.map((item, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % 20]} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
export default UserSalesChart;

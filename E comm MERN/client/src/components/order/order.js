import React, { useEffect, useState } from "react";
import "./order.css";
import OrderHeader from "../Others/Header/orderHeader";
import axios from "axios";
import Footer from "../Others/Header/Footer/mainFooter";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders for the logged-in user
  const fetchOrders = async () => {
    try {
      const localUser = JSON.parse(localStorage.getItem("userdata"));
      if (!localUser) {
        setLoading(false);
        return;
      }
      const response = await axios.get("http://localhost:8081/getOrders", {
        params: { userId: localUser._id },
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Auto-confirm pending orders after 2 minutes from creation time
  useEffect(() => {
    orders.forEach((order) => {
      if (order.orderStatus === "Pending") {
        const createdTime = new Date(order.createdAt).getTime();
        const now = Date.now();
        const delay = Math.max(0, 2 * 60 * 1000 - (now - createdTime));
        // Schedule auto-confirm for each pending order after the remaining delay
        setTimeout(async () => {
          try {
            const response = await axios.put("http://localhost:8081/confirmOrderStatus", {
              orderId: order._id,
            });
            console.log("Order auto-confirmed:", response.data.order);
            fetchOrders(); // Refresh orders after auto-confirmation
          } catch (error) {
            console.error("Error auto confirming order:", error);
          }
        }, delay);
      }
    });
  }, [orders]);

  // Handler for canceling an order
  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.put("http://localhost:8081/cancelOrder", { orderId });
      if (response.status === 200) {
        alert(response.data.message);
        fetchOrders();
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(
        error.response?.data?.message || "Error cancelling order. Please try again."
      );
    }
  };

  return (
    <>
      <OrderHeader />
      <section id="orderSection">
        <h2>Your Orders</h2>
        {loading ? (
          <p>Loading orders...</p>
        ) : orders && orders.length > 0 ? (
          <div id="ordersContainer">
            {orders.map((order) => (
              <div key={order._id} id="orderItem">
                <h3>Order ID: {order._id}</h3>
                <p>
                  Delivery Date: {new Date(order.deliveryDate).toLocaleDateString()}
                </p>
                <p>Status: {order.orderStatus}</p>
                <div id="orderProducts">
                  {order.orders.map((prod, index) => (
                    <div key={index} id="orderProduct">
                      {prod.image && (
                        <img
                          src={`http://localhost:8081/ProductImages/${prod.image}`}
                          alt={prod.brandname}
                        />
                      )}
                      <div id="orderProductDetails">
                        <span>{prod.brandname}</span>
                        <h5>{prod.description}</h5>
                        <h4>Price: ₹{prod.price}</h4>
                        <h3>Quantity: {prod.quantity}</h3>
                      </div>
                    </div>
                  ))}
                </div>
                {order.orderStatus === "Pending" && (
                  <button onClick={() => handleCancelOrder(order._id)}>
                    Cancel Order
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No orders found.</p>
        )}
      </section>
      < Footer />
    </>
  );
};

export default Order;
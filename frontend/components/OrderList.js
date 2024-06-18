import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, setSizeFilter } from '../state/store';

const formatOrder = (order) => {
  const toppingCount = order.toppings.length;
  const toppingsText = toppingCount === 0
    ? 'no toppings'
    : `${toppingCount} topping${toppingCount > 1 ? 's' : ''}`;

  return `${order.fullName} ordered a size ${order.size} pizza with ${toppingsText}.`;
};

export default function OrderList() {
  const dispatch = useDispatch();
  const orders = useSelector(state => state.orders.orders);
  const loading = useSelector(state => state.orders.loading);
  const error = useSelector(state => state.orders.error);
  const sizeFilter = useSelector(state => state.filters.size);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleFilterClick = (size) => {
    dispatch(setSizeFilter(size));
  };

  const filteredOrders = sizeFilter === 'All' ? orders : orders.filter(order => order.size === sizeFilter);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div id="orderList">
      <h2>Pizza Orders</h2>
      <ol>
        {
          filteredOrders.map((order, index) => (
            <li key={index}>
              <div>
                {formatOrder(order)}
              </div>
            </li>
          ))
        }
      </ol>
      <div id="sizeFilters">
        Filter by size:
        {
          ['All', 'S', 'M', 'L'].map(size => {
            const className = `button-filter${size === sizeFilter ? ' active' : ''}`;
            return (
              <button
                data-testid={`filterBtn${size}`}
                className={className}
                key={size}
                onClick={() => handleFilterClick(size)}
              >
                {size}
              </button>
            );
          })
        }
      </div>
    </div>
  );
}


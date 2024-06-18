import React, { useEffect } from 'react'
import { fetchPizzaHistory } from '../state/pizzaSlice'
import { useDispatch, useSelector } from'react-redux'
import { setSizeFilter, selectFilteredPizzaHistory } from '../state/sizeFilterSlice'

export default function OrderList() {
  const dispatch = useDispatch()
  const pizzaHistory = useSelector(selectFilteredPizzaHistory)
  const loading = useSelector(state => state.pizza.loading)
  const error = useSelector(state => state.pizza.error)
  const filterSize = useSelector(state => state.sizeFilter)

  useEffect(() => {
    dispatch(fetchPizzaHistory())
  }, [dispatch]);

  const handleFilterClick = (size) => {
    dispatch(setSizeFilter(size))
  };

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div id="orderList">
      <h2>Pizza Orders</h2>
      <ol>
        {pizzaHistory.map((pizza, index) => (
              <li key={index}>
                <div>
                  {pizza.customer} ordered a size {pizza.size} with {' '}
                  {pizza.toppings && pizza.toppings.length > 0
                    ? pizza.toppings.length
                    : 'no'}{' '}
                    toppings
                </div>
              </li>
            ))}
      </ol>
      <div id="sizeFilters">
        Filter by size:
        {['All', 'S', 'M', 'L'].map(size => {
            const className = `button-filter${size === filterSize ? ' active' : ''}`
            return (
              <button
                data-testid={`filterBtn${size}`}
                className={className}
                onClick = {() => handleFilterClick(size)}
                key={size}>{size}</button>
          );
        })}
      </div>
    </div>
  )
}